import { getCategories } from "@/app/actions/categories";
import { getTypes } from "@/app/actions/types";
import ProductForm from "../_components/ProductForm";

export default async function NewProductPage() {
  const [categories, types] = await Promise.all([
    getCategories(),
    getTypes(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <ProductForm categories={categories} types={types} />
    </div>
  );
} 