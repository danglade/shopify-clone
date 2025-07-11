import Link from "next/link";
import { Product, Variant } from "@/db/schema";
import Image from "next/image";
import { cn } from "@/lib/utils";

type EnrichedProduct = Product & { variants: Variant[] };

export default function ProductCard({
  product,
}: {
  product: EnrichedProduct;
}) {
  let firstImage = product.images?.[0]?.url;
  if (firstImage && firstImage.startsWith("//")) {
    firstImage = `https:${firstImage}`;
  }

  const uniqueColors = product.variants
    ? [...new Map(product.variants.map((v) => [v.color, v])).values()]
    : [];

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name ?? "Product image"}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        ) : (
          <div className="h-full w-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">Image</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">
        ${product.price}
      </p>
      {uniqueColors.length > 0 && (
        <div className="mt-2 flex items-center space-x-2">
          {uniqueColors.slice(0, 5).map((variant) => {
            const imageUrl = variant.image;
            return (
              <div
                key={variant.id}
                className="h-6 w-6 rounded-full border border-gray-300 overflow-hidden"
              >
                {imageUrl ? (
                  <Image
                    src={
                      imageUrl.startsWith("//")
                        ? `https:${imageUrl}`
                        : imageUrl
                    }
                    alt={variant.color}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover object-center"
                    title={variant.color}
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                    title={variant.color}
                  />
                )}
              </div>
            );
          })}
          {uniqueColors.length > 5 && (
            <div className="h-6 w-6 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
              +{uniqueColors.length - 5}
            </div>
          )}
        </div>
      )}
    </Link>
  );
} 