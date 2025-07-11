"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateProduct } from "@/app/actions/products";
import { categoriesTable, productsTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Product = InferSelectModel<typeof productsTable> & {
  productToCategories: {
    category: InferSelectModel<typeof categoriesTable>;
  }[];
};
type Category = InferSelectModel<typeof categoriesTable>;

type ProductFormProps = {
  product?: Product;
  categories: Category[];
};

export default function ProductForm({ product, categories }: ProductFormProps) {
  const productCategoryIds =
    product?.productToCategories.map((ptc) => ptc.category.id) || [];

  return (
    <form action={createOrUpdateProduct} className="space-y-4 max-w-lg">
      <input type="hidden" name="id" value={product?.id || ""} />
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product?.name}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={product?.description ?? ""}
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
          defaultValue={product?.price}
        />
      </div>
      <div>
        <Label>Categories</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                name="categoryIds"
                value={category.id.toString()}
                defaultChecked={productCategoryIds.includes(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="font-normal"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
} 