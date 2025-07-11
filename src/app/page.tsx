import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import SortSelector from "@/components/SortSelector";
import HeroBanner from "@/components/HeroBanner";
import { getAvailableFilterValues } from "@/app/actions/products";
import { db } from "@/db";
import { productsTable, variantsTable } from "@/db/schema";
import { eq, asc, desc, and, inArray, gte, lte } from "drizzle-orm";

type HomeProps = {
  searchParams: {
    sort?: string;
    size?: string | string[];
    color?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  };
};

async function getProducts({
  sort,
  sizes,
  colors,
  minPrice,
  maxPrice,
}: {
  sort?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
}) {
  const sortOptions = {
    "price-asc": asc(productsTable.price),
    "price-desc": desc(productsTable.price),
    newest: desc(productsTable.createdAt),
  };

  const orderBy =
    sort && sort in sortOptions
      ? sortOptions[sort as keyof typeof sortOptions]
      : desc(productsTable.createdAt);

  const filterConditions = and(
    eq(productsTable.status, "published"),
    sizes && sizes.length > 0
      ? inArray(variantsTable.size, sizes)
      : undefined,
    colors && colors.length > 0
      ? inArray(variantsTable.color, colors)
      : undefined,
    minPrice ? gte(productsTable.price, minPrice.toString()) : undefined,
    maxPrice ? lte(productsTable.price, maxPrice.toString()) : undefined
  );

  return await db
    .selectDistinct({ product: productsTable })
    .from(productsTable)
    .leftJoin(variantsTable, eq(productsTable.id, variantsTable.productId))
    .where(filterConditions)
    .orderBy(orderBy);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
    size?: string | string[];
    color?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const awaitedSearchParams = await searchParams;
  const sizes = Array.isArray(awaitedSearchParams.size)
    ? awaitedSearchParams.size
    : awaitedSearchParams.size
    ? [awaitedSearchParams.size]
    : [];
  const colors = Array.isArray(awaitedSearchParams.color)
    ? awaitedSearchParams.color
    : awaitedSearchParams.color
    ? [awaitedSearchParams.color]
    : [];
  const min = awaitedSearchParams.minPrice
    ? parseInt(awaitedSearchParams.minPrice)
    : undefined;
  const max = awaitedSearchParams.maxPrice
    ? parseInt(awaitedSearchParams.maxPrice)
    : undefined;

  const [products, filterValues] = await Promise.all([
    getProducts({
      sort: awaitedSearchParams.sort,
      sizes,
      colors,
      minPrice: min,
      maxPrice: max,
    }),
    getAvailableFilterValues(),
  ]);

  return (
    <main>
      <HeroBanner />
      <div className="container mx-auto px-4">
        <div id="products" className="flex justify-between items-center my-12">
          <h1 className="text-4xl font-bold">Products</h1>
          <SortSelector />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <ProductFilters
              sizes={filterValues.sizes}
              colors={filterValues.colors}
            />
          </aside>
          <div className="md:col-span-3 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map(({ product }) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        </div>
      </main>
  );
}
