import { Data, DataKeys } from "@/lib/types"

export const countUniqueValues = <T extends object, K extends keyof T>(
  array: T[],
  propertyName: K,
): number => {
  const uniqueValues = new Set<T[K]>()
  for (const item of array) uniqueValues.add(item[propertyName])
  return uniqueValues.size
}

export const countValue = <T extends object, K extends keyof T>(
  array: T[],
  propertyName: K,
  valueToCount: T[K],
): number => {
  let count = 0
  for (const item of array) if (item[propertyName] === valueToCount) count++
  return count
}

export const countUniqueFilteredValues = <
  T extends object,
  K extends keyof T,
  F extends keyof T,
>(
  array: T[],
  targetProperty: K,
  filterProperty: F,
  filterValue: T[F],
): number => {
  const uniqueValues = new Set<T[K]>()
  for (const item of array) {
    if (item[filterProperty] === filterValue) {
      uniqueValues.add(item[targetProperty])
    }
  }
  return uniqueValues.size
}

export const countUniqueValuesByGroup = <
  T extends object,
  K extends keyof T,
  G extends keyof T,
>(
  array: T[],
  targetProperty: K,
  groupByProperty: G,
): Map<T[G], number> => {
  const groupSets = new Map<T[G], Set<T[K]>>()
  for (const item of array) {
    const g = item[groupByProperty]
    if (!groupSets.has(g)) groupSets.set(g, new Set<T[K]>())
    groupSets.get(g)!.add(item[targetProperty])
  }
  const counts = new Map<T[G], number>()
  for (const [g, set] of groupSets) counts.set(g, set.size)
  return new Map([...counts.entries()].sort())
}

export const mapToXYArray = <K, V>(map: Map<K, V>): Array<{ x: K; y: V }> => {
  const result: Array<{ x: K; y: V }> = []
  for (const [x, y] of map.entries()) result.push({ x, y })
  return result
}

export const getUniqueData = (data: Data, x: DataKeys) =>
  new Set(data.map((e) => e[x])).size

function buildKeySet<T extends Record<string, unknown>, K extends keyof T>(
  data: T[],
  keys: ReadonlyArray<K>,
): Set<string> {
  const set = new Set<string>()
  for (const item of data) {
    set.add(keys.map((k) => String(item[k])).join("|"))
  }
  return set
}

/**
 * O(n+m) semi-join: returns rows from `sourceArray` whose joined `keys` also
 * appear in `lookupArray`.
 */
export function semiJoin<
  S extends Record<string, unknown>,
  L extends Record<string, unknown>,
  K extends keyof S & keyof L,
>(sourceArray: S[], lookupArray: L[], keys: K | ReadonlyArray<K>): S[] {
  if (lookupArray.length === 0) return []
  const keysArray = Array.isArray(keys) ? keys : [keys as K]
  const lookupSet = buildKeySet(lookupArray, keysArray)
  return sourceArray.filter((item) =>
    lookupSet.has(keysArray.map((k) => String(item[k])).join("|")),
  )
}
