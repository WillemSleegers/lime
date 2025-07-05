import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"

import { customSort } from "@/lib/utils"

const NA_OPTIONS = ["none", "N/A"]

// Paper-level
export const PAPER_TYPE_OPTIONS = customSort([
  ...new Set(papers.map((datum) => datum.paper_type)),
])
export const PAPER_OPEN_ACCESS_OPTIONS = [
  ...new Set(papers.map((datum) => datum.paper_open_access)),
]

// Study-level
export const STUDY_PREREGISTERED_OPTIONS = [
  ...new Set(studies.map((datum) => datum.study_preregistered)),
]
export const STUDY_DATA_AVAILABLE_OPTIONS = [
  ...new Set(studies.map((datum) => datum.study_data_available)),
]

export const STUDY_CONDITION_ASSIGNMENT = [
  ...new Set(studies.map((datum) => datum.study_condition_assignment)),
]

export const STUDY_DESIGN = [
  ...new Set(studies.map((datum) => datum.study_design)),
]

export const STUDY_RANDOMIZATION = [
  ...new Set(studies.map((datum) => datum.study_randomization)),
]

// Intervention-level
export const INTERVENTION_CONTENT_OPTIONS = customSort(
  [
    ...new Set(
      interventions
        .map((datum) => datum.intervention_content)
        .flatMap((str) => str.split(", ").map((s) => s))
    ),
  ],
  NA_OPTIONS
)
export const INTERVENTION_MECHANISM_OPTIONS = customSort([
  ...new Set(
    interventions
      .map((datum) => datum.intervention_mechanism)
      .flatMap((str) => str.split(",").map((s) => s.trim()))
  ),
])
export const INTERVENTION_MEDIUM_OPTIONS = customSort([
  ...new Set(
    interventions
      .map((datum) => datum.intervention_medium)
      .flatMap((str) => str.split(",").map((s) => s.trim()))
  ),
])
export const COUNTRY_OPTIONS = customSort(
  [
    ...new Set(
      interventions
        .map((datum) => datum.sample_country)
        .flatMap((str) => str.split(", ").map((s) => s.trim()))
    ),
  ],
  NA_OPTIONS
)

// Outcome level
export const OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS = customSort([
  ...new Set(
    outcomes
      .filter((datum) => datum.outcome_category === "behavior")
      .map((datum) => datum.outcome_subcategory)
  ),
])
export const OUTCOME_SUBCATEGORY_INTENTION_OPTIONS = customSort([
  ...new Set(
    outcomes
      .filter((datum) => datum.outcome_category === "intentions")
      .map((datum) => datum.outcome_subcategory)
  ),
])
export const OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS = customSort([
  ...new Set(
    outcomes
      .filter((datum) => datum.outcome_category === "attitudes/beliefs")
      .map((datum) => datum.outcome_subcategory)
  ),
])
export const OUTCOME_MEASUREMENT_TYPE_OPTIONS = customSort([
  ...new Set(outcomes.map((datum) => datum.outcome_measurement_type)),
])
