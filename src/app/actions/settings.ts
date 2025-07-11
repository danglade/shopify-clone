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

export async function updateSettings(formData: FormData) {
  const announcementHtml = formData.get("announcement_bar_html") as string;
  const announcementDismissible =
    formData.get("announcement_dismissible") === "on";
  const isHeaderSticky = formData.get("sticky_header") === "on";

  const settingsToUpdate = [
    { key: "announcement_bar_html", value: announcementHtml },
    {
      key: "announcement_dismissible",
      value: announcementDismissible.toString(),
    },
    { key: "sticky_header", value: isHeaderSticky.toString() },
  ];

  for (const setting of settingsToUpdate) {
    await db
      .insert(settingsTable)
      .values(setting)
      .onConflictDoUpdate({
        target: settingsTable.key,
        set: { value: setting.value },
      });
  }

  revalidatePath("/"); // Revalidate home page and others that might use this
  revalidatePath("/admin/settings");
} 