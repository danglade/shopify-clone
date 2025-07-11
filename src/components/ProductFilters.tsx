"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

type ProductFiltersProps = {
  sizes: string[];
  colors: string[];
};

export default function ProductFilters({ sizes, colors }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (
    type: "size" | "color" | "minPrice" | "maxPrice",
    value: string
  ) => {
    const params = new URLSearchParams(searchParams);

    if (type === "size" || type === "color") {
      const currentValues = params.getAll(type);
      if (currentValues.includes(value)) {
        params.delete(type, value);
      } else {
        params.append(type, value);
      }
    } else {
      if (value) {
        params.set(type, value);
      } else {
        params.delete(type);
      }
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handlePriceUpdate = () => {
    const params = new URLSearchParams(searchParams);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const selectedSizes = searchParams.getAll("size");
  const selectedColors = searchParams.getAll("color");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Price</h3>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minPrice") ?? ""}
            onChange={(e) =>
              handleFilterChange("minPrice", e.target.value)
            }
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxPrice") ?? ""}
            onChange={(e) =>
              handleFilterChange("maxPrice", e.target.value)
            }
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Size</h3>
        <div className="space-y-2">
          {sizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                onCheckedChange={() => handleFilterChange("size", size)}
                checked={selectedSizes.includes(size)}
              />
              <Label htmlFor={`size-${size}`} className="font-normal">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Color</h3>
        <div className="space-y-2">
          {colors.map((color) => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                onCheckedChange={() => handleFilterChange("color", color)}
                checked={selectedColors.includes(color)}
              />
              <Label htmlFor={`color-${color}`} className="font-normal">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 