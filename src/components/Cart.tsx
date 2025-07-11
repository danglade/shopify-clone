"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { useCartStore, type CartItem } from "@/store/cart";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import Image from "next/image";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

function CartItem({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-16 w-16 overflow-hidden rounded">
        {item.product.images?.[0] ? (
          <Image
            src={
              item.product.images[0].url.startsWith("//")
                ? `https:${item.product.images[0].url}`
                : item.product.images[0].url
            }
            alt={item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full"></div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {item.variant.color} / {item.variant.size}
        </p>
        <p className="text-sm font-semibold">${item.product.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => {
            if (item.variant.id) {
              updateQuantity(item.variant.id, parseInt(e.target.value));
            }
          }}
          className="w-16"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            if (item.variant.id) {
              removeItem(item.variant.id);
            }
          }}
        >
          &times;
        </Button>
      </div>
    </div>
  );
}

export default function Cart({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.quantity * parseFloat(item.product.price),
      0
    );
  }, [items]);

  function handleCheckout() {
    router.push("/checkout");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-4">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem key={item.variant.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="px-4 py-4 border-t">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button className="w-full" onClick={handleCheckout}>
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
} 