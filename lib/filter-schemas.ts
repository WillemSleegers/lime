import * as z from "zod"

// ============================================================================
// Paper Filters
// ============================================================================

export const paperFiltersFields = {
  paper_year: z.number().array(),
  paper_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  paper_open_access: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

// ============================================================================
// Study Filters
// ============================================================================

const studyPreregistrationField = {
  study_preregistered: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

export const studyFiltersFields = {
  ...studyPreregistrationField,
  study_data_available: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_design: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_condition_assignment: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_randomization: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

// ============================================================================
// Sample Filters
// ============================================================================

export const sampleFiltersFields = {
  sample_country: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  sample_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  sample_representative: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

// ============================================================================
// Intervention Filters
// ============================================================================

export const interventionFiltersFields = {
  intervention_mechanism_multicomponent: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_medium_multicomponent: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_mechanism: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_medium: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

export const interventionFiltersSchema = z.object(interventionFiltersFields)

// ============================================================================
// Outcome Filters
// ============================================================================

export const outcomeCategoriesFieldsNew = {
  outcome_category: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome category." }),
  outcome_subcategory: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome subcategory." }),
}
