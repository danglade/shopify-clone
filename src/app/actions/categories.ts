"use server";

import { db } from "@/db";
import { categoriesTable, productToCategoriesTable, productsTable, typesTable } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";

export async function getCategories() {
  const categories = await db.select().from(categoriesTable);
  return categories;
}

export async function getNavigationData() {
  const types = await db.select().from(typesTable);

  const navigationData = await Promise.all(
    types.map(async (type) => {
      const categories = await db
        .selectDistinct({
          id: categoriesTable.id,
          name: categoriesTable.name,
          slug: categoriesTable.slug,
          description: categoriesTable.description,
        })
        .from(categoriesTable)
        .leftJoin(
          productToCategoriesTable,
          eq(categoriesTable.id, productToCategoriesTable.categoryId)
        )
        .leftJoin(
          productsTable,
          eq(productToCategoriesTable.productId, productsTable.id)
        )
        .where(eq(productsTable.typeId, type.id));

      return {
        ...type,
        categories,
      };
    })
  );

  return navigationData;
}

export async function getCategoryById(id: number) {
  const category = await db
    .select()
    .from(categoriesTable)
    .where(eq(categoriesTable.id, id));
  return category[0];
}

export async function createOrUpdateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    throw new Error("Category name is required.");
  }

  const slug = slugify(name);

  if (id) {
    // Update
    await db
      .update(categoriesTable)
      .set({ name, description, slug })
      .where(eq(categoriesTable.id, parseInt(id)));
  } else {
    // Create
    await db.insert(categoriesTable).values({
      name,
      description,
      slug,
    });
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
} 