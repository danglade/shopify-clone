import { getCategories } from "@/app/actions/categories";
import { getProductById } from "@/app/actions/products";
import ProductForm from "@/app/admin/products/_components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    getProductById(parseInt(params.id)),
    getCategories(),
  ]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
} 