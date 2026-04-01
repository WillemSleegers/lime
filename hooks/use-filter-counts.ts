import { countOption } from "@/lib/filter-counts"
import data from "@/assets/data/data.json"
import {
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
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
} from "@/constants/constants-filters"

type FilterValues = {
  outcome_subcategory: string[]
  outcome_measurement_type: string[]
  effect_sample_size: number
  intervention_multicomponent: string[]
  intervention_content: string[]
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

function applyFilters(
  source: typeof data,
  f: FilterValues,
  exclude?: keyof FilterValues,
): typeof data {
  let s = source

  if (exclude !== "outcome_subcategory")
    s = s.filter((d) => f.outcome_subcategory.some((v) => d.outcome_subcategory === v))

  if (exclude !== "outcome_measurement_type")
    s = s.filter((d) =>
      f.outcome_measurement_type.some((v) => d.outcome_measurement_type.includes(v)),
    )

  s = s.filter(
    (d) =>
      d.effect_control_n >= f.effect_sample_size &&
      d.effect_intervention_n >= f.effect_sample_size,
  )

  if (exclude !== "intervention_multicomponent")
    s = s.filter((d) => f.intervention_multicomponent.some((v) => d.intervention_multicomponent === v))

  if (exclude !== "intervention_content")
    s = s.filter((d) =>
      f.intervention_content.some((v) => d.intervention_content?.includes(v)),
    )

  if (exclude !== "intervention_mechanism")
    s = s.filter((d) =>
      f.intervention_mechanism.some((v) => d.intervention_mechanism?.includes(v)),
    )

  if (exclude !== "intervention_medium")
    s = s.filter((d) =>
      f.intervention_medium.some((v) => d.intervention_medium?.includes(v)),
    )

  if (exclude !== "sample_country")
    s = s.filter((d) => f.sample_country.includes(d.sample_country))

  if (exclude !== "sample_type")
    s = s.filter((d) => f.sample_type.some((v) => d.sample_type.includes(v)))

  if (exclude !== "sample_representative")
    s = s.filter((d) =>
      f.sample_representative.some((v) => d.sample_representative.includes(v)),
    )

  if (exclude !== "study_preregistered")
    s = s.filter((d) => f.study_preregistered.includes(d.study_preregistered))

  if (exclude !== "study_data_available")
    s = s.filter((d) =>
      f.study_data_available.some((v) => d.study_data_available.includes(v)),
    )

  if (exclude !== "study_design")
    s = s.filter((d) => f.study_design.some((v) => d.study_design.includes(v)))

  if (exclude !== "study_condition_assignment")
    s = s.filter((d) =>
      f.study_condition_assignment.some((v) =>
        d.study_condition_assignment.includes(v),
      ),
    )

  if (exclude !== "study_randomization")
    s = s.filter((d) =>
      f.study_randomization.some((v) => d.study_randomization.includes(v)),
    )

  if (exclude !== "paper_year")
    s = s.filter(
      (d) => d.paper_year >= f.paper_year[0] && d.paper_year <= f.paper_year[1],
    )

  if (exclude !== "paper_type")
    s = s.filter((d) => f.paper_type.some((v) => d.paper_type.includes(v)))

  if (exclude !== "paper_open_access")
    s = s.filter((d) =>
      f.paper_open_access.some((v) => d.paper_open_access.includes(v)),
    )

  return s
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
    sampleCountry: makeCountsFromStrings(applyFilters(data, values, "sample_country"), "sample_country", COUNTRY_OPTIONS, "exact"),
    sampleRepresentative: makeCounts(applyFilters(data, values, "sample_representative"), "sample_representative", SAMPLE_REPRESENTATIVE_OPTIONS),
    sampleType: makeCounts(applyFilters(data, values, "sample_type"), "sample_type", SAMPLE_TYPE_OPTIONS),
    interventionMulticomponent: makeCounts(applyFilters(data, values, "intervention_multicomponent"), "intervention_multicomponent", INTERVENTION_MULTICOMPONENT_OPTIONS, "exact"),
    interventionContent: makeCountsFromStrings(applyFilters(data, values, "intervention_content"), "intervention_content", INTERVENTION_CONTENT_OPTIONS),
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
