import { getCategoryById } from "@/app/actions/categoryActions";
import CategoryForm from "../../_components/CategoryForm";

type Props = {
  params: { id: string };
};

// Dummy comment to trigger a new build
export default async function EditCategoryPage({ params }: Props) {
  const category = await getCategoryById(parseInt(params.id));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
} 