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

  return Number(r.toFixed(digits))
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

export const pSup = (x: number) => {
  return cdfNormal(x / Math.sqrt(2))
}

export const u3 = (x: number) => {
  return cdfNormal(x)
}

export const u1 = (x: number) => {
  return 1 - 2 * cdfNormal((-1 * Math.abs(x)) / 2)
}

export const countPValues = (x: number[]) => {
  const bins = [0.01, 0.02, 0.03, 0.04, 0.05]

  const counts = bins.map((bin) => {
    return {
      p: bin,
      n: 0,
      null: 0.2,
      prop: 0,
    }
  })

  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < bins.length; j++) {
      const bin = counts[j]
      if (x[i] < bin.p) {
        bin.n++
        break
      }
    }
  }

  for (let j = 0; j < bins.length; j++) {
    const bin = counts[j]
    bin.prop = bin.n / x.length
  }

  return counts
}
