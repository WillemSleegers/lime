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

export type BinaryModeratorLevel = {
  label: string
  column: DataKeys
}

export type ModeratorVariable = {
  value: DataKeys
  label: string
  levels: string[]
  // True when the data column may hold multiple comma-joined tokens per row
  // (e.g. "info: health, norms: descriptive"). For multi-value moderators we
  // run a separate meta-analysis per level rather than a joint factor model.
  multivalue?: boolean
  // When present, each level maps to a dedicated binary (0/1) indicator column.
  // Takes precedence over multivalue: runs one univariable model per column.
  binaryLevels?: BinaryModeratorLevel[]
  // Label for a single binary level in the UI (e.g. "Mechanism", "Medium").
  levelLabel?: string
  // Column that indicates whether this moderator is multi-component ("yes"/"no").
  // When set, a "single only" switch is shown to restrict to single-component rows.
  multicomponentColumn?: DataKeys
}

export const MECHANISM_BINARY_LEVELS: BinaryModeratorLevel[] = [
  { label: "Choice architecture (availability/variety/size)", column: "has_mechanism_choice_architecture_availability_variety_size" },
  { label: "Choice architecture (default)", column: "has_mechanism_choice_architecture_default" },
  { label: "Choice architecture (visibility/salience/ease)", column: "has_mechanism_choice_architecture_visibility_salience_ease" },
  { label: "Information (animal welfare)", column: "has_mechanism_info_animal_welfare" },
  { label: "Information (environment)", column: "has_mechanism_info_environment" },
  { label: "Information (health)", column: "has_mechanism_info_health" },
  { label: "Information (taste/disgust)", column: "has_mechanism_info_taste_disgust" },
  { label: "Norms (descriptive)", column: "has_mechanism_norms_descriptive" },
  { label: "Norms (dynamic)", column: "has_mechanism_norms_dynamic" },
  { label: "Goal pursuit (cooking skills)", column: "has_mechanism_goal_pursuit_cooking_skills" },
  { label: "Goal pursuit (efficacy/consequences/feedback)", column: "has_mechanism_goal_pursuit_efficacy_consequences_feedback" },
  { label: "Goal pursuit (food provision)", column: "has_mechanism_goal_pursuit_food_provision" },
  { label: "Goal pursuit (planning/pledge/reminder)", column: "has_mechanism_goal_pursuit_planning_pledge_reminder" },
  { label: "Emotions (negative)", column: "has_mechanism_emotions_negative" },
  { label: "Emotions (positive)", column: "has_mechanism_emotions_positive" },
  { label: "Identity/reputation", column: "has_mechanism_identity_reputation" },
  { label: "Authority/role models", column: "has_mechanism_authority_role_models" },
  { label: "Origin of animal product", column: "has_mechanism_origin_of_animal_product" },
  { label: "Perspective taking/individuation", column: "has_mechanism_perspective_taking_individuation" },
  { label: "Logical argument", column: "has_mechanism_logical_argument" },
  { label: "Priming", column: "has_mechanism_priming" },
  { label: "Price", column: "has_mechanism_price" },
  { label: "Taste", column: "has_mechanism_taste" },
  { label: "Other", column: "has_mechanism_other" },
]

export const MEDIUM_BINARY_LEVELS: BinaryModeratorLevel[] = [
  { label: "Text", column: "has_medium_text" },
  { label: "Presentation", column: "has_medium_presentation" },
  { label: "Video", column: "has_medium_video" },
  { label: "3D video", column: "has_medium_3d_video" },
  { label: "Image", column: "has_medium_image" },
  { label: "Choice architecture", column: "has_medium_choice_architecture" },
  { label: "In person", column: "has_medium_in_person" },
  { label: "Label", column: "has_medium_label" },
  { label: "Price", column: "has_medium_price" },
  { label: "Other", column: "has_medium_other" },
  { label: "Taste", column: "has_medium_taste" },
]

export const MODERATOR_VARIABLES: ModeratorVariable[] = [
  { value: "outcome_category", label: "Outcome category", levels: OUTCOME_CATEGORY_OPTIONS },
  { value: "outcome_subcategory", label: "Outcome subcategory", levels: OUTCOME_SUBCATEGORY_OPTIONS },
  { value: "outcome_measurement_type", label: "Measurement type", levels: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((o) => o.value) },
  { value: "study_preregistered", label: "Preregistered", levels: STUDY_PREREGISTERED_OPTIONS.map((o) => o.value) },
  { value: "study_randomization", label: "Randomization", levels: STUDY_RANDOMIZATION_OPTIONS.map((o) => o.value) },
  { value: "study_design", label: "Study design", levels: STUDY_DESIGN_OPTIONS.map((o) => o.value) },
  {
    value: "intervention_mechanism",
    label: "Intervention mechanism",
    levels: MECHANISM_BINARY_LEVELS.map((b) => b.label),
    binaryLevels: MECHANISM_BINARY_LEVELS,
    levelLabel: "Mechanism",
    multicomponentColumn: "intervention_mechanism_multicomponent",
  },
  {
    value: "intervention_medium",
    label: "Intervention medium",
    levels: MEDIUM_BINARY_LEVELS.map((b) => b.label),
    binaryLevels: MEDIUM_BINARY_LEVELS,
    levelLabel: "Medium",
    multicomponentColumn: "intervention_medium_multicomponent",
  },
  { value: "sample_country", label: "Country", levels: ALL_COUNTRY_VALUES },
  { value: "sample_type", label: "Sample type", levels: SAMPLE_TYPE_OPTIONS.map((o) => o.value), multivalue: true },
]

export const ALLOWED_MODERATOR_VARS: ReadonlySet<string> = new Set(
  MODERATOR_VARIABLES.map((v) => v.value),
)

export const ALLOWED_BINARY_COLUMNS: ReadonlySet<string> = new Set([
  ...MECHANISM_BINARY_LEVELS.map((b) => b.column as string),
  ...MEDIUM_BINARY_LEVELS.map((b) => b.column as string),
])
