"use server";

import { db } from "@/db";
import {
  productsTable,
  productToCategoriesTable,
  variantsTable,
} from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq, and, inArray, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
    },
  });
  return product;
}

export async function createOrUpdateProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const categoryIds = formData.getAll("categoryIds") as string[];

  const slug = slugify(name);

  const productValues = {
    name,
    slug,
    description,
    price,
    updatedAt: new Date(),
  };

  try {
    await db.transaction(async (tx) => {
      if (id) {
        // Update
        const [updatedProduct] = await tx
          .update(productsTable)
          .set(productValues)
          .where(eq(productsTable.id, parseInt(id)))
          .returning();

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
        // Create
        const [newProduct] = await tx
          .insert(productsTable)
          .values(productValues)
          .returning();

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

  return relatedProducts.map(item => item.product);
} 