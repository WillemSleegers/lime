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
import { Data, getCount, getCounts, getUniqueData } from "@/lib/json-functions"

type HighLightsProps = {
  data: Data
}

export const Highlights = (props: HighLightsProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)

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
  const papersCount = getUniqueData(data, "paper")
  const openAccessCount = getCount(data, "paper", "paper_open_access", "yes")
  const yearCounts = getCounts(data, "paper", "paper_year")
  const mostRecentYear = Math.max(...data.map((e) => e.paper_year))

  const preregisteredPapers = data.filter(
    (datum) => datum.study_preregistered === "yes"
  ).length

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
      <CollapsibleContent className="CollapsibleContent py-3">
        <div className="flex flex-wrap gap-3">
          {/* Number of papers */}
          <Card className="grow">
            <CardHeader>
              <CardTitle>{papersCount.toString()}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of papers
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Number of studies */}
          <Card className="grow">
            <CardHeader>
              <CardTitle>{studiesCount.toString()}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of studies
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Number of effects */}
          <Card className="grow">
            <CardHeader>
              <CardTitle>{effectsCount}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Number of observations */}
          <Card className="grow">
            <CardHeader>
              <CardTitle>
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
              <CardTitle>{openAccessCount.toString()}</CardTitle>
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
              <CardTitle>{preregisteredPapers.toString()}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Preregistrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart
                percentage={round((preregisteredPapers / papersCount) * 100, 0)}
              />
            </CardContent>
          </Card>
          {/* Most recent year */}
          <Card className="grow">
            <CardHeader>
              <CardTitle>{mostRecentYear.toString()}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Most recent publication year
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <HighlightLineChart chartData={yearCounts} />
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
