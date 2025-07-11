"use client";

import { useState, useMemo, useEffect } from "react";
import { type Product, type Variant } from "@/db/schema";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type ProductWithVariants = Product & {
  variants: Variant[];
};

type VariantSelectorProps = {
  product: ProductWithVariants;
  onVariantChange: (variant: Variant) => void;
};

export default function VariantSelector({
  product,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants[0]?.color ?? null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.variants[0]?.size ?? null
  );

  const colors = useMemo(() => {
    return [...new Set(product.variants.map((v) => v.color))];
  }, [product.variants]);

  const sizes = useMemo(() => {
    if (!selectedColor) {
      return [...new Set(product.variants.map((v) => v.size))];
    }
    return [
      ...new Set(
        product.variants
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size)
      ),
    ];
  }, [product.variants, selectedColor]);

  useEffect(() => {
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
    if (variant) {
      onVariantChange(variant);
    }
  }, [selectedColor, selectedSize, product.variants, onVariantChange]);

  return (
    <div className="space-y-6">
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
    </div>
  );
} 