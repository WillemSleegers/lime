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
  data?: Data
}

export const Highlights = (props: HighLightsProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)

  let participantsCount
  let effectsCount
  let papersCount
  let studiesCount
  let openAccessCount
  let openAccessPercentage
  let preregistrationsCount
  let preregistrationPercentage
  let yearCounts
  let chartData

  if (data) {
    participantsCount = [
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

    studiesCount = [
      ...new Set(data.map((datum) => datum.paper + "-" + datum.study)),
    ].length

    effectsCount = data.length
    papersCount = countUniqueValues(data, "paper")
    openAccessCount = countUniqueFilteredValues(
      data,
      "paper",
      "paper_open_access",
      "yes"
    )
    openAccessPercentage = round((openAccessCount / papersCount) * 100, 0)
    preregistrationsCount = countUniqueFilteredValues(
      data,
      "paper_study",
      "study_preregistered",
      "yes"
    )
    preregistrationPercentage = round(
      (preregistrationsCount / studiesCount) * 100,
      0
    )
    yearCounts = countUniqueValuesByGroup(data, "paper", "paper_year")
    chartData = mapToXYArray(yearCounts)
  } else {
    openAccessPercentage = 0
    preregistrationPercentage = 0
  }

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
      <CollapsibleContent>
        <div className="my-3 gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {/* Number of papers */}
          <Card className="grow col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {papersCount ? papersCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData && <HighlightLineChart data={chartData} />}
            </CardContent>
          </Card>
          {/* Number of studies */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {studiesCount ? studiesCount.toString() : "-"}
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
                {openAccessCount ? openAccessCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Open access papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart percentage={openAccessPercentage} />
            </CardContent>
          </Card>
          {/* Percentage of open access papers */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {preregistrationsCount ? preregistrationsCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Preregistered studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart percentage={preregistrationPercentage} />
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
