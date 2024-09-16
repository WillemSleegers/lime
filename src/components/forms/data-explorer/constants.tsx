export const DEFAULT_COLUMNS = {
  paper: [
    "paper_year",
    "paper_title",
    "paper_authors",
    "paper_source",
    "paper_link",
    "paper_open_access",
    "paper_data_available",
  ],
  study: ["study", "study_n"],
  intervention: [
    "intervention_appeal",
    "intervention_medium",
    "intervention_aspect",
  ],
  outcome: [
    "outcome_label",
    "outcome_category",
    "outcome_subcategory",
    "outcome_measurement_type",
  ],
  sample: ["sample_intervention_country"],
  effect: ["effect_size_value", "effect_control_n", "effect_intervention_n"],
}

export const DEFAULT_VALUES = {
  paper_open_access: ["yes", "no"],
  paper_data_available: ["yes", "no", "n/a"],
}
