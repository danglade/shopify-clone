"use client";

import { useState } from "react";
import { Product, Variant } from "@/db/schema";
import ProductImageGallery from "./ProductImageGallery";
import VariantSelector from "./VariantSelector";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";

type EnrichedProduct = Product & { 
  variants: Variant[];
  type: { name: string | null } | null;
};

type ProductDetailsProps = {
  product: EnrichedProduct;
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    product.variants?.[0]
  );
  const addToCart = useCartStore((state) => state.addItem);

  const handleVariantChange = (variant: Variant) => {
    setSelectedVariant(variant);
  };
  
  const handleAddToCart = () => {
    if (selectedVariant) {
      addToCart({
        product: product,
        variant: selectedVariant,
        quantity: 1,
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-12">
      <ProductImageGallery product={product} selectedVariant={selectedVariant} />
      
      <div>
        <p className="text-sm uppercase text-gray-500">{product.type?.name}</p>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-1">
          {product.name}
        </h1>
        <p className="mt-2 text-3xl text-gray-900">${product.price}</p>

        <div className="mt-6">
          <h3 className="sr-only">Description</h3>
          <div
            className="space-y-6 text-base text-gray-700"
            dangerouslySetInnerHTML={{
              __html: product.description ?? "No description available.",
            }}
          />
        </div>

        <div className="mt-8">
          <VariantSelector
            product={product}
            onVariantChange={handleVariantChange}
          />
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className="w-full mt-6"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
} 