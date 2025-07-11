import { getReviews } from "@/app/actions/reviews";
import StarRating from "@/components/StarRating";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import ReviewActions from "./_components/ReviewActions";
import { Badge } from "@/components/ui/badge";

export default async function ReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Product Reviews</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <Link
                  href={`/product/${review.product.slug}`}
                  className="hover:underline"
                >
                  {review.product.name}
                </Link>
              </TableCell>
              <TableCell>{review.author}</TableCell>
              <TableCell>
                <StarRating rating={review.rating} />
              </TableCell>
              <TableCell>{review.comment}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    review.status === "approved"
                      ? "default"
                      : review.status === "rejected"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {review.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(review.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <ReviewActions reviewId={review.id} status={review.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 