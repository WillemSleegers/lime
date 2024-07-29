import data from "../assets/data/prepared-effects.json"

export type dataProps = typeof data
type dataKeys = keyof dataProps[0]

export const getUniqueData = (data: dataProps, x: dataKeys) => {
  const array = data.map((e) => {
    return e[x]
  })

  return new Set(array).size
}

export const getCounts = (data: dataProps, by: dataKeys, x: dataKeys) => {
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
  data: dataProps,
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

export const getOptions = (
  x:
    | "behaviors"
    | "intentions"
    | "attitudes"
    | "outcome_measurement_type"
    | "intervention_aspect"
    | "intervention_medium"
    | "intervention_appeal"
    | "intervention_sample_country",
) => {
  let options

  switch (x) {
    case "behaviors":
      options = [
        ...new Set(
          data
            .filter((d) => d.outcome_category == "behavior")
            .map((d) => d["outcome_subcategory"]),
        ),
      ]
      break
    case "intentions":
      options = [
        ...new Set(
          data
            .filter((d) => d.outcome_category == "intentions")
            .map((d) => d["outcome_subcategory"]),
        ),
      ]
      break
    case "attitudes":
      options = [
        ...new Set(
          data
            .filter((d) => d.outcome_category == "attitudes/beliefs")
            .map((d) => d["outcome_subcategory"]),
        ),
      ]
      break
    case "intervention_aspect":
      options = [...new Set(data.map((d) => d["intervention_aspect"]))]
      options = options.toString().replaceAll("; ", ",").split(",")
      options = [...new Set(options)]
      options = options.filter((option) => option) // Remove empty strings
      options = options.map((e) => e)
      break
    case "intervention_medium":
      options = [...new Set(data.map((d) => d["intervention_medium"]))]
      options = options.toString().replaceAll("; ", ",").split(",")
      options = [...new Set(options)]
      options = options.filter((option) => option) // Remove empty strings
      options = options.map((e) => e)
      break
    case "intervention_appeal":
      options = [...new Set(data.map((d) => d["intervention_appeal"]))]
      options = options.toString().replaceAll("; ", ",").split(",")
      options = [...new Set(options)]
      options = options.map((e) => e)
      break
    case "intervention_sample_country":
      options = [...new Set(data.map((d) => d[x]))]
      options.push(options.splice(options.indexOf("N/A"), 1)[0])
      break
    default:
      options = [...new Set(data.map((d) => d[x]))]
  }

  return options
}
