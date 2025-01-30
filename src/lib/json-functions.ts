import data from "@/assets/data/data.json"

export type Data = typeof data
type dataKeys = keyof Data[0]

export const getUniqueData = (data: Data, x: dataKeys) => {
  const array = data.map((e) => {
    return e[x]
  })

  return new Set(array).size
}

export const getCounts = (data: Data, by: dataKeys, x: dataKeys) => {
  const unique = data.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t[by] === value[by]),
  )

  const counts = unique.reduce(
    (effect: { [n: string]: number }, o) => (
      (effect[o[x]!] = (effect[o[x]!] || 0) + 1), effect
    ),
    {},
  )

  const array = []
  for (const [key, value] of Object.entries(counts)) {
    array.push({ x: key, y: value })
  }

  return array
}

export const getCount = (
  data: Data,
  by: dataKeys,
  x: dataKeys,
  y: string | number,
) => {
  const unique = data.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t[by] === value[by]),
  )

  const counts = unique.reduce(
    (effect: { [n: string]: number }, o) => (
      (effect[o[x]!] = (effect[o[x]!] || 0) + 1), effect
    ),
    {},
  )

  return counts[y]
}

export const getUniqueColumnValues = (x: dataKeys) => {
  const values = data.map((column) => {
    return column[x]
  })
  return [...new Set(values)]
}
