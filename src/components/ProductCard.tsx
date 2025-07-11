"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Variant } from "@/db/schema";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type EnrichedProduct = Product & { variants: Variant[] };

export default function ProductCard({
  product,
}: {
  product: EnrichedProduct;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allImages = ((product.images as { url: string }[]) ?? []).map(
    (img) => (img.url.startsWith("//") ? `https:${img.url}` : img.url)
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const uniqueColors = product.variants
    ? [...new Map(product.variants.map((v) => [v.color, v])).values()]
    : [];

  return (
    <div className="group">
      <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allImages.length > 0 ? (
              allImages.map((src: string, index: number) => (
                <Link
                  href={`/product/${product.slug}`}
                  key={index}
                  className="flex-shrink-0 flex-grow-0 basis-full"
                >
                  <Image
                    src={src}
                    alt={`${product.name} image ${index + 1}`}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover object-center"
                  />
                </Link>
              ))
            ) : (
              <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">Image</span>
              </div>
            )}
          </div>
        </div>

        {allImages.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/60 p-1 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={nextBtnDisabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/60 p-1 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center space-x-2">
              {allImages.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === selectedIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Link href={`/product/${product.slug}`}>
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          ${product.price}
        </p>
      </Link>
      {uniqueColors.length > 0 && (
        <div className="mt-2 flex items-center space-x-2">
          {uniqueColors.slice(0, 5).map((variant: Variant) => {
            const variantImage = variant.image
              ? variant.image.startsWith("//")
                ? `https:${variant.image}`
                : variant.image
              : null;
            const imageIndex = variantImage
              ? allImages.indexOf(variantImage)
              : -1;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (imageIndex !== -1) {
                    emblaApi?.scrollTo(imageIndex);
                  }
                }}
                disabled={imageIndex === -1}
                className="h-6 w-6 rounded-full border border-gray-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title={variant.color}
              >
                {variantImage ? (
                  <Image
                    src={variantImage}
                    alt={variant.color}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                  />
                )}
              </button>
            );
          })}
          {uniqueColors.length > 5 && (
            <div className="h-6 w-6 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
              +{uniqueColors.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 