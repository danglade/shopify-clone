"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrUpdateType } from "@/app/actions/types";
import { typesTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

type ProductType = InferSelectModel<typeof typesTable>;

type TypeFormProps = {
  type?: ProductType;
};

export default function TypeForm({ type }: TypeFormProps) {
  return (
    <form action={createOrUpdateType} className="space-y-4 max-w-lg">
      <input type="hidden" name="id" value={type?.id || ""} />
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Type Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={type?.name}
        />
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
} 