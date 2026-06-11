export const countUniqueValues = <T extends object, K extends keyof T>(
  array: T[],
  propertyName: K,
): number => {
  const uniqueValues = new Set<T[K]>()
  for (const item of array) uniqueValues.add(item[propertyName])
  return uniqueValues.size
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
