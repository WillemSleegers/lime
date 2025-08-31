import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"

import { customSort } from "@/lib/utils"

const NA_OPTIONS = ["none", "N/A"]

// Paper-level
export const PAPER_TYPE_OPTIONS = [
  {
    value: "peer reviewed paper",
    label: "Peer reviewed paper (journal articles, conference papers)",
  },
  {
    value: "preprint",
    label: "Preprint (early drafts, not yet peer-reviewed)",
  },
  {
    value: "thesis",
    label: "Thesis (student research)",
  },
  {
    value: "report",
    label: "Report (government, institutional publications)",
  },
]

export const PAPER_OPEN_ACCESS_OPTIONS = [
  {
    value: "paywalled",
    label: "Paywalled (paid access required)",
  },
  {
    value: "open access",
    label: "Open access (free to read)",
  },
]

// Study-level
export const STUDY_PREREGISTERED_OPTIONS = [
  {
    value: "yes",
    label: "Preregistered (study design registered before data collection)",
  },
  { value: "no", label: "Not preregistered" },
]

export const STUDY_DATA_AVAILABLE_OPTIONS = [
  {
    value: "yes",
    label: "Data available (study datasets can be downloaded)",
  },
  { value: "no", label: "Data not available" },
]

export const STUDY_DESIGN_OPTIONS = [
  {
    value: "between",
    label: "Between-subjects (different participants per condition)",
  },
  {
    value: "within",
    label: "Within-subjects (same participants across conditions)",
  },
  {
    value: "mixed",
    label: "Mixed design (combines between and within elements)",
  },
  {
    value: "crossover",
    label: "Cross-over (participants receive all treatments in sequence)",
  },
]

export const STUDY_CONDITION_ASSIGNMENT_OPTIONS = [
  {
    value: "individual",
    label: "Individual assignment (participants assigned to conditions)",
  },
  {
    value: "cluster",
    label: "Cluster assignment (groups assigned to conditions)",
  },
  {
    value: "time point",
    label: "Time-based assignment (conditions assigned to time periods)",
  },
]

export const STUDY_RANDOMIZATION_OPTIONS = [
  {
    value: "yes",
    label: "Randomized assignment (eliminates selection bias)",
  },
  {
    value: "no",
    label: "Non-randomized assignment (potential for confounding)",
  },
]

// Intervention-level
export const INTERVENTION_CONTENT_OPTIONS = customSort(
  [
    ...new Set(
      interventions
        .map((datum) => datum.intervention_content)
        .flatMap((str) => str.split(", ").map((s) => s))
    ),
  ],
  NA_OPTIONS
)
export const INTERVENTION_MECHANISM_OPTIONS = customSort([
  ...new Set(
    interventions
      .map((datum) => datum.intervention_mechanism)
      .flatMap((str) => str.split(",").map((s) => s.trim()))
  ),
])
export const INTERVENTION_MEDIUM_OPTIONS = customSort([
  ...new Set(
    interventions
      .map((datum) => datum.intervention_medium)
      .flatMap((str) => str.split(",").map((s) => s.trim()))
  ),
])
export const COUNTRY_OPTIONS = customSort(
  [
    ...new Set(
      interventions
        .map((datum) => datum.sample_country)
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
export const OUTCOME_MEASUREMENT_TYPE_OPTIONS = customSort([
  ...new Set(outcomes.map((datum) => datum.outcome_measurement_type)),
])
