"use server";

import { db } from "@/db";
import { settingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSetting(key: string) {
  const setting = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, key));
  return setting[0]?.value ?? null;
}

export async function updateSetting(formData: FormData) {
  const key = formData.get("key") as string;
  const value = formData.get("value") as string;

  if (!key) {
    throw new Error("Setting key is required.");
  }

  await db
    .insert(settingsTable)
    .values({ key, value })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value } });

  revalidatePath("/"); // Revalidate home page and others that might use this
  revalidatePath("/admin/settings");
} 