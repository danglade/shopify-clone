"use server";

import { db } from "@/db";
import {
  productsTable,
  productToCategoriesTable,
  variantsTable,
  typesTable,
  categoriesTable,
} from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq, and, inArray, not, or, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function createOrUpdateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const typeId = formData.get("typeId") as string;
  const categoryIds = formData.getAll("categoryIds") as string[];

  const variantsData: any[] = [];
  formData.forEach((value, key) => {
    const match = key.match(/variants\[(\d+)\]\[(\w+)\]/);
    if (match) {
      const index = parseInt(match[1]);
      const field = match[2];
      if (!variantsData[index]) {
        variantsData[index] = {};
      }
      variantsData[index][field] = value;
    }
  });

  const slug = slugify(name);

  const productValues = {
    name,
    slug,
    description,
    price,
    typeId: typeId ? parseInt(typeId) : null,
    updatedAt: new Date(),
  };

  try {
    await db.transaction(async (tx) => {
      if (id) {
        // Update product
        const [updatedProduct] = await tx
          .update(productsTable)
          .set(productValues)
          .where(eq(productsTable.id, parseInt(id)))
          .returning();

        // --- Handle Variants ---
        const existingVariants = await tx
          .select()
          .from(variantsTable)
          .where(eq(variantsTable.productId, updatedProduct.id));

        const submittedVariantIds = variantsData
          .map((v) => (v.id ? parseInt(v.id) : null))
          .filter((id) => id !== null);

        // Delete variants that were removed
        const variantsToDelete = existingVariants.filter(
          (v) => !submittedVariantIds.includes(v.id)
        );
        if (variantsToDelete.length > 0) {
          await tx
            .delete(variantsTable)
            .where(
              inArray(
                variantsTable.id,
                variantsToDelete.map((v) => v.id)
              )
            );
        }

        // Update or Create variants
        for (const variant of variantsData) {
          const variantValues = {
            productId: updatedProduct.id,
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            cost: variant.cost,
            inventory: parseInt(variant.inventory),
            image: variant.image,
          };
          if (variant.id) {
            // Update existing variant
            await tx
              .update(variantsTable)
              .set(variantValues)
              .where(eq(variantsTable.id, parseInt(variant.id)));
          } else {
            // Create new variant
            await tx.insert(variantsTable).values(variantValues);
          }
        }

        // Update categories
        await tx
          .delete(productToCategoriesTable)
          .where(eq(productToCategoriesTable.productId, updatedProduct.id));

        const newProductCategories = categoryIds.map((catId) => ({
          productId: updatedProduct.id,
          categoryId: parseInt(catId),
        }));

        if (newProductCategories.length > 0) {
          await tx
            .insert(productToCategoriesTable)
            .values(newProductCategories);
        }
      } else {
        // Create new product
        const [newProduct] = await tx
          .insert(productsTable)
          .values(productValues)
          .returning();

        // Create variants for the new product
        if (variantsData.length > 0) {
          const newVariants = variantsData.map((variant) => ({
            productId: newProduct.id,
            size: variant.size,
            color: variant.color,
            sku: variant.sku,
            cost: variant.cost,
            inventory: parseInt(variant.inventory),
            image: variant.image,
          }));
          await tx.insert(variantsTable).values(newVariants);
        }

        // Create categories for the new product
        const newProductCategories = categoryIds.map((catId) => ({
          productId: newProduct.id,
          categoryId: parseInt(catId),
        }));

        if (newProductCategories.length > 0) {
          await tx
            .insert(productToCategoriesTable)
            .values(newProductCategories);
        }
      }
    });
  } catch (error) {
    console.error("Failed to create or update product", error);
    throw new Error("Failed to create or update product.");
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/products/[id]/edit", "page");
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

export async function getRelatedProducts(productId: number, categoryIds: number[]) {
  if (categoryIds.length === 0) {
    return [];
  }

  const relatedProducts = await db
    .selectDistinct({ product: productsTable })
    .from(productsTable)
    .leftJoin(
      productToCategoriesTable,
      eq(productsTable.id, productToCategoriesTable.productId)
    )
    .where(
      and(
        inArray(productToCategoriesTable.categoryId, categoryIds),
        not(eq(productsTable.id, productId))
      )
    )
    .limit(4);

  return relatedProducts.map((item) => withAbsoluteImageUrls(item.product)!);
} 