import { getRelatedProducts } from "@/app/actions/products";
import ProductCard from "./ProductCard";

type YouMayAlsoLikeProps = {
  productId: number;
  categoryIds: number[];
};

export default async function YouMayAlsoLike({
  productId,
  categoryIds,
}: YouMayAlsoLikeProps) {
  const relatedProducts = await getRelatedProducts(productId, categoryIds);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
} 