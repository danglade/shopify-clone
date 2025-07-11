import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTypes } from "@/app/actions/types";
import { db } from "@/db";
import { typesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function deleteType(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string);
  
  // Note: In a real app, you'd want to handle what happens to products
  // associated with this type. For now, we'll just delete the type.
  await db.delete(typesTable).where(eq(typesTable.id, id));

  revalidatePath("/admin/types");
}

export default async function AdminTypesPage() {
  const types = await getTypes();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Product Types</h1>
        <Button asChild>
          <Link href="/admin/types/new">Add New Type</Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.slug}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/types/${type.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <form action={deleteType}>
                      <input type="hidden" name="id" value={type.id} />
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 