"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Variant } from "@/db/schema";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

type ProductImageGalleryProps = {
  product: Product & { variants: Variant[] };
  selectedVariant: Variant | undefined;
};

export default function ProductImageGallery({
  product,
  selectedVariant,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    selectedVariant?.image || product.images?.[0]?.url || null
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selectedVariant?.image) {
      setSelectedImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  const handleThumbnailClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const allImages = [
    ...((product.images as { url: string }[] | null)?.map((img) => img.url) ?? []),
    ...product.variants.map((v) => v.image).filter((img) => img),
  ];
  
  const uniqueImages = Array.from(new Set(allImages));

  const slides = uniqueImages.map((url) => ({
    src: url?.startsWith("//") ? `https:${url}` : url ?? "",
  }));

  const currentImage = selectedImage && uniqueImages.includes(selectedImage) 
    ? selectedImage 
    : uniqueImages[0] ?? null;

  const thumbnails = uniqueImages.filter((img) => img !== currentImage);

  return (
    <div>
      <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden mb-4">
        {currentImage ? (
          <button
            type="button"
            className="w-full h-full cursor-zoom-in"
            onClick={() => setOpen(true)}
          >
            <Image
              src={
                currentImage.startsWith("//")
                ? `https:${currentImage}`
                : currentImage
              }
              alt={product.name ?? "Product image"}
              width={800}
              height={800}
              className="w-full h-full object-cover"
            />
          </button>
        ) : (
          <div className="h-full w-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-10 gap-1">
        {thumbnails.map((imageUrl, index) => {
          if (!imageUrl) return null;
          const finalUrl = imageUrl.startsWith("//")
            ? `https:${imageUrl}`
            : imageUrl;
          return (
            <div
              key={index}
              className={`aspect-square rounded-lg bg-gray-200 overflow-hidden cursor-pointer border-2 ${
                currentImage === imageUrl
                  ? "border-indigo-500"
                  : "border-transparent"
              }`}
              onClick={() => handleThumbnailClick(imageUrl)}
            >
              <Image
                src={finalUrl}
                alt={`${product.name} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Zoom]}
      />
    </div>
  );
} 