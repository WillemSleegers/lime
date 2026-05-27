import { countOption } from "@/lib/filter-counts"
import data from "@/assets/data/data.json"
import {
  ALL_COUNTRY_VALUES,
  COUNTRY_OPTIONS,
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  STUDY_RANDOMIZATION_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  INTERVENTION_MULTICOMPONENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
} from "@/constants/constants-filters"
import * as P from "@/lib/filter-predicates"

type FilterValues = {
  outcome_subcategory: string[]
  outcome_measurement_type: string[]
  effect_sample_size: number
  intervention_mechanism_multicomponent: string[]
  intervention_medium_multicomponent: string[]
  intervention_mechanism: string[]
  intervention_medium: string[]
  sample_country: string[]
  sample_type: string[]
  sample_representative: string[]
  study_preregistered: string[]
  study_data_available: string[]
  study_design: string[]
  study_condition_assignment: string[]
  study_randomization: string[]
  paper_year: number[]
  paper_type: string[]
  paper_open_access: string[]
}

// Map filter field name → predicate(row, value). Adding a new filter is a
// single entry here plus an entry in the FilterValues type above.
const PREDICATES = {
  paper_year: P.paperYearInRange,
  paper_type: P.paperTypeMatches,
  paper_open_access: P.paperOpenAccessMatches,
  study_preregistered: P.studyPreregisteredMatches,
  study_data_available: P.studyDataAvailableMatches,
  study_design: P.studyDesignMatches,
  study_condition_assignment: P.studyConditionAssignmentMatches,
  study_randomization: P.studyRandomizationMatches,
  sample_country: P.sampleCountryMatches,
  sample_type: P.sampleTypeMatches,
  sample_representative: P.sampleRepresentativeMatches,
  intervention_mechanism: P.interventionMechanismMatches,
  intervention_medium: P.interventionMediumMatches,
  intervention_mechanism_multicomponent: P.interventionMechanismMulticomponentMatches,
  intervention_medium_multicomponent: P.interventionMediumMulticomponentMatches,
  outcome_subcategory: P.outcomeSubcategoryMatches,
  outcome_measurement_type: P.outcomeMeasurementTypeMatches,
} as const

function applyFilters(
  source: typeof data,
  f: FilterValues,
  exclude?: keyof FilterValues,
): typeof data {
  return source.filter((d) => {
    // effect_sample_size is always applied (no exclude variant needed today).
    if (!P.effectSampleSizeAtLeast(d, f.effect_sample_size)) return false
    for (const key in PREDICATES) {
      if (key === exclude) continue
      const fn = PREDICATES[key as keyof typeof PREDICATES] as (
        row: typeof d,
        value: unknown,
      ) => boolean
      if (!fn(d, f[key as keyof typeof PREDICATES])) return false
    }
    return true
  })
}

function makeCounts(
  subset: typeof data,
  field: string,
  options: { value: string }[],
  match: "exact" | "substring" = "substring",
): Record<string, number> {
  return Object.fromEntries(
    options.map((o) => [
      o.value,
      countOption(subset as Record<string, unknown>[], field, o.value, match),
    ]),
  )
}

function makeCountsFromStrings(
  subset: typeof data,
  field: string,
  options: string[],
  match: "exact" | "substring" = "substring",
): Record<string, number> {
  return Object.fromEntries(
    options.map((v) => [
      v,
      countOption(subset as Record<string, unknown>[], field, v, match),
    ]),
  )
}

export function useFilterCounts(values: FilterValues) {
  return {
    total: applyFilters(data, values).length,
    paperType: makeCounts(applyFilters(data, values, "paper_type"), "paper_type", PAPER_TYPE_OPTIONS),
    paperOpenAccess: makeCounts(applyFilters(data, values, "paper_open_access"), "paper_open_access", PAPER_OPEN_ACCESS_OPTIONS),
    studyPreregistered: makeCounts(applyFilters(data, values, "study_preregistered"), "study_preregistered", STUDY_PREREGISTERED_OPTIONS, "exact"),
    studyDataAvailable: makeCounts(applyFilters(data, values, "study_data_available"), "study_data_available", STUDY_DATA_AVAILABLE_OPTIONS),
    studyRandomization: makeCounts(applyFilters(data, values, "study_randomization"), "study_randomization", STUDY_RANDOMIZATION_OPTIONS),
    studyDesign: makeCounts(applyFilters(data, values, "study_design"), "study_design", STUDY_DESIGN_OPTIONS),
    studyConditionAssignment: makeCounts(applyFilters(data, values, "study_condition_assignment"), "study_condition_assignment", STUDY_CONDITION_ASSIGNMENT_OPTIONS),
    sampleCountry: makeCountsFromStrings(applyFilters(data, values, "sample_country"), "sample_country", ALL_COUNTRY_VALUES, "exact"),
    sampleRepresentative: makeCounts(applyFilters(data, values, "sample_representative"), "sample_representative", SAMPLE_REPRESENTATIVE_OPTIONS),
    sampleType: makeCounts(applyFilters(data, values, "sample_type"), "sample_type", SAMPLE_TYPE_OPTIONS),
    interventionMechanismMulticomponent: makeCounts(applyFilters(data, values, "intervention_mechanism_multicomponent"), "intervention_mechanism_multicomponent", INTERVENTION_MULTICOMPONENT_OPTIONS, "exact"),
    interventionMediumMulticomponent: makeCounts(applyFilters(data, values, "intervention_medium_multicomponent"), "intervention_medium_multicomponent", INTERVENTION_MULTICOMPONENT_OPTIONS, "exact"),
    interventionMechanism: makeCountsFromStrings(applyFilters(data, values, "intervention_mechanism"), "intervention_mechanism", INTERVENTION_MECHANISM_OPTIONS),
    interventionMedium: makeCountsFromStrings(applyFilters(data, values, "intervention_medium"), "intervention_medium", INTERVENTION_MEDIUM_OPTIONS),
    outcomeSubcategory: makeCountsFromStrings(
      applyFilters(data, values, "outcome_subcategory"),
      "outcome_subcategory",
      [...OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS, ...OUTCOME_SUBCATEGORY_INTENTION_OPTIONS, ...OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS],
      "exact",
    ),
    outcomeMeasurementType: makeCounts(applyFilters(data, values, "outcome_measurement_type"), "outcome_measurement_type", OUTCOME_MEASUREMENT_TYPE_OPTIONS),
  }
}

export { applyFilters }
export type { FilterValues }
