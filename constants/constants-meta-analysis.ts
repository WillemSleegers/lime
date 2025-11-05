import data from "@/assets/data/data.json"
import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  STUDY_RANDOMIZATION_OPTIONS,
} from "@/constants/constants-filters"

export const META_ANALYSIS_DEFAULTS = {
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
  outcome_measurement_type: [
    "survey",
    "meal choice",
    "sales data",
    "food diary",
  ],
  intervention_multicomponent: ["yes", "no"],
  intervention_content: [
    "animal welfare",
    "health",
    "environment",
    "personal image",
    "taste/disgust",
    "none",
  ],
  intervention_mechanism: [
    "factual",
    "choice architecture",
    "identity",
    "logical argument",
    "price",
    "other",
    "negative emotional",
    "perspective taking",
    "goal pursuit",
    "norms",
    "origin of animal product",
    "infotainment",
    "celebrity",
    "symbolic meaning",
    "positive emotional",
    "taste",
  ],
  intervention_medium: [
    "text",
    "presentation",
    "video",
    "3D video",
    "image",
    "menu/food options",
    "in-person",
    "price",
  ],
  study_preregistered: ["yes", "no"],
  study_data_available: STUDY_DATA_AVAILABLE_OPTIONS.map(
    (option) => option.value
  ),
  study_design: STUDY_DESIGN_OPTIONS.map((option) => option.value),
  study_condition_assignment: STUDY_CONDITION_ASSIGNMENT_OPTIONS.map(
    (option) => option.value
  ),
  study_randomization: STUDY_RANDOMIZATION_OPTIONS.map(
    (option) => option.value
  ),
  paper_year: [
    Math.min(...data.map((datum) => datum.paper_year)),
    Math.max(...data.map((datum) => datum.paper_year)),
  ],
  paper_type: PAPER_TYPE_OPTIONS.map((option) => option.value),
  paper_open_access: PAPER_OPEN_ACCESS_OPTIONS.map((option) => option.value),
}
