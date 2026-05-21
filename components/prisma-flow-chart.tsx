import { cn } from "@/lib/utils"

export type PrismaData = {
  identified_databases: number | null
  identified_other: number | null
  screened: number | null
  excluded_screening: number | null
  assessed: number | null
  excluded_eligibility: number | null
  excluded_eligibility_reasons?: { reason: string; n: number }[]
  included: number | null
}

function Stat({
  label,
  n,
  highlight,
}: {
  label: string
  n: number | null
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-4 py-3 text-sm space-y-0.5",
        highlight
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/40"
      )}
    >
      <p className="text-muted-foreground">{label}</p>
      <p className={cn("font-semibold", highlight && "text-primary")}>
        {n !== null ? `n = ${n.toLocaleString()}` : "n = —"}
      </p>
    </div>
  )
}

function ExcludedGroup({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border border-dashed border-border p-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">Excluded</p>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  )
}

export function PrismaFlowChart({ data }: { data: PrismaData }) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto text-sm">
      <div className="space-y-2">
        <SectionLabel>Step 1: Identification</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Stat label="Records identified via database searches" n={data.identified_databases} />
          <Stat label="Records identified via other methods" n={data.identified_other} />
        </div>
      </div>

      <div className="space-y-2">
        <SectionLabel>Step 2: Screening</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Stat label="Records screened" n={data.screened} />
          <ExcludedGroup>
            <Stat label="Records excluded" n={data.excluded_screening} />
          </ExcludedGroup>
        </div>
      </div>

      <div className="space-y-2">
        <SectionLabel>Step 3: Eligibility</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Stat label="Full-text articles assessed for eligibility" n={data.assessed} />
          <ExcludedGroup>
            <Stat label="Full-text articles excluded" n={data.excluded_eligibility} />
            {data.excluded_eligibility_reasons && data.excluded_eligibility_reasons.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-0.5 px-1">
                {data.excluded_eligibility_reasons.map((r) => (
                  <li key={r.reason} className="flex justify-between gap-2">
                    <span>{r.reason}</span>
                    <span className="font-medium shrink-0">n = {r.n}</span>
                  </li>
                ))}
              </ul>
            )}
          </ExcludedGroup>
        </div>
      </div>

      <div className="space-y-2">
        <SectionLabel>Step 4: Included</SectionLabel>
        <Stat label="Papers included in the database" n={data.included} highlight />
      </div>
    </div>
  )
}
