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

export const getOutcomeCategories = () => {
  const outcomes = data.map((e) => {
    return e.outcome_category
  })
  return [...new Set(outcomes)]
}
