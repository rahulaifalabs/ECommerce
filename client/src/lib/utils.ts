// AUTO-CONVERTED: extension changed to TypeScript. Please review and add explicit types.
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | boolean)[]) {
  return twMerge(clsx(inputs))
}
