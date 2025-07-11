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
import Image from "next/image";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

function QuantityInput({ item }: { item: CartItem }) {
  const { updateQuantity } = useCartStore();

  return (
    <div className="flex items-center border rounded-md">
      <button
        onClick={() => {
          if (item.variant.id) {
            updateQuantity(item.variant.id, item.quantity - 1);
          }
        }}
        className="px-3 py-1 text-lg"
        disabled={item.quantity <= 1}
      >
        -
      </button>
      <span className="px-3 py-1">{item.quantity}</span>
      <button
        onClick={() => {
          if (item.variant.id) {
            updateQuantity(item.variant.id, item.quantity + 1);
          }
        }}
        className="px-3 py-1 text-lg"
      >
        +
      </button>
    </div>
  );
}

function CartItem({ item }: { item: CartItem }) {
  const { removeItem } = useCartStore();
  const image = item.product.images?.[0]?.url;

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="h-24 w-24 overflow-hidden rounded">
        {image && image.length > 0 ? (
          <Image
            src={
              image.startsWith("//")
                ? `https:${image}`
                : image
            }
            alt={item.product.name}
            width={96}
            height={96}
            className="object-cover"
          />
        ) : (
          <Image
            src="https://via.placeholder.com/96"
            alt="Default product image"
            width={96}
            height={96}
            className="object-cover"
          />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-medium">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">
          {item.variant.color} / {item.variant.size}
        </p>
        <p className="text-lg font-semibold">${item.product.price}</p>
        <div className="flex items-center gap-4">
          <QuantityInput item={item} />
          <button
            onClick={() => {
              if (item.variant.id) {
                removeItem(item.variant.id);
              }
            }}
            className="text-sm text-muted-foreground underline hover:text-primary"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart({ children }: { children: React.ReactNode }) {
  const { items, clearCart, isOpen, toggleCart } = useCartStore();
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
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-4">
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        {items.length > 0 ? (
          <>
            <div className="px-4 text-sm text-muted-foreground">
              {subtotal < 75 ? (
                `Spend $${(75 - subtotal).toFixed(
                  2
                )} more and get free shipping!`
              ) : (
                "You've got free shipping!"
              )}
            </div>
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
                <p className="text-xs text-muted-foreground">
                  Taxes and shipping calculated at checkout
                </p>
                <Button className="w-full" onClick={handleCheckout}>
                  Protected Checkout | ${subtotal.toFixed(2)}
                </Button>
                <Button
                  variant="link"
                  className="w-full text-center"
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