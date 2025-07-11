"use server";

import { db } from "@/db";
import { settingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSetting(key: string): Promise<string | null> {
  const setting = await db
    .select({ value: settingsTable.value })
    .from(settingsTable)
    .where(eq(settingsTable.key, key))
    .limit(1);

  return setting[0]?.value ?? null;
}

export async function updateSetting(key: string, value: string) {
  await db
    .insert(settingsTable)
    .values({ key, value })
    .onConflictDoUpdate({
      target: settingsTable.key,
      set: { value },
    });

  // Revalidate paths that might be affected
  if (key.startsWith("hero_")) {
    revalidatePath("/");
  }
} 