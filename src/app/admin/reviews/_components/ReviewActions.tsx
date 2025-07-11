"use client";

import { updateReviewStatus } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

type ReviewActionsProps = {
  reviewId: number;
  status: string;
};

export default function ReviewActions({
  reviewId,
  status,
}: ReviewActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(() => {
      updateReviewStatus(reviewId, "approved");
    });
  };

  const handleReject = () => {
    startTransition(() => {
      updateReviewStatus(reviewId, "rejected");
    });
  };

  if (status === "approved") {
    return (
      <Button variant="outline" size="sm" onClick={handleReject}>
        Reject
      </Button>
    );
  }

  if (status === "rejected") {
    return (
      <Button variant="outline" size="sm" onClick={handleApprove}>
        Approve
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleApprove} disabled={isPending}>
        Approve
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={handleReject}
        disabled={isPending}
      >
        Reject
      </Button>
    </div>
  );
} 