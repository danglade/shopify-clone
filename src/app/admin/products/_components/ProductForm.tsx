"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateProduct } from "@/app/actions/products";
import {
  categoriesTable,
  productsTable,
  typesTable,
  variantsTable,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrashIcon } from "lucide-react";
import ProductPreviewCard from "./ProductPreviewCard";

type VariantForState = Omit<
  InferSelectModel<typeof variantsTable>,
  "id" | "productId"
> & {
  id?: number;
  productId?: number;
};

type Product = InferSelectModel<typeof productsTable> & {
  productToCategories: {
    category: InferSelectModel<typeof categoriesTable>;
  }[];
  variants: VariantForState[];
};
type Category = InferSelectModel<typeof categoriesTable>;
type ProductType = InferSelectModel<typeof typesTable>;

type ProductFormProps = {
  product?: Product;
  categories: Category[];
  types: ProductType[];
};

export default function ProductForm({
  product,
  categories,
  types,
}: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "0");
  const [variants, setVariants] = useState<VariantForState[]>(
    product?.variants || [
      { size: "", color: "", cost: "0", sku: null, inventory: 0, image: null },
    ]
  );
  const productCategoryIds =
    product?.productToCategories.map((ptc) => ptc.category.id) || [];

  const handleVariantChange = (
    index: number,
    field: keyof VariantForState,
    value: string | number
  ) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  return (
    <form action={createOrUpdateProduct} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <input type="hidden" name="id" value={product?.id || ""} />
            <div className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description ?? ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="typeId">Product Type</Label>
                  <Select
                    name="typeId"
                    defaultValue={product?.typeId?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Variants</h2>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-md relative"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveVariant(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <input
                    type="hidden"
                    name={`variants[${index}][id]`}
                    value={variant.id || ""}
                  />
                  <div className="md:col-span-3 grid w-full items-center gap-1.5">
                    <Label>Color</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Size</Label>
                    <Input
                      value={variant.size}
                      onChange={(e) =>
                        handleVariantChange(index, "size", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>SKU</Label>
                    <Input
                      value={variant.sku ?? ""}
                      onChange={(e) =>
                        handleVariantChange(index, "sku", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Inventory</Label>
                    <Input
                      type="number"
                      value={variant.inventory}
                      onChange={(e) =>
                        handleVariantChange(
                          index,
                          "inventory",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="md:col-span-5 grid w-full items-center gap-1.5">
                    <Label>Image URL</Label>
                    <Input
                      value={variant.image ?? ""}
                      onChange={(e) =>
                        handleVariantChange(index, "image", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <Label>Cost</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.cost}
                      onChange={(e) =>
                        handleVariantChange(index, "cost", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                setVariants([
                  ...variants,
                  {
                    size: "",
                    color: "",
                    cost: "0",
                    sku: null,
                    inventory: 0,
                    image: null,
                  },
                ])
              }
            >
              Add Variant
            </Button>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
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
        </div>

        <div className="md:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow-md sticky top-8">
            <h3 className="text-lg font-medium">Preview</h3>
            <div className="mt-4">
              <ProductPreviewCard
                name={name}
                price={price}
                image={variants[0]?.image}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
} 