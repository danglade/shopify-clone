"use server";

import { db } from "@/db";
import { heroSlidesTable } from "@/db/schema";
import { asc } from "drizzle-orm";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { revalidatePath } from "next/cache";

interface Slide {
  id?: number | string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonPosition?: string;
  buttonHorizontalPosition?: string;
}

export async function getHeroSlides() {
  return await db.select().from(heroSlidesTable).orderBy(asc(heroSlidesTable.order));
}

export async function updateHeroSlides(slides: Slide[]) {
  // A simple way to handle reordering, additions, and deletions
  // is to wipe and re-insert.
  await db.delete(heroSlidesTable);

  if (slides.length > 0) {
    const slidesToInsert = slides.map((slide, index) => ({
      ...slide,
      order: index,
    }));
    await db.insert(heroSlidesTable).values(slidesToInsert as (typeof heroSlidesTable.$inferInsert)[]);
  }

  revalidatePath("/"); // Revalidate the home page to show changes
}


export async function uploadHeroImage(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided.");
  }
  
  if(file.size === 0) {
    throw new Error("File is empty.");
  }

  // Basic validation (can be expanded)
  if (!file.type.startsWith("image/")) {
    throw new Error("Invalid file type. Please upload an image.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create a unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
  
  // Save to the public directory
  const publicDir = join(process.cwd(), "public", "uploads", "hero");
  await mkdir(publicDir, { recursive: true }); // Ensure directory exists
  await writeFile(join(publicDir, filename), buffer);

  // Return the public path
  const publicPath = `/uploads/hero/${filename}`;
  return { success: true, url: publicPath };
} 