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

export function generateTicks(min: number, max: number, targetCount = 5) {
  // Handle edge cases
  if (min === max) {
    return [min]
  }
  if (min > max) {
    ;[min, max] = [max, min]
  }

  // Calculate the ideal spacing between ticks
  const range = max - min
  const idealSpacing = range / (targetCount - 1)

  // Find the best base unit (1, 2, 5, 10, 20, 50, etc.)
  const magnitude = Math.floor(Math.log10(idealSpacing))
  const normalizedSpacing = idealSpacing / Math.pow(10, magnitude)

  let baseUnit
  if (normalizedSpacing < 1.5) baseUnit = 1
  else if (normalizedSpacing < 3) baseUnit = 2
  else if (normalizedSpacing < 7.5) baseUnit = 5
  else baseUnit = 10

  const spacing = baseUnit * Math.pow(10, magnitude)

  // Generate ticks
  const firstTick = Math.ceil(min / spacing) * spacing
  const lastTick = Math.floor(max / spacing) * spacing
  const ticks = []

  for (let tick = firstTick; tick <= lastTick + spacing / 2; tick += spacing) {
    // Round to avoid floating point errors
    const roundedTick = Number(tick.toFixed(10))
    if (roundedTick >= min && roundedTick <= max) {
      ticks.push(roundedTick)
    }
  }

  // Ensure min and max are included if they're "nice" numbers
  if (!ticks.includes(min) && isNiceNumber(min)) {
    ticks.unshift(min)
  }
  if (!ticks.includes(max) && isNiceNumber(max)) {
    ticks.push(max)
  }

  return ticks
}

function isNiceNumber(num: number) {
  // Check if number is whole or half
  return Number.isInteger(num) || Number.isInteger(num * 2)
}
