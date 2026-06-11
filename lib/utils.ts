import { clsx, type ClassValue } from "clsx"
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

const cdfNormal = (x: number, mean = 0, sd = 1) => {
  return (1 - erf((mean - x) / (Math.sqrt(2) * sd))) / 2
}

export const pSup = (x: number) => {
  return cdfNormal(x / Math.sqrt(2))
}

export const u3 = (x: number) => {
  return cdfNormal(x)
}

// Fisher–Yates. Returns a new array; the input is not mutated.
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateTicks(min: number, max: number, targetCount = 10) {
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

// Reusable 2D canvas for text measurement. Created lazily to stay SSR-safe.
let measureCtx: CanvasRenderingContext2D | null | undefined

/**
 * Returns the rendered pixel width needed for the longest of `labels` at the
 * given CSS font, plus `padding`. Falls back to a character-count estimate
 * during SSR or when canvas is unavailable.
 */
export function measureAxisWidth(
  labels: string[],
  font = "12px sans-serif",
  padding = 24,
): number {
  const longest = labels.reduce((a, b) => (a.length > b.length ? a : b), "")
  if (typeof window === "undefined") return longest.length * 7 + padding
  if (measureCtx === undefined) {
    measureCtx = document.createElement("canvas").getContext("2d")
  }
  if (!measureCtx) return longest.length * 7 + padding
  measureCtx.font = font
  return Math.ceil(measureCtx.measureText(longest).width) + padding
}

export const customSort = <T extends string | number>(
  inputArray: T[],
  excludeArray?: T[]
): T[] => {
  // If no exclude array is provided, just sort the input array
  if (!excludeArray || excludeArray.length === 0) {
    return [...inputArray].sort((a, b) => String(a).localeCompare(String(b)))
  }

  // Create sets for faster lookup
  const excludeSet = new Set(excludeArray)

  // Separate arrays for included and excluded items
  const includedItems: T[] = []
  const excludedItems: T[] = []

  // Separate items based on whether they're in the exclude array
  inputArray.forEach((item) => {
    if (excludeSet.has(item)) {
      excludedItems.push(item)
    } else {
      includedItems.push(item)
    }
  })

  // Sort both arrays alphabetically
  includedItems.sort((a, b) => String(a).localeCompare(String(b)))
  excludedItems.sort((a, b) => String(a).localeCompare(String(b)))

  // Combine the arrays with excluded items at the end
  return [...includedItems, ...excludedItems]
}
