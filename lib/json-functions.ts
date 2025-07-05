import { Data, DataKeys } from "@/lib/types"

export const countUniqueValues = <T extends object, K extends keyof T>(
  array: T[],
  propertyName: K
): number => {
  // Create a Set to automatically track unique values
  const uniqueValues = new Set<T[K]>()

  // Iterate through each object in the array
  for (const item of array) {
    // Add the value of the specified property to the Set
    uniqueValues.add(item[propertyName])
  }

  // Return the size of the Set, which represents the count of unique values
  return uniqueValues.size
}

export const countValue = <T extends object, K extends keyof T>(
  array: T[],
  propertyName: K,
  valueToCount: T[K]
): number => {
  // Initialize counter
  let occurrenceCount = 0

  // Iterate through each object in the array
  for (const item of array) {
    // Check if the property value matches the value we're counting
    if (item[propertyName] === valueToCount) {
      occurrenceCount++
    }
  }

  return occurrenceCount
}

export const countUniqueFilteredValues = <
  T extends object,
  K extends keyof T,
  F extends keyof T
>(
  array: T[],
  targetProperty: K,
  filterProperty: F,
  filterValue: T[F]
): number => {
  // Create a Set to track unique values
  const uniqueValues = new Set<T[K]>()

  // Iterate through each object in the array
  for (const item of array) {
    // Only consider objects where the filter property matches the filter value
    if (item[filterProperty] === filterValue) {
      // Add the value of the target property to the Set
      uniqueValues.add(item[targetProperty])
    }
  }

  // Return the size of the Set, representing the count of unique values
  return uniqueValues.size
}

export const countUniqueValuesByGroup = <
  T extends object,
  K extends keyof T,
  G extends keyof T
>(
  array: T[],
  targetProperty: K,
  groupByProperty: G
): Map<T[G], number> => {
  // Create a Map to store the result
  // Keys are unique values of groupByProperty, values are Sets of unique targetProperty values
  const groupMap = new Map<T[G], Set<T[K]>>()

  // Iterate through each object in the array
  for (const item of array) {
    const groupValue = item[groupByProperty]
    const targetValue = item[targetProperty]

    // If this group doesn't exist in our Map yet, create a new Set for it
    if (!groupMap.has(groupValue)) {
      groupMap.set(groupValue, new Set<T[K]>())
    }

    // Add the target value to the Set for this group
    groupMap.get(groupValue)?.add(targetValue)
  }

  // Convert the Map of Sets to a Map of counts
  const resultMap = new Map<T[G], number>()

  for (const [groupValue, uniqueValues] of groupMap.entries()) {
    resultMap.set(groupValue, uniqueValues.size)
  }

  // Sort
  const sortedMap = new Map([...resultMap.entries()].sort())

  return sortedMap
}

export const mapToXYArray = <K, V>(map: Map<K, V>): Array<{ x: K; y: V }> => {
  const result: Array<{ x: K; y: V }> = []

  // Iterate through each entry in the map
  for (const [key, value] of map.entries()) {
    // Add an object with x and y properties to the result array
    result.push({
      x: key,
      y: value,
    })
  }

  return result
}

export const getUniqueData = (data: Data, x: DataKeys) => {
  const array = data.map((e) => {
    return e[x]
  })

  return new Set(array).size
}

/**
 * Performs a semi-join operation between two arrays of objects
 * @param sourceArray - The source array of objects to filter
 * @param lookupArray - The array of objects to match against
 * @param keys - The property key(s) to match on
 * @returns Filtered array containing only objects from sourceArray that have matching key-value pairs in lookupArray
 */
export function semiJoin<
  S extends Record<string, unknown>,
  L extends Record<string, unknown>,
  K extends keyof S & keyof L
>(sourceArray: S[], lookupArray: L[], keys: K | ReadonlyArray<K>): S[] {
  // Convert keys to array if only a string is provided
  const keysArray = Array.isArray(keys) ? keys : [keys]

  // Filter the source array
  return sourceArray.filter((sourceObj) => {
    // Check if there's at least one object in the lookup array that matches all the specified keys
    return lookupArray.some((lookupObj) => {
      return keysArray.every((key) => sourceObj[key] === lookupObj[key])
    })
  })
}
