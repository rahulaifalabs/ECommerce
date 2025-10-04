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

export interface FilterOptions {
  [category: string]: FilterOption[];
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
  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold">{keyItem}</h3>
              <div className="grid gap-2 mt-2">
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
