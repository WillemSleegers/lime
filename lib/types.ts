import data from "@/assets/data/data.json"
import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import outcomes from "@/assets/data/outcomes.json"
import interventions from "@/assets/data/interventions.json"
import effects from "@/assets/data/effects.json"
import samples from "@/assets/data/samples.json"

export type Data = typeof data
export type Datum = (typeof data)[0]
export type DataKeys = keyof Data[0]

export type Papers = typeof papers
export type Paper = (typeof papers)[0]
export type PapersKeys = keyof Papers[0]

export type Studies = typeof studies
export type Study = (typeof studies)[0]
export type StudiesKeys = keyof Studies[0]

export type Samples = typeof samples
export type Sample = (typeof samples)[0]
export type SamplesKeys = keyof Samples[0]

export type Outcomes = typeof outcomes
export type Outcome = (typeof outcomes)[0]
export type OutcomesKeys = keyof Outcomes[0]

export type Interventions = typeof interventions
export type Intervention = (typeof interventions)[0]
export type InterventionsKeys = keyof Interventions[0]

export type Effects = typeof effects
export type Effect = (typeof effects)[0] // Fix name later
export type EffectsKeys = keyof Effects[0]

export type Locks = {
  paper: boolean
  study: boolean
  sample: boolean
  intervention: boolean
  outcome: boolean
  effect: boolean
}

export type Estimate = {
  value: number
  lower: number
  upper: number
  piLower: number
  piUpper: number
}

export type Egger = {
  egger_b: number
  egger_se: number
  egger_z: number
  egger_p: number
}

export type Heterogeneity = {
  q: number
  qDf: number
  qp: number
  i2Paper: number
  i2Study: number
  i2Outcome: number
  i2Total: number
  tau2Paper: number
  tau2Study: number
  tau2Outcome: number
}

export type Status =
  | "Loading webR..."
  | "Installing packages..."
  | "Running meta-analysis..."
  | "Ready"

export type ModeratorLevel = {
  label: string
  estimate: number
  lower: number
  upper: number
  pval: number
  k: number
}

export type ModeratorResult = {
  levels: ModeratorLevel[]
  // Omnibus test is only meaningful for single-value moderators (joint factor
  // model). For multi-value moderators we fit one model per level, so there is
  // no joint test to report.
  omnibus?: {
    qm: number
    qmdf: number
    qmp: number
  }
}
