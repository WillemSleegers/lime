import studies from "@/assets/data/studies.json"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Datum } from "@/lib/types"
import { round } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

// Number of studies per paper, to only mention the study in multi-study papers
const studyCounts = studies.reduce((counts, study) => {
  counts.set(study.paper, (counts.get(study.paper) ?? 0) + 1)
  return counts
}, new Map<number, number>())

type EffectDialogProps = {
  effect: Datum
}

export const EffectDialogContent = ({ effect }: EffectDialogProps) => {
  // A control with the intervention's own condition is that group's pre-test
  const controlIsPreTest =
    effect.control_condition === effect.intervention_condition
  const studyCount = studyCounts.get(effect.paper) ?? 1

  return (
    <div className="space-y-6">
      <DialogHeader className="pr-8 text-left">
        <DialogTitle>
          {effect.paper_label}, effect {effect.effect}
        </DialogTitle>
        <DialogDescription>{capitalize(effect.outcome_label)}</DialogDescription>
      </DialogHeader>

      <div className="grid items-center gap-x-6 gap-y-4 rounded-lg bg-muted p-5 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Effect size</div>
          <div className="text-4xl font-semibold leading-none tracking-tight">
            {effect.effect_size != null
              ? formatNumber(effect.effect_size)
              : "Not available"}
          </div>
          {effect.effect_size != null && (
            <div className="text-sm text-muted-foreground">
              95% CI [{formatNumber(effect.effect_size_lower)},{" "}
              {formatNumber(effect.effect_size_upper)}]
            </div>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-sm leading-relaxed">
            A positive value means{" "}
            {controlIsPreTest
              ? "participants scored"
              : "the intervention group scored"}{" "}
            {effect.outcome_expectation === "decrease" ? "lower" : "higher"}{" "}
            {controlIsPreTest
              ? "after the intervention than before"
              : "than the control"}{" "}
            on this outcome ({effect.outcome_label}).
          </p>
          {effect.effect_size != null && (
            <IntervalBar
              value={effect.effect_size}
              lower={effect.effect_size_lower}
              upper={effect.effect_size_upper}
            />
          )}
          <div className="text-xs text-muted-foreground">
            {effectSizeNames[effect.effect_size_name] ?? effect.effect_size_name}
          </div>
        </div>
      </div>

      <div className="divide-y rounded-lg border">
        <Group
          title="Intervention"
          aside={sampleSize(
            effect.intervention_sample_n,
            effect.intervention_sample_description
          )}
          tags={[effect.intervention_mechanism, effect.intervention_medium]}
        >
          {effect.intervention_description}
        </Group>
        <Group
          title="Control"
          aside={sampleSize(
            effect.control_sample_n,
            effect.control_sample_description
          )}
        >
          {effect.control_description || (
            <span className="italic">
              {controlIsPreTest
                ? "The same group, measured before the intervention."
                : "No description available."}
            </span>
          )}
        </Group>
        <Group
          title="Outcome"
          tags={[
            effect.outcome_category.replace(/ - (.+)/, " ($1)"),
            effect.outcome_measurement_type,
          ]}
        >
          {effect.outcome_description}
        </Group>
      </div>

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Fact label="Design">
          {studyDesigns[effect.study_design] ?? effect.study_design}
        </Fact>
        <Fact label="Randomized">{capitalize(effect.study_randomization)}</Fact>
        <Fact label="Preregistered">
          {capitalize(effect.study_preregistered)}
        </Fact>
        <Fact label="Data available">
          {capitalize(effect.study_data_available)}
        </Fact>
        <Fact label="Participants">{effect.study_n}</Fact>
        <Fact label="Recruited via">
          {capitalize(
            effect.sample_type
              .split(", ")
              .map((type) => sampleTypes[type] ?? type)
              .join(", ")
          )}
        </Fact>
        <Fact label="Country">{effect.sample_country}</Fact>
        {studyCount > 1 && (
          <Fact label="Study">
            {effect.study} of {studyCount}
          </Fact>
        )}
      </dl>

      <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm leading-relaxed text-foreground/80">
          {formatAuthors(effect.paper_authors)} ({effect.paper_year}).{" "}
          {withPeriod(effect.paper_title)}{" "}
          {effect.paper_source && <i>{withPeriod(effect.paper_source)}</i>}{" "}
          {openAccessLabels[effect.paper_open_access] && (
            <span className="text-muted-foreground">
              {openAccessLabels[effect.paper_open_access]}
            </span>
          )}
        </p>
        {effect.paper_link && (
          <Button asChild variant="outline" size="sm" className="self-start">
            <Link href={effect.paper_link} target="_blank">
              Open paper
              <ArrowUpRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

const formatNumber = (value: number) =>
  round(value, 2).toFixed(2).replace("-", "−")

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const withPeriod = (text: string) => (/[.?!]$/.test(text) ? text : text + ".")

// APA style: "A, B., C, D., & E, F."
const formatAuthors = (authors: string) => {
  const names = authors.split("; ")
  if (names.length === 1) return names[0]
  return names.slice(0, -1).join(", ") + ", & " + names[names.length - 1]
}

const effectSizeNames: Record<string, string> = {
  SMD: "Standardized mean difference (Hedges' g)",
  g: "Standardized mean difference (Hedges' g)",
  OR2DL: "Log odds ratio, converted to a standardized mean difference",
  "OR2DL DiD":
    "Difference-in-differences in log odds, converted to a standardized mean difference",
  SMCC: "Standardized mean change",
  "SMD DiD": "Difference-in-differences, as a standardized mean difference",
}

const studyDesigns: Record<string, string> = {
  between: "Between-subjects",
  within: "Within-subjects",
  mixed: "Mixed",
  crossover: "Crossover",
}

const sampleTypes: Record<string, string> = {
  public: "general public",
  university: "university",
  panel: "online panel",
  children: "children",
}

const openAccessLabels: Record<string, string> = {
  "open access": "Open access.",
  paywalled: "Paywalled.",
}

const sampleSize = (n?: number | null, description?: string | null) =>
  n != null ? `n = ${n}${description ? ` (${description})` : ""}` : null

// The effect and its CI on a symmetric scale around zero
const IntervalBar = ({
  value,
  lower,
  upper,
}: {
  value: number
  lower: number
  upper: number
}) => {
  const max = Math.max(1, Math.ceil(Math.max(Math.abs(lower), Math.abs(upper))))
  const position = (x: number) => `${((x + max) / (2 * max)) * 100}%`

  return (
    <div aria-hidden="true" className="space-y-1">
      <div className="relative h-5">
        <div className="absolute inset-x-0 top-2.5 h-px bg-border" />
        <div className="absolute top-0.5 left-1/2 h-4 w-px bg-muted-foreground/60" />
        <div
          className="absolute top-[9px] h-[3px] rounded-full bg-primary"
          style={{
            left: position(lower),
            width: `calc(${position(upper)} - ${position(lower)})`,
          }}
        />
        <div
          className="absolute top-[5px] -ml-[5.5px] size-[11px] rounded-full border-2 border-muted bg-primary"
          style={{ left: position(value) }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>−{max}</span>
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

const Group = ({
  title,
  aside,
  tags = [],
  children,
}: {
  title: string
  aside?: string | null
  tags?: (string | null | undefined)[]
  children: ReactNode
}) => {
  const tagValues = tags.flatMap((tag) => (tag ? tag.split(", ") : []))

  return (
    <section className="space-y-2 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
      </div>
      <p className="text-sm leading-relaxed text-foreground/80">{children}</p>
      {tagValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {tagValues.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full font-normal text-foreground/80"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </section>
  )
}

const Fact = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-0.5">
    <dt className="text-xs text-muted-foreground">{label}</dt>
    <dd className="text-sm">{children}</dd>
  </div>
)
