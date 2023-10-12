import data from "../assets/data/prepared-effects.json"

export const getData = () => {
  return data
}

export const getEffectsCount = () => {
  return data.length
}

export const getPapersCount = () => {
  const papers = data.map((e) => {
    return e.paper
  })
  return [...new Set(papers)].length
}

export const getOutcomeCategories = () => {
  const outcomes = data.map((e) => {
    return e.outcome_category
  })
  return [...new Set(outcomes)]
}

export const getPlotData = () => {
  return data.map((e) => {
    return {
      name: e.label,
      x: e.effect_size_value,
      errorX: [
        Math.abs(e.effect_size_value - e.effect_size_lower),
        Math.abs(e.effect_size_value - e.effect_size_upper),
      ],
    }
  })
}
