import { useState } from "react"
import {
  dataProps,
  getCount,
  getCounts,
  getUniqueData,
} from "@/lib/json-functions"
import { HighlightPercentage } from "@/components/highlights/highlight-percentage"
import { HighlightLineChart } from "@/components/highlights/highlight-line-chart"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn, round } from "@/lib/utils"
import { HighlightText } from "./highlight-text"

type HighLightsProps = {
  data: dataProps
}

export const Highlights = (props: HighLightsProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)

  const participantsCount = [
    ...data
      .reduce((map, { paper, study, total_n }) => {
        return map.set(`${paper}-${study}`, {
          paper,
          study,
          total_n,
        })
      }, new Map())
      .values(),
  ]
    .map((e) => e.total_n)
    .reduce((partialSum, a) => partialSum + a, 0)

  const effectsCount = data.length
  const papersCount = getUniqueData(data, "paper")
  const openAccessCount = getCount(data, "paper", "paper_open_access", "yes")
  const yearCounts = getCounts(data, "paper", "paper_year")
  const mostRecentYear = Math.max(...data.map((e) => e.paper_year))

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="mb-3">
        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Highlights</h2>
            <ChevronRight
              className={cn("transition", open ? "rotate-90" : "rotate-0")}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
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
            description={"Number of participants"}
          />
          <HighlightPercentage
            title={openAccessCount.toString()}
            description="Open access papers"
            percentage={round((openAccessCount / papersCount) * 100, 0)}
          />
          <HighlightLineChart
            title={mostRecentYear.toString()}
            description={"Most recent publication year"}
            data={yearCounts}
            classname="col-span-2"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
