"use server";

import { db } from "@/db";
import { typesTable } from "@/db/schema";

export async function getTypes() {
  const types = await db.select().from(typesTable);
  return types;
} 