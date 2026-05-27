import data from "@/assets/data/data.json"
import type { DataKeys } from "@/lib/types"
import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  STUDY_RANDOMIZATION_OPTIONS,
  INTERVENTION_MULTICOMPONENT_OPTIONS, // kept for shared yes/no options
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
  OUTCOME_CATEGORY_OPTIONS,
  OUTCOME_SUBCATEGORY_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
  ALL_COUNTRY_VALUES,
} from "@/constants/constants-filters"

export const META_ANALYSIS_DEFAULTS = {
  outcome_subcategory: OUTCOME_SUBCATEGORY_OPTIONS,
  outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map(
    (option) => option.value
  ),
  intervention_mechanism_multicomponent: INTERVENTION_MULTICOMPONENT_OPTIONS.map(
    (option) => option.value
  ),
  intervention_medium_multicomponent: INTERVENTION_MULTICOMPONENT_OPTIONS.map(
    (option) => option.value
  ),
  intervention_mechanism: INTERVENTION_MECHANISM_OPTIONS,
  intervention_medium: INTERVENTION_MEDIUM_OPTIONS,
  sample_country: ALL_COUNTRY_VALUES,
  study_preregistered: STUDY_PREREGISTERED_OPTIONS.map((option) => option.value),
  study_data_available: STUDY_DATA_AVAILABLE_OPTIONS.map(
    (option) => option.value
  ),
  study_design: STUDY_DESIGN_OPTIONS.map((option) => option.value),
  study_condition_assignment: STUDY_CONDITION_ASSIGNMENT_OPTIONS.map(
    (option) => option.value
  ),
  study_randomization: STUDY_RANDOMIZATION_OPTIONS.map((option) => option.value),
  sample_type: SAMPLE_TYPE_OPTIONS.map((option) => option.value),
  sample_representative: SAMPLE_REPRESENTATIVE_OPTIONS.map(
    (option) => option.value
  ),
  paper_year: [
    Math.min(...data.map((datum) => datum.paper_year)),
    Math.max(...data.map((datum) => datum.paper_year)),
  ],
  paper_type: PAPER_TYPE_OPTIONS.map((option) => option.value),
  paper_open_access: PAPER_OPEN_ACCESS_OPTIONS.map((option) => option.value),
}

export type ModeratorVariable = {
  value: DataKeys
  label: string
  levels: string[]
}

export const MODERATOR_VARIABLES: ModeratorVariable[] = [
  { value: "outcome_category", label: "Outcome category", levels: OUTCOME_CATEGORY_OPTIONS },
  { value: "outcome_subcategory", label: "Outcome subcategory", levels: OUTCOME_SUBCATEGORY_OPTIONS },
  { value: "outcome_measurement_type", label: "Measurement type", levels: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((o) => o.value) },
  { value: "study_preregistered", label: "Preregistered", levels: STUDY_PREREGISTERED_OPTIONS.map((o) => o.value) },
  { value: "study_randomization", label: "Randomization", levels: STUDY_RANDOMIZATION_OPTIONS.map((o) => o.value) },
  { value: "study_design", label: "Study design", levels: STUDY_DESIGN_OPTIONS.map((o) => o.value) },
  { value: "intervention_mechanism", label: "Intervention mechanism", levels: INTERVENTION_MECHANISM_OPTIONS },
  { value: "intervention_medium", label: "Intervention medium", levels: INTERVENTION_MEDIUM_OPTIONS },
  { value: "sample_country", label: "Country", levels: ALL_COUNTRY_VALUES },
  { value: "sample_type", label: "Sample type", levels: SAMPLE_TYPE_OPTIONS.map((o) => o.value) },
]
