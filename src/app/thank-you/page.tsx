import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Your order has been placed successfully.
      </p>
      <Link href="/" className="text-indigo-600 hover:underline">
        Continue Shopping
      </Link>
    </div>
  );
} 