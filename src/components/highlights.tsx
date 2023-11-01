import { useEffect, useState } from "react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { dataProps, getUniqueData } from "@/lib/json-functions"
import { HighlightPercentage } from "@/components/highlight-percentage"
import { HighlightLineChart } from "@/components/highlight-line-chart"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type HighLightsProps = {
  data: dataProps
}

export const Highlights = (props: HighLightsProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)
  const [effects, setEffects] = useState(0)
  const [papers, setPapers] = useState(0)
  const [outcomes, setOutcomes] = useState(0)

  useEffect(() => {
    setEffects(data.length)

    const paperCount = getUniqueData(data, "paper")
    setPapers(paperCount)

    const outcomesCount = getUniqueData(data, "outcome_category")
    setOutcomes(outcomesCount)
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
          <Card className="min-w-[175px]">
            <CardHeader>
              <CardTitle>
                {effects} {effects == 1 ? "effect" : "effects"}
              </CardTitle>
              <CardDescription>
                From {papers} {papers == 1 ? "paper" : "papers"}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="min-w-[200px]">
            <CardHeader>
              <CardTitle>
                {outcomes} {outcomes == 1 ? "outcome" : "outcomes"}
              </CardTitle>
              <CardDescription>
                The most common outcome is meat consumption
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>14 interventions</CardTitle>
              <CardDescription>
                The most common intervention target is animal welfare
              </CardDescription>
            </CardHeader>
          </Card>
          <HighlightPercentage percentage={0.4} />
          <HighlightLineChart />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
