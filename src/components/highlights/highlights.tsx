import { useEffect, useState } from "react"
import { dataProps, getMostCommon, getUniqueData } from "@/lib/json-functions"
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
  const [effects, setEffects] = useState(0)
  const [papers, setPapers] = useState(0)
  const [outcomes, setOutcomes] = useState(0)

  let outcomeCount = getUniqueData(data, "outcome_category")
  let mostCommonOutcome = getMostCommon(data, "outcome_category")

  useEffect(() => {
    setEffects(data.length)

    const paperCount = getUniqueData(data, "paper")
    setPapers(paperCount)
  }, [data])

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
        <div className="mt-5 grid grid-cols-3 gap-3">
          <HighlightText
            title={effects + (effects == 1 ? " effect" : " effects")}
            description={
              "From " + papers + (papers == 1 ? " paper" : " papers")
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
          <HighlightPercentage percentage={0.4} />
          <HighlightLineChart />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
