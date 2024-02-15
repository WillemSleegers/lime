import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { erf } from "mathjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function round(x: number) {
  return Math.round((x + Number.EPSILON) * 100) / 100
}

export const selectOptions = (x: string[], defaults: string[]) => {
  return x.map((e) => {
    return {
      id: e.toLowerCase(),
      label: e,
      checked: defaults.includes(e),
    }
  })
}

export const cdfNormal = (x: number, mean = 0, sd = 1) => {
  return (1 - erf((mean - x) / (Math.sqrt(2) * sd))) / 2
}
