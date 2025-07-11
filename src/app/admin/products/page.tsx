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
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getProducts() {
  return await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.status, "published"));
}

async function deleteProduct(formData: FormData) {
  "use server";
  const id = parseInt(formData.get("id") as string);

  await db
    .update(productsTable)
    .set({ status: "archived" })
    .where(eq(productsTable.id, id));

  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add New Product</Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>
                  {product.createdAt.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
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