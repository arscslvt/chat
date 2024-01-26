import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isLocal =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
