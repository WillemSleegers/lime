import { round } from "@/lib/utils"
import { LinkIcon } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

type EffectDialogProps = {
  effect: any
}

export const EffectDialogContent = ({ effect }: EffectDialogProps) => {
  return (
    <div className="space-y-4">
      {/* Paper Section */}
      <Section
        title="Paper"
        hasLink={!!effect.paper_link}
        linkHref={effect.paper_link}
      >
        <LabelValue label="Title" value={effect.paper_title} />
        <LabelValue label="Authors" value={effect.paper_authors} />
        <LabelValue label="Study" value={effect.study} />
      </Section>

      {/* Intervention Section */}
      <Section title="Intervention">
        <div className="text-sm text-muted-foreground">
          {effect.intervention_description}
        </div>
      </Section>

      {/* Outcome Section */}
      <Section title="Outcome">
        <div className="text-sm text-muted-foreground">
          {effect.outcome_description}
        </div>
      </Section>

      {/* Effect Section */}
      <Section title="Effect">
        <LabelValue
          label="Type of effect size"
          value={effect.effect_size_name}
        />
        <LabelValue
          label="Value (with 95% CI)"
          value={formatEffectSize(
            effect.effect_size,
            effect.effect_size_lower,
            effect.effect_size_upper
          )}
        />
      </Section>
    </div>
  )
}

type SectionProps = {
  title: string
  children?: ReactNode
  hasLink?: boolean
  linkHref?: string
}

const Section = ({ title, children, hasLink, linkHref }: SectionProps) => (
  <div className="space-y-2">
    <div className="border-b flex items-center gap-2 justify-between">
      <span className="text-lg font-semibold">{title}</span>
      {hasLink && linkHref && (
        <Link href={linkHref} target="_blank">
          <LinkIcon width={14} height={14} />
        </Link>
      )}
    </div>
    {children}
  </div>
)

type LabelValueProps = {
  label: string
  value: string
  labelSize?: string
}

const LabelValue = ({ label, value, labelSize = "base" }: LabelValueProps) => (
  <div>
    <div className={`text-${labelSize} font-semibold`}>{label}</div>
    <div className="text-sm text-muted-foreground">{value}</div>
  </div>
)

const formatEffectSize = (value: number, lower: number, upper: number) => {
  return `${round(value, 2)} [${round(lower, 2)}, ${round(upper, 2)}]`
}
