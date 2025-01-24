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
    label: "Sample size (control)",
  },
  {
    value: "effect_intervention_n",
    label: "Sample size (intervention)",
  },
]

export const META_ANALYSIS_DEFAULTS = {
  outcomes: [
    "meat consumption",
    "animal product consumption",
    "egg consumption",
    "dairy consumption",
    "vegetarian consumption",
    "diet",
    "signing a petition",
    "meat consumption intentions",
    "diet intentions",
    "purchasing intentions",
    "animal product intentions",
    "vegetarian consumption intentions",
  ],
  measurement_type: ["survey", "food diary"],
  intervention_aspect: ["animal welfare", "health", "environment"],
  intervention_medium: ["text", "presentation", "video", "3D video", "image"],
  intervention_appeal: [
    "factual",
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
}
