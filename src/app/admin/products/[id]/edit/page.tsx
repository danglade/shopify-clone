import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

async function getProduct(id: number) {
  const product = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, id));
  return product[0];
}

async function updateProduct(formData: FormData) {
  "use server";

  const id = parseInt(formData.get("id") as string);
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;

  await db
    .update(productsTable)
    .set({
      name,
      description,
      price,
      updatedAt: new Date(),
    })
    .where(eq(productsTable.id, id));

  redirect("/admin/products");
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(parseInt(params.id));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <form action={updateProduct} className="space-y-4 max-w-lg">
        <input type="hidden" name="id" value={product.id} />
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product.name}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product.description ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={product.price}
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
} 