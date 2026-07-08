/**
 * Canonical predicate functions used by both the meta-analysis filter (joined
 * data.json) and the per-level data-explorer filters. Each predicate accepts
 * the narrowest possible row shape so callers can mix and match.
 *
 * Conventions:
 * - Single-value cells (one atomic token per row) use exact membership:
 *   `values.includes(row.field)`.
 * - Multi-value cells (comma-joined tokens) use substring match. This is
 *   permissive but matches the long-standing behavior; a stricter
 *   split-on-", " match would be a separate change (see CODE-REVIEW.md #20
 *   for the equivalent fix already applied to the moderator analysis).
 */

// ── Paper ────────────────────────────────────────────────────────────────────

export const paperYearInRange = (
  row: { paper_year: number },
  range: number[],
) => row.paper_year >= range[0] && row.paper_year <= range[1]

export const paperTypeMatches = (
  row: { paper_type: string },
  values: string[],
) => values.some((v) => row.paper_type.includes(v))

export const paperOpenAccessMatches = (
  row: { paper_open_access: string },
  values: string[],
) => values.some((v) => row.paper_open_access.includes(v))

// ── Study ────────────────────────────────────────────────────────────────────

export const studyPreregisteredMatches = (
  row: { study_preregistered: string },
  values: string[],
) => values.includes(row.study_preregistered)

export const studyDataAvailableMatches = (
  row: { study_data_available: string },
  values: string[],
) => values.some((v) => row.study_data_available.includes(v))

export const studyDesignMatches = (
  row: { study_design: string },
  values: string[],
) => values.some((v) => row.study_design.includes(v))

export const studyConditionAssignmentMatches = (
  row: { study_condition_assignment: string },
  values: string[],
) => values.some((v) => row.study_condition_assignment.includes(v))

export const studyRandomizationMatches = (
  row: { study_randomization: string },
  values: string[],
) => values.includes(row.study_randomization)

export const studyNAtLeast = (row: { study_n: number }, min: number) =>
  row.study_n >= min

// ── Sample ───────────────────────────────────────────────────────────────────

export const sampleCountryMatches = (
  row: { sample_country: string | null },
  values: string[],
) => row.sample_country != null && values.includes(row.sample_country)

export const sampleTypeMatches = (
  row: { sample_type: string },
  values: string[],
) => values.some((v) => row.sample_type.includes(v))

export const sampleRepresentativeMatches = (
  row: { sample_representative: string },
  values: string[],
) => values.some((v) => row.sample_representative.includes(v))

// ── Intervention ─────────────────────────────────────────────────────────────

export const interventionMechanismMatches = (
  row: { intervention_mechanism: string | null },
  values: string[],
) => values.some((v) => row.intervention_mechanism?.includes(v) ?? false)

export const interventionMediumMatches = (
  row: { intervention_medium: string | null },
  values: string[],
) => values.some((v) => row.intervention_medium?.includes(v) ?? false)

export const interventionMechanismMulticomponentMatches = (
  row: { intervention_mechanism_multicomponent: string },
  values: string[],
) => values.includes(row.intervention_mechanism_multicomponent)

export const interventionMediumMulticomponentMatches = (
  row: { intervention_medium_multicomponent: string },
  values: string[],
) => values.includes(row.intervention_medium_multicomponent)

// ── Outcome ──────────────────────────────────────────────────────────────────

export const outcomeCategoryMatches = (
  row: { outcome_category: string },
  values: string[],
) => values.includes(row.outcome_category)

export const outcomeSubcategoryMatches = (
  row: { outcome_subcategory: string },
  values: string[],
) => values.includes(row.outcome_subcategory)

export const outcomeMeasurementTypeMatches = (
  row: { outcome_measurement_type: string },
  values: string[],
) => values.includes(row.outcome_measurement_type)

// ── Effect ───────────────────────────────────────────────────────────────────

export const effectSampleSizeAtLeast = (
  row: { effect_control_n: number | null; effect_intervention_n: number | null },
  min: number,
) =>
  (row.effect_control_n ?? 0) >= min &&
  (row.effect_intervention_n ?? 0) >= min

export const effectSizeInRange = (
  row: { effect_size: number | null },
  range: number[],
) =>
  row.effect_size != null &&
  row.effect_size >= range[0] &&
  row.effect_size <= range[1]
