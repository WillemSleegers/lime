/**
 * Canonical predicate functions used by both the meta-analysis filter (joined
 * data.json) and the per-level data-explorer filters. Each predicate accepts
 * the narrowest possible row shape so callers can mix and match.
 *
 * Conventions:
 * - Single-value cells (one atomic token per row) use exact membership:
 *   `values.includes(row.field)`.
 * - Multi-value cells (comma-joined tokens) are split into exact tokens via
 *   `hasToken`, matching the approach used for the moderator analysis
 *   (lib/r-functions.ts). A plain substring match would also match a
 *   filter value against an unrelated token that merely contains it as a
 *   substring (e.g. mechanism "taste" matching "info: taste/disgust").
 */

const hasToken = (cell: string, values: string[]) => {
  const tokens = cell.split(",").map((t) => t.trim())
  return values.some((v) => tokens.includes(v))
}

// ── Paper ────────────────────────────────────────────────────────────────────

export const paperYearInRange = (
  row: { paper_year: number },
  range: number[],
) => row.paper_year >= range[0] && row.paper_year <= range[1]

export const paperTypeMatches = (
  row: { paper_type: string },
  values: string[],
) => hasToken(row.paper_type, values)

export const paperOpenAccessMatches = (
  row: { paper_open_access: string },
  values: string[],
) => hasToken(row.paper_open_access, values)

// ── Study ────────────────────────────────────────────────────────────────────

export const studyPreregisteredMatches = (
  row: { study_preregistered: string },
  values: string[],
) => values.includes(row.study_preregistered)

export const studyDataAvailableMatches = (
  row: { study_data_available: string },
  values: string[],
) => hasToken(row.study_data_available, values)

export const studyDesignMatches = (
  row: { study_design: string },
  values: string[],
) => hasToken(row.study_design, values)

export const studyConditionAssignmentMatches = (
  row: { study_condition_assignment: string },
  values: string[],
) => hasToken(row.study_condition_assignment, values)

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
) => hasToken(row.sample_type, values)

export const sampleRepresentativeMatches = (
  row: { sample_representative: string },
  values: string[],
) => hasToken(row.sample_representative, values)

// ── Intervention ─────────────────────────────────────────────────────────────

export const interventionMechanismMatches = (
  row: { intervention_mechanism: string | null },
  values: string[],
) => row.intervention_mechanism != null && hasToken(row.intervention_mechanism, values)

export const interventionMediumMatches = (
  row: { intervention_medium: string | null },
  values: string[],
) => row.intervention_medium != null && hasToken(row.intervention_medium, values)

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
