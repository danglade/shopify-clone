import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { redirect } from "next/navigation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

async function createProduct(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;

  const slug = slugify(name);

  await db.insert(productsTable).values({
    name,
    slug,
    description,
    price,
    status: "published",
  });

  redirect("/admin/products");
}

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form action={createProduct} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" type="text" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
        </div>
        <Button type="submit">Add Product</Button>
      </form>
    </div>
  );
} 