import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Reviews from "@/components/Reviews";
import YouMayAlsoLike from "@/components/YouMayAlsoLike";
import ProductDetails from "@/components/ProductDetails";

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
      type: true,
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const categoryIds = product.productToCategories.map(
    (ptc) => ptc.category.id
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <ProductDetails product={product} />
      <Reviews product={product} />
      <YouMayAlsoLike productId={product.id} categoryIds={categoryIds} />
    </div>
  );
} 