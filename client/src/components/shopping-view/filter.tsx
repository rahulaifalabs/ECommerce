// ProductFilter.tsx
import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

// ----------------- Types -----------------
export interface FilterOption {
  id: string;
  label: string;
}

// ✅ [CHANGE #1] Explicitly define the shape of `filterOptions`
//    so TypeScript knows valid keys (category, brand, etc.)
export interface FilterOptions {
  category: FilterOption[];
  brand: FilterOption[];
  // 👇 add more if needed, or make it flexible:
  // [key: string]: FilterOption[];
}

export interface Filters {
  [category: string]: string[]; // category -> array of selected option ids
}

interface ProductFilterProps {
  filters: Filters;
  handleFilter: (category: string, optionId: string) => void;
}

// ----------------- Component -----------------
function ProductFilter({ filters, handleFilter }: ProductFilterProps) {
  // ✅ [CHANGE #2] Narrow `keyItem` to keys of `filterOptions`
  const typedKeys = Object.keys(filterOptions) as (keyof typeof filterOptions)[];

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {typedKeys.map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
                {/* ✅ [CHANGE #3] keyItem is now strongly typed */}
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex font-medium items-center gap-2"
                  >
                    <Checkbox
                      checked={
                        !!(
                          filters?.[keyItem] &&
                          filters[keyItem].includes(option.id)
                        )
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
