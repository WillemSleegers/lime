import type { Data, Papers, Studies, Interventions, Outcomes, Effects } from "./types"

export type FilteredData = {
  papers: Papers
  studies: Studies
  interventions: Interventions
  outcomes: Outcomes
  effects: Effects
}

export type Locks = {
  papers: boolean
  studies: boolean
  interventions: boolean
  outcomes: boolean
  effects: boolean
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
 * Applies lock-based filtering to display data based on active locks.
 * When no locks are active, returns the filtered data as-is.
 * When locks are active, filters the full dataset based on locked levels
 * and applies filters from unlocked levels.
 */
export function applyLocksToData(
  fullData: Data,
  filteredData: FilteredData,
  locks: Locks
): FilteredData {
  // When no locks are active, just return filtered data as-is
  const hasActiveLocks = Object.values(locks).some((locked) => locked)
  if (!hasActiveLocks) {
    return filteredData
  }

  // Build constraint sets for O(1) lookup - only for LOCKED levels
  const paperIds = locks.papers
    ? new Set(filteredData.papers.map((p) => p.paper))
    : null

  const studyIds = locks.studies
    ? new Set(
        filteredData.studies.map((s) => `${s.paper}|${s.study}`)
      )
    : null

  const interventionIds = locks.interventions
    ? new Set(
        filteredData.interventions.map(
          (i) => `${i.paper}|${i.study}|${i.intervention_condition}`
        )
      )
    : null

  const outcomeIds = locks.outcomes
    ? new Set(
        filteredData.outcomes.map((o) => `${o.paper}|${o.study}|${o.outcome}`)
      )
    : null

  const effectIds = locks.effects
    ? new Set(
        filteredData.effects.map(
          (e) => `${e.paper}|${e.study}|${e.effect}`
        )
      )
    : null

  // Filter fullData based on locked constraints
  const constrained = fullData.filter((row) => {
    if (paperIds && !paperIds.has(row.paper)) return false
    if (studyIds && !studyIds.has(`${row.paper}|${row.study}`)) return false
    if (interventionIds && !interventionIds.has(`${row.paper}|${row.study}|${row.intervention_condition}`))
      return false
    if (
      outcomeIds &&
      !outcomeIds.has(`${row.paper}|${row.study}|${row.outcome}`)
    )
      return false
    if (
      effectIds &&
      !effectIds.has(`${row.paper}|${row.study}|${row.effect}`)
    )
      return false
    return true
  })

  // Extract unique records at each level
  const uniqueConstrained = {
    papers: uniqueBy(constrained, ["paper"]) as Papers,
    studies: uniqueBy(constrained, ["paper", "study"]) as Studies,
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

  // Apply filters from unlocked levels by intersecting with filteredData
  return {
    papers: locks.papers
      ? uniqueConstrained.papers
      : intersectByKeys(uniqueConstrained.papers, filteredData.papers, ["paper"]),
    studies: locks.studies
      ? uniqueConstrained.studies
      : intersectByKeys(uniqueConstrained.studies, filteredData.studies, ["paper", "study"]),
    interventions: locks.interventions
      ? uniqueConstrained.interventions
      : intersectByKeys(uniqueConstrained.interventions, filteredData.interventions, ["paper", "study", "intervention_condition"]),
    outcomes: locks.outcomes
      ? uniqueConstrained.outcomes
      : intersectByKeys(uniqueConstrained.outcomes, filteredData.outcomes, ["paper", "study", "outcome"]),
    effects: locks.effects
      ? uniqueConstrained.effects
      : intersectByKeys(uniqueConstrained.effects, filteredData.effects, ["paper", "study", "effect"]),
  }
}

/**
 * Intersects two arrays based on matching composite keys
 */
function intersectByKeys<T extends Record<string, unknown>>(
  constrained: T[],
  filtered: T[],
  keys: (keyof T)[]
): T[] {
  const filteredKeys = new Set(
    filtered.map((item) => keys.map((k) => String(item[k])).join("|"))
  )
  return constrained.filter((item) => {
    const key = keys.map((k) => String(item[k])).join("|")
    return filteredKeys.has(key)
  })
}
