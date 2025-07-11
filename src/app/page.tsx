import HeroBanner from "@/components/HeroBanner";
import ProductGrid from "@/components/ProductGrid";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <main>
      <Suspense fallback={<HeroBanner.Skeleton />}>
        <HeroBanner />
      </Suspense>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <ProductGrid />
      </div>
    </main>
  );
}
