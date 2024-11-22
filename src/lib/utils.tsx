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

// From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}
