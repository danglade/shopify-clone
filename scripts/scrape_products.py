import os
import re
import time
import asyncio
from decimal import Decimal
import psycopg2
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from playwright.async_api import async_playwright
import json

load_dotenv(dotenv_path=".env.local")

DATABASE_URL = "postgres://neondb_owner:npg_E4jSO5teGDfL@ep-crimson-dust-adyee4qt-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
BASE_URL = "https://www.youngla.com"
ALL_PRODUCTS_URL = f"{BASE_URL}/collections/all-products-1"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

async def get_all_product_handles(page):
    print(f"Fetching all product handles from {ALL_PRODUCTS_URL}...")
    await page.goto(ALL_PRODUCTS_URL)

    # Scroll to the bottom of the page to load all products, waiting between scrolls
    last_height = await page.evaluate("document.body.scrollHeight")
    while True:
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(3000)  # Wait for new products to load
        new_height = await page.evaluate("document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
        print("Scrolled to load more products...")

    soup = BeautifulSoup(await page.content(), "html.parser")

    product_handles = set()
    for a_tag in soup.find_all("a", href=re.compile(r"/products/")):
        href = a_tag.get("href")
        if href:
            handle = href.split("?")[0].replace("/products/", "")
            # Exclude non-product links that might match
            if "/products/pre-shipment-inspection" not in href:
                product_handles.add(handle)

    print(f"Found {len(product_handles)} unique product handles.")
    return list(product_handles)


async def get_product_data(page, handle):
    url = f"{BASE_URL}/products/{handle}.js"
    try:
        await page.goto(url)
        json_content = await page.evaluate("() => document.body.textContent")
        return json.loads(json_content)
    except Exception as e:
        print(f"Error fetching or parsing product data for handle {handle}: {e}")
        return None

def get_or_create_category(cursor, name):
    slug = slugify(name)
    cursor.execute("SELECT id FROM categories WHERE slug = %s", (slug,))
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        cursor.execute(
            "INSERT INTO categories (name, slug) VALUES (%s, %s) RETURNING id",
            (name, slug),
        )
        return cursor.fetchone()[0]

def slugify(text):
    text = text.lower()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^\w-]+", "", text)
    text = re.sub(r"--+", "-", text)
    text = text.strip("-")
    return text

async def main():
    print("Starting product scraping and seeding...")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        conn = None
        try:
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor()

            all_product_handles = await get_all_product_handles(page)

            print(f"Found a total of {len(all_product_handles)} unique products.")

            for handle in list(all_product_handles):
                await asyncio.sleep(0.5)  # Delay to avoid rate-limiting

                product = await get_product_data(page, handle)

                if not product:
                    continue
                
                print(f"Processing product: {product.get('title')}")

                # Create or get categories
                category_ids = []
                if product.get("type"):
                    category_ids.append(get_or_create_category(cursor, product.get("type")))
                for tag in product.get("tags", []):
                    category_ids.append(get_or_create_category(cursor, tag))

                # Insert product
                image_urls = [{"url": img} for img in product.get("images", [])]

                cursor.execute(
                    """
                    INSERT INTO products (name, slug, description, type, price, images, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (slug) DO NOTHING
                    RETURNING id
                    """,
                    (
                        product.get("title"),
                        product.get("handle"),
                        product.get("description"),
                        product.get("type"),
                        Decimal(product.get("price", 0)) / 100,
                        json.dumps(image_urls),
                        "published",
                    ),
                )
                
                product_id_result = cursor.fetchone()
                if not product_id_result:
                    print(f"Skipping product {product.get('title')} as it already exists.")
                    continue
                
                product_id = product_id_result[0]

                # Link product to categories
                for category_id in set(category_ids):
                    cursor.execute(
                        "INSERT INTO product_to_categories (product_id, category_id) VALUES (%s, %s) ON CONFLICT DO NOTHING",
                        (product_id, category_id),
                    )

                # Insert variants
                product_options = {opt['name'].lower(): f"option{opt['position']}" for opt in product.get('options', [])}
                
                for variant in product.get("variants", []):
                    size_option_key = product_options.get('size')
                    color_option_key = product_options.get('color')

                    db_size = (variant.get(size_option_key) if size_option_key else None) or "One Size"
                    db_color = (variant.get(color_option_key) if color_option_key else None) or "Default"
                    
                    variant_image = variant.get("featured_image", {}).get("src") if variant.get("featured_image") else None

                    cursor.execute(
                        """
                        INSERT INTO variants (product_id, size, color, image, sku, inventory, cost)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                        """,
                        (
                            product_id,
                            db_size,
                            db_color,
                            variant_image,
                            variant.get("sku"),
                            100,  # Default inventory
                            Decimal(variant.get("price", 0)) / 100, # Using price as cost
                        ),
                    )

                conn.commit()

        except psycopg2.Error as e:
            print(f"Database error: {e}")
            if conn:
                conn.rollback()
        finally:
            if conn:
                conn.close()
            await browser.close()

    print("Finished scraping and seeding products.")

if __name__ == "__main__":
    asyncio.run(main()) 