import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { erf } from "mathjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const round = (num: number, digits = 2) => {
  const epsilon =
    Number.EPSILON === undefined ? Math.pow(2, -52) : Number.EPSILON

  const p = Math.pow(10, digits || 0)
  const n = num * p * (1 + epsilon)
  const r = Math.round(n) / p

  return r.toFixed(digits)
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
