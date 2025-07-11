"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import StarRating from "./StarRating";
import { createReview } from "@/app/actions/reviews";

type ReviewFormProps = {
  productId: number;
};

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);

  return (
    <form
      action={createReview}
      className="mt-6 border-t border-gray-200 pt-6"
    >
      <h3 className="text-lg font-medium">Write a review</h3>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="mt-4">
        <Label>Rating</Label>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <StarRating
              key={i}
              rating={i + 1 > rating ? 0 : i + 1}
              maxRating={1}
              className="cursor-pointer"
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="author">Your Name</Label>
        <Input id="author" name="author" type="text" required />
      </div>

      <div className="mt-4">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea id="comment" name="comment" />
      </div>

      <Button type="submit" className="mt-4">
        Submit Review
      </Button>
    </form>
  );
} 