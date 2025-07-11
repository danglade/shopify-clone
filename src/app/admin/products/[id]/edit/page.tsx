import { getCategories } from "@/app/actions/categoryActions";
import { getProductById } from "@/app/actions/products";
import { getTypes } from "@/app/actions/types";
import ProductForm from "@/app/admin/products/_components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [product, categories, types] = await Promise.all([
    getProductById(parseInt(id)),
    getCategories(),
    getTypes(),
  ]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm product={product} categories={categories} types={types} />
    </div>
  );
} 