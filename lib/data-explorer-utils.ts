import type { Data, Papers, Studies, Samples, Interventions, Outcomes, Effects } from "./types"

export type FilteredData = {
  papers: Papers
  studies: Studies
  samples: Samples
  interventions: Interventions
  outcomes: Outcomes
  effects: Effects
}

/**
 * Extracts unique records from data based on specified keys
 */
function uniqueBy<T extends Record<string, unknown>>(
  data: T[],
  keys: (keyof T)[]
): T[] {
  const seen = new Set<string>()
  const result: T[] = []

  for (const item of data) {
    const key = keys.map((k) => String(item[k])).join("|")
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}

/**
 * Applies cross-level filtering to display data.
 * All filtered levels constrain all other levels automatically.
 */
export function applyFiltersToData(
  fullData: Data,
  filteredData: FilteredData
): FilteredData {
  // Build constraint sets for O(1) lookup from ALL filtered levels
  const paperIds = new Set(filteredData.papers.map((p) => p.paper))
  const studyIds = new Set(
    filteredData.studies.map((s) => `${s.paper}|${s.study}`)
  )
  const sampleIds = new Set(
    filteredData.samples.map(
      (s) => `${s.paper}|${s.study}|${s.sample_intervention}`
    )
  )
  const interventionIds = new Set(
    filteredData.interventions.map(
      (i) => `${i.paper}|${i.study}|${i.intervention_condition}`
    )
  )
  const outcomeIds = new Set(
    filteredData.outcomes.map((o) => `${o.paper}|${o.study}|${o.outcome}`)
  )
  const effectIds = new Set(
    filteredData.effects.map(
      (e) => `${e.paper}|${e.study}|${e.effect}`
    )
  )

  // Filter fullData based on all constraints
  const constrained = fullData.filter((row) => {
    if (!paperIds.has(row.paper)) return false
    if (!studyIds.has(`${row.paper}|${row.study}`)) return false
    if (!sampleIds.has(`${row.paper}|${row.study}|${row.sample_intervention}`))
      return false
    if (!interventionIds.has(`${row.paper}|${row.study}|${row.intervention_condition}`))
      return false
    if (!outcomeIds.has(`${row.paper}|${row.study}|${row.outcome}`))
      return false
    if (!effectIds.has(`${row.paper}|${row.study}|${row.effect}`))
      return false
    return true
  })

  // Extract unique records at each level
  return {
    papers: uniqueBy(constrained, ["paper"]) as Papers,
    studies: uniqueBy(constrained, ["paper", "study"]) as Studies,
    samples: uniqueBy(constrained, [
      "paper",
      "study",
      "sample_intervention",
    ]) as Samples,
    interventions: uniqueBy(constrained, [
      "paper",
      "study",
      "intervention_condition",
    ]) as Interventions,
    outcomes: uniqueBy(constrained, [
      "paper",
      "study",
      "outcome",
    ]) as Outcomes,
    effects: uniqueBy(constrained, [
      "paper",
      "study",
      "effect",
    ]) as Effects,
  }
}
