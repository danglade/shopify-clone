"use client";

import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { createOrder } from "@/app/actions/orders";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.product.price),
      0
    );
  }, [items]);

  async function handlePlaceOrder(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    try {
      await createOrder({
        customerName: name,
        customerEmail: email,
        items: items,
        total: subtotal.toString(),
      });
      clearCart();
      router.push("/thank-you");
    } catch (error) {
      console.error("Failed to create order:", error);
      // Handle error, e.g., show a toast notification
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl">Your cart is empty.</h1>
        <p>Add some products to get started.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid md:grid-cols-2 gap-12 py-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.variant.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.variant.color} / {item.variant.size} (x{item.quantity})
                </p>
              </div>
              <p>${(item.quantity * parseFloat(item.product.price)).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Information</h2>
        <form action={handlePlaceOrder} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </div>
    </div>
  );
} 