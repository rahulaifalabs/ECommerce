import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define the variants for styling
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

// ✅ Properly typed Label component
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>, // infer correct element type
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
    className?: string; // allow className overrides
  }
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className ?? "")}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
