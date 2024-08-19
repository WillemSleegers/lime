export const STUDY_COLUMNS = ["study"]
export const OUTCOME_COLUMNS = [
  "outcome_label",
  "outcome_category",
  "outcome_subcategory",
  "outcome_measurement_type",
]
export const INTERVENTION_COLUMNS = [
  "intervention_appeal",
  "intervention_medium",
  "intervention_aspect",
]
export const EFFECT_COLUMNS = ["effect_size_value"]

export const COLUMNS_DATA = [
  {
    value: "paper-info",
    label: "Paper-info",
    columns: [
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
    ],
  },
  {
    value: "study-info",
    label: "Study-info",
    columns: [
      {
        value: "study",
        label: "Study",
      },
    ],
  },
  {
    value: "intervention-info",
    label: "Intervention-info",
    columns: [
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
    ],
  },
  {
    value: "outcome-info",
    label: "Outcome-info",
    columns: [
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
    ],
  },

  {
    value: "effect-info",
    label: "Effect-info",
    columns: [
      {
        value: "effect_size_value",
        label: "Effect size",
      },
    ],
  },
]

export const DEFAULT_SELECTED_COLUMNS = [
  "paper_label",
  "paper_year",
  "paper_open_access",
  "paper_data_available",
  "study",
  "intervention_aspect",
  "intervention_medium",
  "intervention_appeal",
  "outcome_subcategory",
  "outcome_measurement_type",
]
