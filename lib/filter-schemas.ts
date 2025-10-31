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

export const studyPreregistrationField = {
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
  intervention_content: z
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

// NEW: Unified outcome categories field (single field for all categories)
export const outcomeCategoriesFieldsNew = {
  outcome_subcategory: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome category." }),
}

// LEGACY: Base schema fields for outcome categories (3 separate fields)
// Kept for backward compatibility - can be removed once all usages are migrated
const outcomeCategoriesFields = {
  outcome_subcategory_behavior: z.string().array(),
  outcome_subcategory_intention: z.string().array(),
  outcome_subcategory_attitude: z.string().array(),
}

// LEGACY: Shared refinement logic for outcome categories
// Kept for backward compatibility - can be removed once all usages are migrated
const addOutcomeCategoriesRefinement = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema.superRefine((values, ctx) => {
    const typedValues = values as {
      outcome_subcategory_behavior: string[]
      outcome_subcategory_intention: string[]
      outcome_subcategory_attitude: string[]
    }
    if (
      typedValues.outcome_subcategory_behavior.length +
        typedValues.outcome_subcategory_intention.length +
        typedValues.outcome_subcategory_attitude.length ==
      0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_behavior"],
      })
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_intention"],
      })
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_attitude"],
      })
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory"],
      })
    }
  })
}

// LEGACY: Shared validation schema for outcome category filters (without additional fields)
// Kept for backward compatibility - can be removed once all usages are migrated
export const outcomeCategoriesSchema = addOutcomeCategoriesRefinement(
  z.object(outcomeCategoriesFields)
)

// LEGACY: Helper to create a schema with outcome categories and additional fields
// Kept for backward compatibility - can be removed once all usages are migrated
export const createOutcomeCategoriesSchema = <T extends z.ZodRawShape>(
  additionalFields: T
) => {
  return addOutcomeCategoriesRefinement(
    z.object({ ...outcomeCategoriesFields, ...additionalFields })
  )
}

// Export the legacy fields for backward compatibility
export { outcomeCategoriesFields, addOutcomeCategoriesRefinement }
