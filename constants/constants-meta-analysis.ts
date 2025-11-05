import data from "@/assets/data/data.json"
import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
} from "@/constants/constants-filters"

export const META_ANALYSIS_DEFAULTS = {
  // Individual outcome category defaults (for reference/documentation)
  outcome_subcategory_behavior: [
    "meat consumption",
    "vegetarian consumption",
    "vegan consumption",
  ],
  outcome_subcategory_intention: [
    "meat consumption intentions",
    "vegetarian consumption intentions",
  ],
  outcome_subcategory_attitude: [],
  // Combined outcome subcategory default (actually used in forms)
  outcome_subcategory: [
    ...OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
    ...OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  ],
  outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map(
    (option) => option.value
  ),
  intervention_multicomponent: ["no"],
  intervention_content: ["animal welfare", "environment", "health"],
  intervention_mechanism: ["factual", "logical argument", "infotainment"],
  intervention_medium: INTERVENTION_MEDIUM_OPTIONS,
  study_preregistered: ["yes", "no"],
  study_data_available: STUDY_DATA_AVAILABLE_OPTIONS.map(
    (option) => option.value
  ),
  study_design: STUDY_DESIGN_OPTIONS.map((option) => option.value),
  study_condition_assignment: STUDY_CONDITION_ASSIGNMENT_OPTIONS.map(
    (option) => option.value
  ),
  study_randomization: ["yes"],
  sample_type: ["public", "panel", "university"],
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
