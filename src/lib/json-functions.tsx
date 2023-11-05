import data from "../assets/data/prepared-effects.json"

type getDataProps = {
  outcomes?: string[]
}

export const getData = (props: getDataProps) => {
  const { outcomes } = props

  let subset
  if (outcomes) {
    subset = data.filter((e) => outcomes.includes(e.outcome_category))

    return subset
  } else {
    return data
  }
}

export type dataProps = typeof data
type dataKeys = keyof dataProps[0]

export const getUniqueData = (data: dataProps, x: dataKeys) => {
  const array = data.map((e) => {
    return e[x]
  })

  return new Set(array).size
}

export const getMostCommon = (data: dataProps, x: dataKeys) => {
  const counts = data.reduce(
    (effect: { [n: string]: number }, o) => (
      (effect[o[x]!] = (effect[o[x]!] || 0) + 1), effect
    ),
    {}
  )

  const maxCount = Math.max(...Object.entries(counts).map((count) => count[1]))

  const mostCommon = Object.keys(counts).filter(
    (count) => counts[count] == maxCount
  )

  return mostCommon
}

export const getOutcomeCategories = () => {
  const outcomes = data.map((e) => {
    return e.outcome_category
  })
  return [...new Set(outcomes)]
}
