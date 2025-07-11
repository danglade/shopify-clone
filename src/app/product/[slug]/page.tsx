import { db } from "@/db";
import { productsTable, variantsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import VariantSelector from "@/components/VariantSelector";
import Reviews from "@/components/Reviews";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";

async function getProductBySlug(slug: string) {
  const product = await db.query.productsTable.findFirst({
    where: eq(productsTable.slug, slug),
    with: {
      variants: true,
      reviews: {
        where: (reviews, { eq }) => eq(reviews.status, "approved"),
      },
      productToCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }
  return product;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  const categoryIds = product.productToCategories.map(
    (ptc) => ptc.category.id
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square rounded-lg bg-gray-200 overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          {/* Thumbnails will go here */}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <p className="mt-2 text-3xl text-gray-900">${product.price}</p>

          {/* Reviews are now part of the Reviews component */}

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div
              className="space-y-6 text-base text-gray-700"
              dangerouslySetInnerHTML={{
                __html: product.description ?? "No description available.",
              }}
            />
          </div>

          <form className="mt-8">
            <VariantSelector product={product} />
          </form>
        </div>
      </div>
      <Reviews product={product} />
      <YouMayAlsoLike productId={product.id} categoryIds={categoryIds} />
    </div>
  );
} 