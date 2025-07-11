import { db } from "@/db";
import { productsTable, Product, Variant } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProductCard from "./ProductCard";

async function getProducts() {
  const productsWithVariants = await db.query.productsTable.findMany({
    where: eq(productsTable.status, "published"),
    with: {
      variants: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
  return productsWithVariants;
}

export default async function ProductGrid() {
  const products = await getProducts();

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product as Product & { variants: Variant[] }}
        />
      ))}
    </div>
  );
} 