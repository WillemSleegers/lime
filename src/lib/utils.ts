import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function round(x: number) {
  return Math.round((x + Number.EPSILON) * 100) / 100
}
