"use client";

import { useState, useMemo } from "react";
import { type Product, type Variant } from "@/db/schema";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

type ProductWithVariants = Product & {
  variants: Variant[];
};

export default function VariantSelector({
  product,
}: {
  product: ProductWithVariants;
}) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCartStore();

  const colors = useMemo(() => {
    return [...new Set(product.variants.map((v) => v.color))];
  }, [product.variants]);

  const sizes = useMemo(() => {
    return [...new Set(product.variants.map((v) => v.size))];
  }, [product.variants]);

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [selectedColor, selectedSize, product.variants]);

  function handleAddToCart(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedVariant && selectedVariant.inventory > 0) {
      addItem({ variant: selectedVariant, quantity: 1 });
      // You can add a toast notification here to confirm
      console.log("Added to cart:", selectedVariant);
    }
  }

  const AddToCartButton = () => {
    if (!selectedVariant) {
      return (
        <Button type="submit" disabled className="w-full">
          Select Options
        </Button>
      );
    }

    if (selectedVariant.inventory <= 0) {
      return (
        <Button type="submit" disabled className="w-full">
          Out of Stock
        </Button>
      );
    }

    return (
      <Button type="submit" className="w-full">
        Add to Cart
      </Button>
    );
  };

  return (
    <form onSubmit={handleAddToCart} className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900">Color</h3>
        <div className="flex items-center space-x-3 mt-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={cn(
                "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none",
                selectedColor === color &&
                  "ring-2 ring-indigo-500 ring-offset-2"
              )}
              style={{ backgroundColor: color.toLowerCase() }}
              aria-label={color}
            >
              <span className="sr-only">{color}</span>
              <span className="h-8 w-8 rounded-full border border-black border-opacity-10"></span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <a
            href="#"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Size guide
          </a>
        </div>
        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4 mt-2">
          {sizes.map((size) => (
            <Button
              key={size}
              type="button"
              variant="outline"
              onClick={() => setSelectedSize(size)}
              className={cn(
                "font-medium",
                selectedSize === size && "ring-2 ring-indigo-500"
              )}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <AddToCartButton />
    </form>
  );
} 