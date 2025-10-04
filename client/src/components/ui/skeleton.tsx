import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------- Props Type ----------------
type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

// ---------------- Component ----------------
const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return <div className={cn("animate-pulse rounded-md bg-muted", className ?? "")} {...props} />;
};

export { Skeleton };
