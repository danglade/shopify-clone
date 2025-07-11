import { getTypeById } from "@/app/actions/types";
import TypeForm from "../../_components/TypeForm";

export default async function EditTypePage({
  params,
}: {
  params: { id: string };
}) {
  const type = await getTypeById(parseInt(params.id));

  if (!type) {
    return <div>Type not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Type</h1>
      <TypeForm type={type} />
    </div>
  );
} 