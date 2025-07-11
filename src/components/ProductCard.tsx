import Link from "next/link";
import { Product } from "@/db/schema";
import Image from "next/image";

export default function ProductCard({ product }: { product: Product }) {
  const firstImage = product.images?.[0]?.url;

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
      <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
      {/* Placeholder for rating */}
      <div className="mt-1">
        <p className="text-sm text-gray-500">No reviews yet</p>
      </div>
    </Link>
  );
} 