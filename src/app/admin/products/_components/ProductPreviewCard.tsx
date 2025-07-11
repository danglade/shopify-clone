"use client";

import Image from "next/image";

type PreviewProps = {
  name: string;
  price: string;
  image: string | null;
};

export default function ProductPreviewCard({
  name,
  price,
  image,
}: PreviewProps) {
  const displayImage = image && image.startsWith("//") ? `https:${image}` : image;

  return (
    <div className="group">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name ?? "Product image"}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{name || "Product Name"}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">
        ${price || "0.00"}
      </p>
    </div>
  );
} 