import { useState } from "react"
import {
  dataProps,
  getCount,
  getCounts,
  getUniqueData,
} from "@/lib/json-functions"
import { HighlightLineChart } from "@/components/highlights/highlight-line-chart"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn, round } from "@/lib/utils"
import { HighlightText } from "@/components/highlights/highlight-text"
import { HighlightPercentage } from "@/components/highlights/highlight-radial-percentage"

type HighLightsProps = {
  data: dataProps
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

  const effectsCount = data.length
  const papersCount = getUniqueData(data, "paper")
  const openAccessCount = getCount(data, "paper", "paper_open_access", "yes")
  const yearCounts = getCounts(data, "paper", "paper_year")
  const mostRecentYear = Math.max(...data.map((e) => e.paper_year))

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="m-1 flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Highlights</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <HighlightText
            title={papersCount.toString()}
            description={"Number of papers"}
          />
          <HighlightText
            title={effectsCount.toString()}
            description={"Number of effects"}
          />
          <HighlightText
            title={"~" + Math.round(participantsCount).toString()}
            description={"Number of observations"}
          />
          <HighlightPercentage
            title={openAccessCount.toString()}
            description="Open access papers"
            percentage={round((openAccessCount / papersCount) * 100, 0)}
          />
          <HighlightLineChart
            title={mostRecentYear.toString()}
            description={"Most recent publication year"}
            chartData={yearCounts}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
