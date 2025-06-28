import { useState } from "react"
import { ChevronRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { HighlightLineChart } from "@/components/charts/highlights/highlight-line-chart"
import { HighlightRadialBarChart } from "@/components/charts/highlights/highlight-radial-bar-chart"

import { cn, round } from "@/lib/utils"
import {
  countUniqueFilteredValues,
  countUniqueValues,
  countUniqueValuesByGroup,
  mapToXYArray,
} from "@/lib/json-functions"
import { Data } from "@/lib/types"

type HighLightsProps = {
  data: Data
}

export const Highlights = (props: HighLightsProps) => {
  const { data } = props

  const [open, setOpen] = useState(false)

  const participantsCount = [
    ...data
      .reduce((map, { paper, study, study_n }) => {
        return map.set(`${paper}-${study}`, {
          paper,
          study,
          study_n,
        })
      }, new Map())
      .values(),
  ]
    .map((e) => e.study_n)
    .reduce((partialSum, a) => Math.round(partialSum) + a, 0)

  const studiesCount = [
    ...new Set(data.map((datum) => datum.paper + "-" + datum.study)),
  ].length

  const effectsCount = data.length
  const papersCount = countUniqueValues(data, "paper")
  const openAccessCount = countUniqueFilteredValues(
    data,
    "paper",
    "paper_open_access",
    "yes"
  )
  const preregistrationsCount = countUniqueFilteredValues(
    data,
    "paper_study",
    "study_preregistered",
    "yes"
  )
  const yearCounts = countUniqueValuesByGroup(data, "paper", "paper_year")

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Highlights</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="my-3 gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {/* Number of papers */}
          <Card className="grow col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {papersCount.toString()}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightLineChart chartData={mapToXYArray(yearCounts)} />
            </CardContent>
          </Card>
          {/* Number of studies */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {studiesCount.toString()}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of studies
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Number of effects */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">{effectsCount}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Number of observations */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {"~" + Math.round(participantsCount).toString()}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of observations
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Percentage of open access papers */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {openAccessCount.toString()}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Open access papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart
                percentage={round((openAccessCount / papersCount) * 100, 0)}
              />
            </CardContent>
          </Card>
          {/* Percentage of open access papers */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {preregistrationsCount.toString()}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Preregistered studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart
                percentage={round(
                  (preregistrationsCount / studiesCount) * 100,
                  0
                )}
              />
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
