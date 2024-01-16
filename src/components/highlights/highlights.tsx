import { useState } from "react"
import {
  dataProps,
  getCount,
  getCounts,
  getMostCommon,
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
import { cn } from "@/lib/utils"
import { HighlightText } from "./highlight-text"

type HighLightsProps = {
  data: dataProps
}

export const Highlights = (props: HighLightsProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)

  const effectsCount = data.length
  const papersCount = getUniqueData(data, "paper")
  const outcomeCount = getUniqueData(data, "outcome_category")
  const mostCommonOutcome = getMostCommon(data, "outcome_category")
  const openAccessCount = getCount(data, "paper", "paper_open_access", "yes")
  const yearCounts = getCounts(data, "paper", "paper_year")

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
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <HighlightText
            title={effectsCount + (effectsCount == 1 ? " effect" : " effects")}
            description={
              "From " + papersCount + (papersCount == 1 ? " paper" : " papers")
            }
          />
          <HighlightText
            title={
              outcomeCount + (outcomeCount == 1 ? " outcome" : " outcomes")
            }
            description={
              "The most common " +
              (mostCommonOutcome.length > 1
                ? "outcomes are " + mostCommonOutcome.join(" and ")
                : "outcome is " + mostCommonOutcome)
            }
          />
          <HighlightPercentage
            title={openAccessCount + " open access papers"}
            description={
              Math.round(
                ((openAccessCount / papersCount) * 100 + Number.EPSILON) * 100
              ) /
                100 +
              "% of all papers"
            }
            percentage={openAccessCount / papersCount}
          />
          <HighlightLineChart
            title={papersCount + (papersCount == 1 ? " paper" : " papers")}
            description={
              yearCounts[yearCounts.length - 1].y +
              " published in " +
              yearCounts[yearCounts.length - 1].x
            }
            data={yearCounts}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
