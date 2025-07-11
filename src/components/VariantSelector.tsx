"use client";

import { useState, useMemo, useEffect } from "react";
import { type Product, type Variant } from "@/db/schema";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

  const colorImages = useMemo(() => {
    const imageMap = new Map<string, string | null>();
    for (const color of colors) {
      const variantForColor = product.variants.find(
        (v) => v.color === color && v.image
      );
      imageMap.set(color, variantForColor?.image ?? null);
    }
    return imageMap;
  }, [colors, product.variants]);

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
          {colors.map((color) => {
            const imageUrl = colorImages.get(color);
            return (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "relative h-16 w-16 rounded-md overflow-hidden cursor-pointer border-2",
                  selectedColor === color
                    ? "border-indigo-500"
                    : "border-transparent"
                )}
                aria-label={color}
              >
                {imageUrl ? (
                  <Image
                    src={
                      imageUrl.startsWith("//")
                        ? `https:${imageUrl}`
                        : imageUrl
                    }
                    alt={color}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                )}
              </button>
            );
          })}
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
        <div className="flex flex-wrap gap-4 mt-2">
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