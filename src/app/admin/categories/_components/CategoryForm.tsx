"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";
import { createOrUpdateCategory } from "@/app/actions/categoryActions";
import { categoriesTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Category = InferSelectModel<typeof categoriesTable>;

type CategoryFormProps = {
  category?: Category;
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || "");
  const slug = slugify(name);

  return (
    <form action={createOrUpdateCategory} className="space-y-6">
      <input type="hidden" name="id" value={category?.id || ""} />
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" name="slug" value={slug} readOnly />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description || ""}
        />
      </div>
      <Button type="submit">Save Category</Button>
    </form>
  );
} 