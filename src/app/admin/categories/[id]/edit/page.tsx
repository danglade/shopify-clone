import { getCategoryById } from "@/app/actions/categories";
import CategoryForm from "../../_components/CategoryForm";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategoryById(parseInt(params.id));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
} 