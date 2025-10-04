import * as React from "react";
import { cn } from "@/lib/utils";

// ✅ Props type for Input
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// ✅ Forward ref properly
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn("rounded-md border px-3 py-2", className ?? "")} {...props} />;
  }
);

Input.displayName = "Input";
