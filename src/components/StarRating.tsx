"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
  className?: string;
  onClick?: () => void;
};

export default function StarRating({
  rating,
  maxRating = 5,
  className,
  onClick,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center", className)} onClick={onClick}>
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-5 w-5",
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
} 