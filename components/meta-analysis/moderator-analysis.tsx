"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { WebR } from "webr"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

import { ModeratorChart } from "@/components/meta-analysis/charts/moderator-chart"
import { runModeratorAnalysis } from "@/lib/r-functions"
import { round } from "@/lib/utils"
import { Data, ModeratorLevel, ModeratorResult, Status } from "@/lib/types"
import { MODERATOR_VARIABLES } from "@/constants/constants-meta-analysis"

type ModeratorAnalysisProps = {
  data: Data
  webR: { current: WebR | null }
  status: Status
  result: ModeratorResult | undefined
  setResult: Dispatch<SetStateAction<ModeratorResult | undefined>>
}

export const ModeratorAnalysis = ({ data, webR, status, result, setResult }: ModeratorAnalysisProps) => {
  const [selectedVar, setSelectedVar] = useState<string>("")
  const [singleValueOnly, setSingleValueOnly] = useState(true)
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const selectedModerator = MODERATOR_VARIABLES.find((v) => v.value === selectedVar)
  const isMultiValue = selectedModerator?.isMultiValue ?? false
  const canRun = selectedVar !== "" && selectedLevels.length >= 2 && status === "Ready" && !isRunning

  // Compute available levels with counts from data (counts reflect singleValueOnly filter)
  const levelOptions = (() => {
    if (!selectedVar) return []
    const counts = new Map<string, number>()
    data.forEach((datum) => {
      const val = String((datum as Record<string, unknown>)[selectedVar] ?? "").trim()
      if (!val) return
      counts.set(val, (counts.get(val) ?? 0) + 1)
    })
    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, k]) => ({ value, label: `${value} (${k})` }))
  })()

  // Reset selected levels only when the variable changes, not when singleValueOnly changes
  useEffect(() => {
    if (!selectedVar) {
      setSelectedLevels([])
      return
    }
    const counts = new Map<string, number>()
    data.forEach((datum) => {
      const val = String((datum as Record<string, unknown>)[selectedVar] ?? "").trim()
      if (!val) return
      counts.set(val, (counts.get(val) ?? 0) + 1)
    })
    setSelectedLevels(Array.from(counts.keys()).sort((a, b) => a.localeCompare(b)))
    setResult(undefined)
    setError(undefined)
  }, [selectedVar, data])

  const handleRun = async () => {
    if (!webR.current || !selectedVar) return

    setIsRunning(true)
    setError(undefined)
    setResult(undefined)

    try {
      // Bind data with moderator column included
      const subset = data
        .filter((datum) => datum.effect_size != null && datum.effect_size_var != null)
        .map((datum) => ({
          effect_size: datum.effect_size,
          effect_size_var: datum.effect_size_var,
          paper_study: datum.paper_study,
          paper: datum.paper,
          study: datum.study,
          outcome: datum.outcome,
          intervention_key: datum.intervention_key,
          control_key: datum.control_key,
          [selectedVar]: (datum as Record<string, unknown>)[selectedVar],
        }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const df = await new webR.current.RObject(subset as any)
      await webR.current.objs.globalEnv.bind("data", df)

      const { levels, numbers } = await runModeratorAnalysis(
        webR.current,
        selectedVar,
        singleValueOnly,
        selectedLevels,
      )

      if (levels.length < 2) {
        setError(
          levels.length === 0
            ? `No levels remain after filtering. Try selecting more levels or disabling single-value only.`
            : `Only one level remains after filtering. At least two levels are needed for a moderation test.`,
        )
        return
      }

      const n = levels.length
      const moderatorLevels: ModeratorLevel[] = levels.map((label, i) => ({
        label,
        estimate: numbers[i],
        lower: numbers[n + i],
        upper: numbers[2 * n + i],
        pval: numbers[3 * n + i],
        k: numbers[4 * n + i],
      }))

      setResult({
        levels: moderatorLevels,
        qm: numbers[5 * n],
        qmdf: numbers[5 * n + 1],
        qmp: numbers[5 * n + 2],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-subsection-title">Moderator Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Test whether effects differ across levels of a variable. Select a
          factor below to run a separate meta-analysis per level and compare
          them with an omnibus test.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-5">
          {/* Variable selector */}
          <div className="space-y-1.5">
            <Label>Moderator</Label>
            <Select value={selectedVar} onValueChange={setSelectedVar}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a variable…" />
              </SelectTrigger>
              <SelectContent>
                {MODERATOR_VARIABLES.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Levels multi-select */}
          <div className="space-y-1.5">
            <Label className={!selectedVar ? "text-muted-foreground" : ""}>
              Levels to include
            </Label>
            <p className="text-sm text-muted-foreground">
              {!selectedVar
                ? "Select a moderator variable to see available levels."
                : "Deselect levels to exclude them from the analysis. Counts show the number of effects per level."}
            </p>
            <MultiSelect
              values={selectedLevels}
              onValuesChange={setSelectedLevels}
            >
              <MultiSelectTrigger className="w-full bg-card" disabled={!selectedVar}>
                <MultiSelectValue placeholder="Select levels…" />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {levelOptions.map((o) => (
                    <MultiSelectItem key={o.value} value={o.value}>
                      {o.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>

          {/* Single-value only toggle */}
          <div className="space-y-1.5">
            <Label htmlFor="single-value-only" className={(!selectedVar || !isMultiValue) ? "text-muted-foreground" : ""}>
              Only effects with a single coded value
            </Label>
            <p className="text-sm text-muted-foreground">
              {!selectedVar
                ? "Select a moderator variable to see options."
                : !isMultiValue
                  ? "Not applicable — this variable always has a single value per effect."
                  : singleValueOnly
                    ? `Only includes effects tagged with a single ${selectedModerator?.label.toLowerCase()} value. Effects tagged with multiple ${selectedModerator?.label.toLowerCase()} values are excluded.`
                    : `Includes all effects. Those coded under multiple categories (e.g. "animal welfare, health") are treated as a separate combined level, distinct from either single category.`}
            </p>
            <Switch
              id="single-value-only"
              checked={singleValueOnly}
              onCheckedChange={setSingleValueOnly}
              disabled={!selectedVar || !isMultiValue}
            />
          </div>

          {/* Run button */}
          <Button onClick={handleRun} disabled={!canRun} className="w-fit h-auto">
            {isRunning ? (
              <>
                <Spinner className="size-4 mr-2" />
                Running…
              </>
            ) : (
              "Run analysis"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Card>
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && <ModeratorResults result={result} />}
    </div>
  )
}

const ModeratorResults = ({ result }: { result: ModeratorResult }) => {
  const { levels, qm, qmdf, qmp } = result

  const pLabel = (p: number) => {
    if (p < 0.001) return "< .001"
    return String(round(p, 3))
  }

  return (
    <div className="space-y-4">
      {/* Omnibus test */}
      <p className="text-sm text-muted-foreground">
        Omnibus test of moderation: QM(df={qmdf}) = {round(qm, 2)}, p{" "}
        {qmp < 0.001 ? "< .001" : `= ${round(qmp, 3)}`}.{" "}
        {qmp < 0.05
          ? "Effects differ significantly across levels of this variable."
          : "No significant difference in effects across levels."}
      </p>

      {/* Chart */}
      <ModeratorChart levels={levels} />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2 pr-4 font-medium">Level</th>
              <th className="text-right py-2 px-4 font-medium">k</th>
              <th className="text-right py-2 px-4 font-medium">d</th>
              <th className="text-right py-2 px-4 font-medium">95% CI</th>
              <th className="text-right py-2 pl-4 font-medium">p</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr key={level.label} className="border-b last:border-0">
                <td className="py-2 pr-4">{level.label}</td>
                <td className="text-right py-2 px-4 tabular-nums">{level.k}</td>
                <td className="text-right py-2 px-4 tabular-nums font-medium">
                  {round(level.estimate, 2)}
                </td>
                <td className="text-right py-2 px-4 tabular-nums text-muted-foreground">
                  [{round(level.lower, 2)}, {round(level.upper, 2)}]
                </td>
                <td className="text-right py-2 pl-4 tabular-nums">
                  {pLabel(level.pval)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
