"use server";

import { db } from "@/db";
import { reviewsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createReview(formData: FormData) {
  const productId = parseInt(formData.get("productId") as string);
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;
  const author = formData.get("author") as string;

  await db.insert(reviewsTable).values({
    productId,
    rating,
    comment,
    author,
  });

  revalidatePath(`/product/.*`);
}

export async function getReviews() {
  const reviews = await db.query.reviewsTable.findMany({
    with: {
      product: true,
    },
    orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
  });
  return reviews;
}

export async function updateReviewStatus(
  id: number,
  status: "approved" | "rejected"
) {
  await db
    .update(reviewsTable)
    .set({ status })
    .where(eq(reviewsTable.id, id));

  revalidatePath("/admin/reviews");
  revalidatePath("/product/.*");
} 