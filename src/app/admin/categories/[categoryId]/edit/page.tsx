import { getCategoryById } from "@/app/actions/categoryActions";
import CategoryForm from "../../_components/CategoryForm";

type Props = {
  params: Promise<{ categoryId: string }>;
};

// Dummy comment to trigger a new build
async function EditCategoryPage({ params }: Props) {
  const { categoryId } = await params;
  const category = await getCategoryById(parseInt(categoryId));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}

export default EditCategoryPage; 