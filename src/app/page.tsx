import ProductCard from "@/components/ProductCard";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getProducts() {
  return await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.status, "published"));
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-center my-12">
        My Awesome Clothing Store
      </h1>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
