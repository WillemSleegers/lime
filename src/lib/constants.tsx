export const PAPER_COLUMNS = [
  {
    value: "paper_title",
    label: "Title",
  },
  {
    value: "paper_authors",
    label: "Authors",
  },
  {
    value: "paper_year",
    label: "Year",
  },
  {
    value: "paper_source",
    label: "Source",
  },
  {
    value: "paper_link",
    label: "URL",
  },
  {
    value: "paper_open_access",
    label: "Open access",
  },
  {
    value: "paper_data_available",
    label: "Data available",
  },
]

export const PAPER_COLUMNS_DEFAULT = [
  "paper_year",
  "paper_open_access",
  "paper_data_available",
]

export const STUDY_COLUMNS = [
  {
    value: "study",
    label: "Study",
  },
  {
    value: "study_n",
    label: "Sample size",
  },
]

export const STUDY_COLUMNS_DEFAULT = ["study"]

export const INTERVENTION_COLUMNS = [
  {
    value: "intervention_appeal",
    label: "Intervention appeal",
  },
  {
    value: "intervention_medium",
    label: "Intervention medium",
  },
  {
    value: "intervention_aspect",
    label: "Intervention aspect",
  },
]

export const INTERVENTION_COLUMNS_DEFAULT = [
  "intervention_appeal",
  "intervention_medium",
  "intervention_aspect",
]

export const OUTCOME_COLUMNS = [
  {
    value: "outcome_label",
    label: "Outcome label",
  },
  {
    value: "outcome_category",
    label: "Outcome type",
  },
  {
    value: "outcome_subcategory",
    label: "Outcome subtype",
  },
  {
    value: "outcome_measurement_type",
    label: "Outcome measure",
  },
]

export const OUTCOME_COLUMNS_DEFAULT = [
  "outcome_category",
  "outcome_subcategory",
  "outcome_measurement_type",
]

export const SAMPLE_COLUMNS = [
  {
    value: "sample_intervention_country",
    label: "Country",
  },
]

export const EFFECT_COLUMNS = [
  {
    value: "effect_size_value",
    label: "Effect size",
  },
  {
    value: "effect_control_n",
    label: "Cell size (control)",
  },
  {
    value: "effect_intervention_n",
    label: "Cell size (intervention)",
  },
]
