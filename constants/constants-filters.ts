import samples from "@/assets/data/samples.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"

import { customSort } from "@/lib/utils"

const NA_OPTIONS = ["none", "N/A"]

// Paper-level
export const PAPER_TYPE_OPTIONS = [
  {
    value: "peer reviewed paper",
    label: "Peer reviewed paper",
    description: "Journal articles and conference papers",
  },
  {
    value: "preprint",
    label: "Preprint",
    description: "Publications that are not yet peer-reviewed",
  },
  {
    value: "thesis",
    label: "Thesis",
    description: "Student research",
  },
  {
    value: "report",
    label: "Report",
    description: "Government and institutional publications",
  },
]

export const PAPER_OPEN_ACCESS_OPTIONS = [
  {
    value: "paywalled",
    label: "Paywalled",
    description: "Paid access required",
  },
  {
    value: "open access",
    label: "Open access",
    description: "Free to read",
  },
]

// Study-level
export const STUDY_PREREGISTERED_OPTIONS = [
  {
    value: "yes",
    label: "Preregistered",
    description: "Study design registered before data collection",
  },
  { value: "no", label: "Not preregistered" },
]

export const STUDY_DATA_AVAILABLE_OPTIONS = [
  {
    value: "yes",
    label: "Data available",
    description: "Study datasets can be downloaded",
  },
  { value: "no", label: "Data not available" },
]

export const STUDY_DESIGN_OPTIONS = [
  {
    value: "between",
    label: "Between-subjects",
    description: "Different participants per condition",
  },
  {
    value: "within",
    label: "Within-subjects",
    description: "Same participants across conditions",
  },
  {
    value: "mixed",
    label: "Mixed design",
    description: "Combines between and within elements",
  },
  {
    value: "crossover",
    label: "Crossover",
    description: "Participants rotate through conditions in different orders",
  },
]

export const STUDY_CONDITION_ASSIGNMENT_OPTIONS = [
  {
    value: "individual",
    label: "Individual assignment",
    description: "Participants assigned to conditions",
  },
  {
    value: "cluster",
    label: "Cluster assignment",
    description: "Groups assigned to conditions",
  },
  {
    value: "time point",
    label: "Time-based assignment",
    description: "Conditions assigned to time periods",
  },
]

export const STUDY_RANDOMIZATION_OPTIONS = [
  {
    value: "yes",
    label: "Randomized assignment",
    description: "Eliminates selection bias",
  },
  {
    value: "no",
    label: "Non-randomized assignment",
    description: "Potential for confounding",
  },
]

// Sample-level
export const SAMPLE_COUNTRY_OPTIONS = customSort(
  [
    ...new Set(
      samples
        .map((datum) => datum.sample_country)
        .filter((str): str is string => str !== undefined)
    ),
  ],
  NA_OPTIONS
)

export const SAMPLE_TYPE_OPTIONS = [
  { value: "children", label: "Children", description: "Samples consisting of children or minors" },
  { value: "public", label: "Public", description: "General public samples recruited through various channels" },
  { value: "panel", label: "Panel", description: "Pre-recruited panels of participants (e.g., online panels, community panels)" },
  { value: "university", label: "University", description: "University students or staff recruited from academic institutions" },
]

export const SAMPLE_REPRESENTATIVE_OPTIONS = [
  {
    value: "yes",
    label: "Representative",
    description: "Efforts were made to recruit a representative sample of the population",
  },
  {
    value: "no",
    label: "Not representative",
    description: "",
  },
]

// Intervention-level
export const INTERVENTION_MULTICOMPONENT_OPTIONS = [
  {
    value: "no",
    label: "Single-component",
    description: "Intervention uses one strategy or content focus",
  },
  {
    value: "yes",
    label: "Multicomponent",
    description: "Intervention combines multiple strategies or content areas",
  },
]

export const INTERVENTION_CONTENT_OPTIONS = customSort(
  [
    ...new Set(
      interventions
        .map((datum) => datum.intervention_content)
        .filter((str): str is string => str !== undefined)
        .flatMap((str) => str.split(", ").map((s) => s))
    ),
  ],
  NA_OPTIONS
)
export const INTERVENTION_MECHANISM_OPTIONS = customSort([
  ...new Set(
    interventions
      .map((datum) => datum.intervention_mechanism)
      .filter((str): str is string => str !== undefined)
      .flatMap((str) => str.split(",").map((s) => s.trim()))
  ),
])
export const INTERVENTION_MEDIUM_OPTIONS = customSort([
  ...new Set(
    interventions
      .map((datum) => datum.intervention_medium)
      .filter((str): str is string => str !== undefined)
      .flatMap((str) => str.split(",").map((s) => s.trim()))
  ),
])
export const COUNTRY_OPTIONS = customSort(
  [
    ...new Set(
      interventions
        .map((datum) => datum.sample_country)
        .filter((str): str is string => str !== undefined)
        .flatMap((str) => str.split(", ").map((s) => s.trim()))
    ),
  ],
  NA_OPTIONS
)

// Outcome level
export const OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS = customSort([
  ...new Set(
    outcomes
      .filter((datum) => datum.outcome_category === "behavior")
      .map((datum) => datum.outcome_subcategory)
  ),
])
export const OUTCOME_SUBCATEGORY_INTENTION_OPTIONS = customSort([
  ...new Set(
    outcomes
      .filter((datum) => datum.outcome_category === "intentions")
      .map((datum) => datum.outcome_subcategory)
  ),
])
export const OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS = customSort([
  ...new Set(
    outcomes
      .filter((datum) => datum.outcome_category === "attitudes/beliefs")
      .map((datum) => datum.outcome_subcategory)
  ),
])
export const OUTCOME_MEASUREMENT_TYPE_OPTIONS = [
  {
    value: "survey",
    label: "Survey",
    description: "Self-reported questionnaires and interviews",
  },
  {
    value: "food diary",
    label: "Food diary",
    description: "Participants record their food consumption",
  },
  {
    value: "sales data",
    label: "Sales data",
    description: "Purchase records from restaurants",
  },
  {
    value: "meal choice",
    label: "Meal choice",
    description: "Observed food selection in controlled settings",
  },
]

// Grouped outcome categories for unified MultiSelect
export const OUTCOME_CATEGORIES_GROUPED = [
  {
    group: "Behaviors",
    items: OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  },
  {
    group: "Intentions",
    items: OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  },
  {
    group: "Attitudes/beliefs",
    items: OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  },
]
