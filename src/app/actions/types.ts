"use server";

import { db } from "@/db";
import { typesTable } from "@/db/schema";
import { slugify } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getTypes() {
  const types = await db.select().from(typesTable);
  return types;
}

export async function getTypeById(id: number) {
  const type = await db.query.typesTable.findFirst({
    where: eq(typesTable.id, id),
  });
  return type;
}

export async function createOrUpdateType(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  const slug = slugify(name);

  const typeValues = {
    name,
    slug,
  };

  try {
    if (id) {
      await db
        .update(typesTable)
        .set(typeValues)
        .where(eq(typesTable.id, parseInt(id)));
    } else {
      await db.insert(typesTable).values(typeValues);
    }
  } catch (error) {
    console.error("Failed to create or update type", error);
    throw new Error("Failed to create or update type.");
  }

  revalidatePath("/admin/types");
  redirect("/admin/types");
} 