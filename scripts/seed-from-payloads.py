import os
import re
import json
from decimal import Decimal
import psycopg2
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env.local")

DATABASE_URL = "postgres://neondb_owner:npg_E4jSO5teGDfL@ep-crimson-dust-adyee4qt-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
PAYLOADS_DIR = "scripts/product_payloads"

def slugify(text):
    text = text.lower()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^\w-]+", "", text)
    text = re.sub(r"--+", "-", text)
    text = text.strip("-")
    return text

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

def main():
    print("Starting database seeding from payloads...")
    conn = None
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()

        payload_files = [f for f in os.listdir(PAYLOADS_DIR) if f.endswith(".json")]
        print(f"Found {len(payload_files)} product payloads to process.")

        for filename in payload_files:
            with open(os.path.join(PAYLOADS_DIR, filename), "r") as f:
                product = json.load(f)

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
    
    print("Finished seeding database from payloads.")

if __name__ == "__main__":
    main() 