"use server";

import { db } from "@/db";
import {
  productsTable,
  variantsTable,
  productToCategoriesTable,
  typesTable,
  categoriesTable,
} from "@/db/schema";
import { and, eq, ilike, or, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Helper function to convert protocol-relative URLs to absolute URLs
function withAbsoluteImageUrls<
  T extends { images?: { url: string }[] | null } | null | undefined
>(product: T): T {
  if (!product || !product.images) {
    return product;
  }

  return {
    ...product,
    images: product.images.map((image) => ({
      ...image,
      url: image.url.startsWith("//") ? `https:${image.url}` : image.url,
    })),
  };
}

export async function searchProducts(query: string) {
  if (!query) {
    return [];
  }

  const searchResults = await db
    .selectDistinct({ product: productsTable })
    .from(productsTable)
    .leftJoin(typesTable, eq(productsTable.typeId, typesTable.id))
    .leftJoin(
      productToCategoriesTable,
      eq(productsTable.id, productToCategoriesTable.productId)
    )
    .leftJoin(
      categoriesTable,
      eq(productToCategoriesTable.categoryId, categoriesTable.id)
    )
    .where(
      and(
        eq(productsTable.status, "published"),
        or(
          ilike(productsTable.name, `%${query}%`),
          ilike(productsTable.description, `%${query}%`),
          ilike(typesTable.name, `%${query}%`),
          ilike(categoriesTable.name, `%${query}%`)
        )
      )
    )
    .limit(10);

  return searchResults.map((r) => withAbsoluteImageUrls(r.product)!);
}

export async function getProductById(id: number) {
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.id, id),
    with: {
      variants: true,
      productToCategories: {
        with: {
          category: true,
        },
      },
      type: true,
    },
  });
  return withAbsoluteImageUrls(product);
}

type VariantData = {
  id?: string;
  color: string;
  size: string;
  sku?: string;
  inventory: string;
  image?: string;
  cost: string;
};

export async function createOrUpdateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const rawVariants = formData.getAll("variants");

  // This is a bit of a hack to get the variants from the form data
  const variants: VariantData[] = JSON.parse(
    JSON.stringify(
      rawVariants.reduce((acc, _, i) => {
        const id = formData.get(`variants[${i}][id]`);
        const color = formData.get(`variants[${i}][color]`);
        const size = formData.get(`variants[${i}][size]`);
        const sku = formData.get(`variants[${i}][sku]`);
        const inventory = formData.get(`variants[${i}][inventory]`);
        const image = formData.get(`variants[${i}][image]`);
        const cost = formData.get(`variants[${i}][cost]`);

        // @ts-expect-error - acc is an array of objects
        acc[i] = { id, color, size, sku, inventory, image, cost };
        return acc;
      }, [])
    )
  );

  const name = formData.get("name") as string;
  const productData = {
    name: name,
    slug: slugify(name),
    description: formData.get("description") as string,
    price: formData.get("price") as string,
    typeId: Number(formData.get("typeId")),
  };

  if (id) {
    // Update
    const productId = parseInt(id, 10);
    await db
      .update(productsTable)
      .set(productData)
      .where(eq(productsTable.id, productId));

    // Handle variants
    for (const variant of variants) {
      const variantData = {
        productId: productId,
        color: variant.color,
        size: variant.size,
        sku: variant.sku,
        inventory: parseInt(variant.inventory, 10),
        cost: variant.cost,
        image: variant.image,
      };
      if (variant.id) {
        await db
          .update(variantsTable)
          .set(variantData)
          .where(eq(variantsTable.id, parseInt(variant.id, 10)));
      } else {
        await db.insert(variantsTable).values(variantData);
      }
    }
  } else {
    // Create
    const [newProduct] = await db
      .insert(productsTable)
      .values(productData)
      .returning();

    if (variants.length > 0) {
      const variantsToInsert = variants.map((variant) => ({
        productId: newProduct.id,
        color: variant.color,
        size: variant.size,
        sku: variant.sku,
        inventory: parseInt(variant.inventory, 10),
        cost: variant.cost,
        image: variant.image,
      }));
      await db.insert(variantsTable).values(variantsToInsert);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function getAvailableFilterValues() {
  const sizes = await db
    .selectDistinct({ size: variantsTable.size })
    .from(variantsTable)
    .orderBy(variantsTable.size);

  const colors = await db
    .selectDistinct({ color: variantsTable.color })
    .from(variantsTable)
    .orderBy(variantsTable.color);

  return {
    sizes: sizes.map((s) => s.size),
    colors: colors.map((c) => c.color),
  };
}

export async function getRelatedProducts(
  productId: number,
  categoryIds: number[]
) {
  if (categoryIds.length === 0) {
    return [];
  }

  const relatedProducts = await db.query.productsTable.findMany({
    with: {
      variants: true,
      productToCategories: {
        where: (productToCategories, { inArray }) =>
          inArray(productToCategories.categoryId, categoryIds),
      },
    },
    where: (products, { and, eq, exists, not }) =>
      and(
        not(eq(products.id, productId)),
        exists(
          db
            .select()
            .from(productToCategoriesTable)
            .where(
              and(
                eq(productToCategoriesTable.productId, products.id),
                inArray(productToCategoriesTable.categoryId, categoryIds)
              )
            )
        )
      ),
    limit: 4,
  });

  return relatedProducts.map((p) => withAbsoluteImageUrls(p)!);
} 