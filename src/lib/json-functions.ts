import data from "../assets/data/prepared-effects.json"

export function getOutcomeCategories() {
  const outcomes = data.map((e) => {
    return e.outcome_category
  })
  return [...new Set(outcomes)]
}
