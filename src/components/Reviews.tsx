import { InferSelectModel } from "drizzle-orm";
import { productsTable, reviewsTable } from "@/db/schema";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";

type Review = InferSelectModel<typeof reviewsTable>;
type Product = InferSelectModel<typeof productsTable> & {
  reviews: Review[];
};

type ReviewsProps = {
  product: Product;
};

export default function Reviews({ product }: ReviewsProps) {
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="flex items-center mb-4">
        {product.reviews.length > 0 ? (
          <>
            <StarRating rating={averageRating} />
            <p className="ml-2 text-sm text-gray-600">
              Based on {product.reviews.length} reviews
            </p>
          </>
        ) : (
          <p className="text-gray-600">No reviews yet.</p>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {product.reviews.map((review) => (
          <div key={review.id} className="py-4">
            <div className="flex items-center mb-1">
              <StarRating rating={review.rating} />
              <p className="ml-auto text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="font-semibold">{review.author}</p>
            <p className="mt-1 text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      <ReviewForm productId={product.id} />
    </div>
  );
}
