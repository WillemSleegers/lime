import data from "../assets/data/prepared-effects.json"
import papers from "../assets/data/papers.json"
import outcomes from "../assets/data/outcomes.json"
import interventions from "../assets/data/interventions.json"
import effects from "../assets/data/effects.json"

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

type JSON = string | number | boolean | { [x: string]: JSON } | Array<JSON>

const simple = [
  {
    a: 1,
    b: [
      {
        c: 2,
      },
      {
        c: 3,
      },
    ],
  },
  {
    a: 4,
    b: [
      {
        c: 5,
      },
      {
        c: 6,
      },
    ],
  },
]

const result = [
  { a: 1, c: 2 },
  { a: 1, c: 3 },
  { a: 4, c: 5 },
  { a: 4, c: 6 },
]

const testData = [
  {
    paper: 1,
    paper_title: "Title A",
    paper_authors: "Willem",
    outcomes: [
      {
        outcome: 1,
        outcome_title: "Outcome A",
      },
      {
        outcome: 2,
        outcome_title: "Outcome B",
        effects: [
          {
            effect: 1,
            effect_size_value: 5.3,
          },
          {
            effect: 2,
            effect_size_value: 1.2,
          },
        ],
      },
    ],
  },
  {
    paper: 2,
    paper_title: "Title B",
    paper_authors: "Bastian",
    outcomes: [
      {
        outcome: 1,
        outcome_title: "Outcome C",
      },
      {
        outcome: 2,
        outcome_title: "Outcome D",
      },
    ],
  },
]

const result2 = [
  {
    paper: 1,
    paper_title: "Title A",
    paper_authors: "Willem",
    outcome: 1,
    outcome_title: "Outcome A",
    effect: undefined,
    effect_size_value: undefined,
  },
  {
    paper: 1,
    paper_title: "Title A",
    paper_authors: "Willem",
    outcome: 2,
    outcome_title: "Outcome B",
    effect: 1,
    effect_size_value: 5.3,
  },
  {
    paper: 1,
    paper_title: "Title A",
    paper_authors: "Willem",
    outcome: 2,
    outcome_title: "Outcome B",
    effect: 2,
    effect_size_value: 1.2,
  },
  {
    paper: 2,
    paper_title: "Title B",
    paper_authors: "Bastian",
    outcome: 1,
    outcome_title: "Outcome C",
    effect: undefined,
    effect_size_value: undefined,
  },
  {
    paper: 2,
    paper_title: "Title B",
    paper_authors: "Bastian",
    outcome: 2,
    outcome_title: "Outcome D",
    effect: undefined,
    effect_size_value: undefined,
  },
]

const allKeys = (x: { [key: string]: unknown }) => {
  const internal = (x: { [key: string]: unknown }, out: string[]) => {
    Object.keys(x).forEach((key) => {
      const value = x[key]
      if (typeof value === "object" && value !== null) {
        out = internal(value as { [key: string]: unknown }, out)
      } else {
        if (!out.includes(key)) out = [...out, key]
      }
    })

    return out
  }

  return internal(x, [])
}

const filterObjectByKeys = (x: any, keys: string[]) => {
  Object.keys(x).forEach((key) => {
    const value = x[key]
    if (typeof value === "object" && value !== null) {
      filterObjectByKeys(value, keys)
    } else {
      if (!keys.includes(key)) {
        delete x[key]
      }
    }
  })

  return x
}

function mergeTableArrays(
  arr1: { [key: string]: unknown }[],
  arr2: { [key: string]: unknown }[],
) {
  const result: { [key: string]: unknown }[] = []
  const longerArr = arr1.length >= arr2.length ? arr1 : arr2
  const shorterArr = arr1.length < arr2.length ? arr1 : arr2

  longerArr.forEach((obj, index) => {
    const mergedObj = { ...obj }

    // Find a matching object from the shorter array based on shared properties
    const matchingObj = shorterArr.find((shortObj) =>
      Object.keys(shortObj).some(
        (key) => Object.keys(obj).includes(key) && obj[key] === shortObj[key],
      ),
    )

    // Merge the matching object if found
    if (matchingObj) {
      Object.assign(mergedObj, matchingObj)
    }

    result.push(mergedObj)
  })

  return result
}

function mergeArrays(arr1: any, arr2: any) {
  if (arr1.length === 0) return arr2
  if (arr2.length === 0) return arr1

  // Find common keys
  const commonKeys = Object.keys(arr1[0]).filter((key) => key in arr2[0])

  if (commonKeys.length === 0) return [...arr1, ...arr2]

  // Create a map for quick lookup of arr1 objects
  const arr1Map = new Map()

  for (const obj of arr1) {
    const key = commonKeys.map((k) => obj[k]).join("|")
    arr1Map.set(key, obj)
  }

  // Merge arrays
  const result = new Array(arr2.length)

  for (let i = 0; i < arr2.length; i++) {
    const obj2 = arr2[i]
    const key = commonKeys.map((k) => obj2[k]).join("|")
    const obj1 = arr1Map.get(key) || {}
    result[i] = { ...obj1, ...obj2 }
  }

  return result
}

const outcomeColumns = [
  "outcome_label",
  "outcome_category",
  "outcome_subcategory",
  "outcome_measurement_type",
]
const interventionColumns = [
  "intervention_appeal",
  "intervention_medium",
  "intervention_aspect",
]
const effectColumns = ["effect_size_value"]

export const getTableData = (columns: string[]) => {
  let tableData
  tableData = papers

  if (columns.some((r) => outcomeColumns.includes(r))) {
    tableData = mergeArrays(tableData, outcomes)
  }

  if (columns.some((r) => interventionColumns.includes(r))) {
    tableData = mergeArrays(tableData, interventions)
  }

  if (columns.some((r) => effectColumns.includes(r))) {
    tableData = mergeArrays(tableData, effects)
  }

  return tableData
}
