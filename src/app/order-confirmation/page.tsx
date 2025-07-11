import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircleIcon } from "lucide-react";

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col items-center justify-center text-center">
      <CheckCircleIcon className="h-16 w-16 text-green-500" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        Thank you for your order!
      </h1>
      <p className="mt-4 text-muted-foreground">
        Your order has been placed successfully and is being processed.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
} 