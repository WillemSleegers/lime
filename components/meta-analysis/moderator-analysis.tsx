"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { WebR } from "webr"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  runBinaryModeratorAnalysis,
  runFactorModeratorAnalysis,
  runPerLevelModeratorAnalysis,
} from "@/lib/r-functions"
import { round } from "@/lib/utils"
import { Data, ModeratorLevel, ModeratorResult, Status } from "@/lib/types"
import { MODERATOR_VARIABLES } from "@/constants/constants-meta-analysis"

/**
 * Split a comma-joined moderator cell into its constituent tokens. Single-value
 * columns produce a one-element array. Empty/missing cells produce an empty
 * array so they don't match any level.
 */
function moderatorTokens(value: unknown): string[] {
  if (value == null) return []
  const s = String(value).trim()
  if (!s) return []
  return s.split(", ").map((t) => t.trim()).filter(Boolean)
}

type ModeratorAnalysisProps = {
  data: Data
  webR: { current: WebR | null }
  status: Status
  result: ModeratorResult | undefined
  setResult: Dispatch<SetStateAction<ModeratorResult | undefined>>
}

export const ModeratorAnalysis = ({
  data,
  webR,
  status,
  result,
  setResult,
}: ModeratorAnalysisProps) => {
  const [selectedVar, setSelectedVar] = useState<string>("")
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedBinaryLevel, setSelectedBinaryLevel] = useState<string>("")
  const [singleOnly, setSingleOnly] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const selectedModerator = MODERATOR_VARIABLES.find(
    (v) => v.value === selectedVar,
  )
  const isBinary = !!selectedModerator?.binaryLevels
  const canRun =
    selectedVar !== "" &&
    (isBinary ? selectedBinaryLevel !== "" : selectedLevels.length >= 2) &&
    status === "Ready" &&
    !isRunning

  // Count rows for a given level label, using binary column lookup when
  // binaryLevels is defined, otherwise string-token matching.
  const matchingRowsForLevel = (
    moderator: (typeof MODERATOR_VARIABLES)[0],
    level: string,
  ) => {
    const base =
      singleOnly && moderator.multicomponentColumn
        ? data.filter(
            (datum) =>
              (datum as Record<string, unknown>)[moderator.multicomponentColumn!] === "no",
          )
        : data

    if (moderator.binaryLevels) {
      const binaryLevel = moderator.binaryLevels.find((b) => b.label === level)
      if (!binaryLevel) return []
      return base.filter(
        (datum) => (datum as Record<string, unknown>)[binaryLevel.column] === 1,
      )
    }
    return base.filter((datum) =>
      moderatorTokens(
        (datum as Record<string, unknown>)[moderator.value],
      ).includes(level),
    )
  }

  // Compute available levels with per-level k (effects) and paper counts.
  // Levels with fewer than 2 unique papers can't get a robust CI from
  // clubSandwich, so we mark them as un-fittable.
  const levelOptions = (() => {
    if (!selectedModerator) return []
    return selectedModerator.levels.flatMap((level) => {
      const matching = matchingRowsForLevel(selectedModerator, level)
      const k = matching.length
      if (k === 0) return []
      const papers = new Set(matching.map((d) => d.paper)).size
      return [{ value: level, k, papers, fittable: papers >= 2 }]
    })
  })()

  // Clear the binary selection if it's no longer in the available options
  // (e.g. after toggling singleOnly causes a level to drop out).
  useEffect(() => {
    if (
      selectedBinaryLevel &&
      !levelOptions.some((o) => o.value === selectedBinaryLevel)
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clearing a selection that fell out of the derived options list, not representable during render
      setSelectedBinaryLevel("")
    }
  }, [levelOptions, selectedBinaryLevel])

  // Reset selections when the variable changes.
  useEffect(() => {
    const moderator = MODERATOR_VARIABLES.find((v) => v.value === selectedVar)
    if (!moderator) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting selections in response to the chosen variable changing
      setSelectedLevels([])
      setSelectedBinaryLevel("")
      return
    }
    if (moderator.binaryLevels) {
      setSelectedBinaryLevel("")
      setSingleOnly(false)
    } else {
      setSelectedLevels(
        moderator.levels.filter((level) => {
          const matching = matchingRowsForLevel(moderator, level)
          return new Set(matching.map((d) => d.paper)).size >= 2
        }),
      )
    }
    setResult(undefined)
    setError(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVar, data, setResult])

  const handleRun = async () => {
    if (!webR.current || !selectedModerator) return

    setIsRunning(true)
    setError(undefined)
    setResult(undefined)

    try {
      const moderatorVar = selectedModerator.value
      const selectedSet = new Set(selectedLevels)

      if (selectedModerator.binaryLevels) {
        // Binary indicator path: one level, two predicted means (absent/present)
        const binaryLevel = selectedModerator.binaryLevels.find(
          (b) => b.label === selectedBinaryLevel,
        )
        if (!binaryLevel) return

        const subset = data
          .filter((datum) => {
            if (datum.effect_size == null || datum.effect_size_var == null) return false
            if (singleOnly && selectedModerator.multicomponentColumn) {
              return (datum as Record<string, unknown>)[selectedModerator.multicomponentColumn] === "no"
            }
            return true
          })
          .map((datum) => ({
            effect_size: datum.effect_size,
            effect_size_var: datum.effect_size_var,
            paper_study: datum.paper_study,
            paper: datum.paper,
            study: datum.study,
            outcome: datum.outcome,
            intervention_key: datum.intervention_key,
            control_key: datum.control_key,
            [binaryLevel.column]: Number(
              (datum as Record<string, unknown>)[binaryLevel.column],
            ),
          }))

        if (subset.length === 0) {
          setError("No effects match the inclusion criteria.")
          return
        }

        const df = await new webR.current.RObject(subset)
        await webR.current.objs.globalEnv.bind("data", df)

        const res = await runBinaryModeratorAnalysis(webR.current, {
          label: binaryLevel.label,
          column: String(binaryLevel.column),
        })

        if (!Number.isFinite(res.presentEstimate)) {
          setError("Not enough data to fit a model for this mechanism.")
          return
        }

        setResult({
          levels: [
            {
              label: "Present",
              estimate: res.presentEstimate,
              lower: res.presentLower,
              upper: res.presentUpper,
              k: res.presentK,
            },
            {
              label: "Absent",
              estimate: res.absentEstimate,
              lower: res.absentLower,
              upper: res.absentUpper,
              k: res.absentK,
            },
          ],
          omnibus: { qm: res.qm, qmdf: 1, qmp: res.qmp },
        })
        return
      }

      // String-token path (multivalue) or factor path
      const subset = data
        .filter((datum) => {
          if (datum.effect_size == null || datum.effect_size_var == null) {
            return false
          }
          const tokens = moderatorTokens(
            (datum as Record<string, unknown>)[moderatorVar],
          )
          return tokens.some((t) => selectedSet.has(t))
        })
        .map((datum) => ({
          effect_size: datum.effect_size,
          effect_size_var: datum.effect_size_var,
          paper_study: datum.paper_study,
          paper: datum.paper,
          study: datum.study,
          outcome: datum.outcome,
          intervention_key: datum.intervention_key,
          control_key: datum.control_key,
          [moderatorVar]: String(
            (datum as Record<string, unknown>)[moderatorVar] ?? "",
          ),
        }))

      if (subset.length === 0) {
        setError("No effects match the selected levels.")
        return
      }

      const df = await new webR.current.RObject(subset)
      await webR.current.objs.globalEnv.bind("data", df)

      if (selectedModerator.multivalue) {
        const perLevel = await runPerLevelModeratorAnalysis(
          webR.current,
          moderatorVar,
          selectedLevels,
        )
        const moderatorLevels: ModeratorLevel[] = perLevel
          .filter((r) => Number.isFinite(r.estimate))
          .map((r) => ({
            label: r.level,
            estimate: r.estimate,
            lower: r.lower,
            upper: r.upper,
            pval: r.pval,
            k: r.k,
          }))
        if (moderatorLevels.length < 2) {
          setError(
            moderatorLevels.length === 0
              ? "No level had enough data to fit a model."
              : "Only one level could be estimated. At least two are needed to compare.",
          )
          return
        }
        setResult({ levels: moderatorLevels })
      } else {
        const res = await runFactorModeratorAnalysis(webR.current, moderatorVar)
        if (res.levels.length < 2) {
          setError(
            res.levels.length === 0
              ? "No levels remain after filtering. Try selecting more levels."
              : "Only one level remains after filtering. At least two levels are needed for a moderation test.",
          )
          return
        }
        const moderatorLevels: ModeratorLevel[] = res.levels.map((label, i) => ({
          label,
          estimate: res.estimates[i],
          lower: res.ciLower[i],
          upper: res.ciUpper[i],
          pval: res.pvals[i],
          k: res.k[i],
        }))
        setResult({
          levels: moderatorLevels,
          omnibus: { qm: res.qm, qmdf: res.qmdf, qmp: res.qmp },
        })
      }
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

          {/* Single-component switch */}
          {selectedModerator?.multicomponentColumn && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Switch
                  id="single-only"
                  checked={singleOnly}
                  onCheckedChange={setSingleOnly}
                  disabled={!selectedVar}
                />
                <Label htmlFor="single-only">
                  Exclude multi-{(selectedModerator.levelLabel ?? "level").toLowerCase()} interventions
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Some interventions combine multiple {(selectedModerator.levelLabel ?? "level").toLowerCase()}s, making it hard to attribute the effect to any single one. Turn this on to restrict the analysis to interventions that use only one {(selectedModerator.levelLabel ?? "level").toLowerCase()}.
              </p>
            </div>
          )}

          {/* Level selector: single-select for binary moderators, multi-select otherwise */}
          {isBinary ? (
            <div className="space-y-1.5">
              <Label className={!selectedVar ? "text-muted-foreground" : ""}>
                {selectedModerator?.levelLabel ?? "Level"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {!selectedVar
                  ? "Select a moderator variable to see available levels."
                  : `Select a ${(selectedModerator?.levelLabel ?? "level").toLowerCase()} to compare effects between interventions that use it and those that don't. Counts show the number of effects where the ${(selectedModerator?.levelLabel ?? "level").toLowerCase()} is present. Grayed out options don't have enough data to fit a model.`}
              </p>
              <Select
                value={selectedBinaryLevel}
                onValueChange={setSelectedBinaryLevel}
                disabled={!selectedVar}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a level…" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      disabled={!o.fittable}
                    >
                      {o.value} ({o.k})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className={!selectedVar ? "text-muted-foreground" : ""}>
                Levels to include
              </Label>
              <p className="text-sm text-muted-foreground">
                {!selectedVar
                  ? "Select a moderator variable to see available levels."
                  : "Deselect levels to exclude them from the analysis. Counts show the number of effects per level. Grayed out levels don't have enough data to fit a model."}
              </p>
              <MultiSelect
                values={selectedLevels}
                onValuesChange={setSelectedLevels}
              >
                <MultiSelectTrigger
                  className="w-full bg-card"
                  disabled={!selectedVar}
                >
                  <MultiSelectValue placeholder="Select levels…" />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {levelOptions.map((o) => (
                      <MultiSelectItem
                        key={o.value}
                        value={o.value}
                        badgeLabel={o.value}
                        disabled={!o.fittable}
                      >
                        <span className="flex-1">
                          {o.value} ({o.k})
                        </span>
                        {!o.fittable && (
                          <span
                            className="text-xs text-muted-foreground"
                            title="At least 2 unique papers are needed to fit a robust meta-analysis for this level."
                          >
                            too few papers
                          </span>
                        )}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectGroup>
                </MultiSelectContent>
              </MultiSelect>
            </div>
          )}

          {/* Run button */}
          <Button
            onClick={handleRun}
            disabled={!canRun}
            className="w-fit h-auto"
          >
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
  const { levels, omnibus } = result
  const showPval = levels.some((l) => l.pval != null)

  const pLabel = (p: number) => {
    if (p < 0.001) return "< .001"
    return String(round(p, 3))
  }

  return (
    <div className="space-y-4">
      {/* Omnibus test (single-value moderators only) */}
      {omnibus ? (
        <p className="text-sm text-muted-foreground">
          Omnibus test of moderation: QM(df={omnibus.qmdf}) ={" "}
          {round(omnibus.qm, 2)}, p{" "}
          {omnibus.qmp < 0.001 ? "< .001" : `= ${round(omnibus.qmp, 3)}`}.{" "}
          {omnibus.qmp < 0.05
            ? "Effects differ significantly across levels of this variable."
            : "No significant difference in effects across levels."}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Each level was meta-analyzed separately because rows can belong to
          more than one level of this variable. Compare the per-level estimates
          and confidence intervals below.
        </p>
      )}

      {/* Chart */}
      <ModeratorChart levels={levels} />

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Level</TableHead>
            <TableHead className="text-right">k</TableHead>
            <TableHead className="text-right">d</TableHead>
            <TableHead className="text-right">95% CI</TableHead>
            {showPval && <TableHead className="text-right">p</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {levels.map((level) => (
            <TableRow key={level.label}>
              <TableCell>{level.label}</TableCell>
              <TableCell className="text-right tabular-nums">{level.k}</TableCell>
              <TableCell className="text-right tabular-nums font-medium">
                {round(level.estimate, 2)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                [{round(level.lower, 2)}, {round(level.upper, 2)}]
              </TableCell>
              {showPval && (
                <TableCell className="text-right tabular-nums">
                  {level.pval != null ? pLabel(level.pval) : "—"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
