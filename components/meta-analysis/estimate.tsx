import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { useState } from "react"
import { cn, u1, pSup, u3, round } from "@/lib/utils"
import { Button } from "../ui/button"
import { PieChartProportion } from "../charts/pie-chart-proportion"

import { Estimate } from "@/lib/types"
import ChartEstimate from "../charts/chart-estimate"

type CollapsibleEstimateProps = {
  estimate?: Estimate
}

export const CollapsibleEstimate = (props: CollapsibleEstimateProps) => {
  const { estimate } = props

  const [open, setOpen] = useState(true)

  let lower, value, upper, piLower, piUpper
  if (estimate) {
    lower = round(estimate.lower, 2)
    value = round(estimate.value, 2)
    upper = round(estimate.upper, 2)
    piLower = round(estimate.piLower, 2)
    piUpper = round(estimate.piUpper, 2)
  } else {
    lower = "-"
    value = "-"
    upper = "-"
    piLower = "-"
    piUpper = "-"
  }

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Effect</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="flex flex-col items-center gap-3 my-3">
          <div className="mx-auto w-full space-y-6 text-center">
            <div className="flex flex-col gap-2 bg-muted rounded-lg px-4 py-2">
              <div className="text-lg font-medium whitespace-nowrap">
                Cohen&apos;s <span className="italic">d</span> effect size:{" "}
              </div>
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-muted-foreground text-sm">
                Our best guess of the true effect size based on all studies
                combined
              </div>
            </div>
            <ChartEstimate estimate={estimate} />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-2 bg-muted rounded-lg px-4 py-2">
                <div className="font-medium whitespace-nowrap">
                  95% Confidence Interval:{" "}
                </div>
                <div className="text-2xl font-bold">
                  {lower} - {upper}
                </div>
                <div className="text-muted-foreground text-sm">
                  This range captures our uncertainty about where the average
                  effect lies
                </div>
              </div>
              <div className="flex flex-col gap-2 bg-muted rounded-lg px-4 py-2">
                <div className="font-medium whitespace-nowrap">
                  95% Prediction Interval:{" "}
                </div>
                <div className="text-2xl font-bold">
                  {piLower} - {piUpper}
                </div>
                <div className="text-muted-foreground text-sm">
                  A new individual study would likely find an effect in this
                  wider range
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-row flex-wrap justify-center gap-3">
            <div className="flex w-[200px] flex-col gap-3">
              <div className="mb-1 h-[100px] w-full">
                <PieChartProportion
                  proportion={estimate ? pSup(estimate.value) : undefined}
                  start={0.5}
                />
              </div>
              <span className="text-center text-xl font-semibold">
                Probability of superiority
              </span>
            </div>
            <div className="flex w-[200px] flex-col gap-3">
              <div className="mb-1 h-[100px] w-full">
                <PieChartProportion
                  proportion={estimate ? u3(estimate.value) : undefined}
                  start={0.5}
                />
              </div>
              <span className="text-center text-xl font-semibold">
                Cohen&apos;s U3
              </span>
            </div>
            <div className="flex w-[200px] flex-col gap-3">
              <div className="mb-1 h-[100px] w-full">
                <PieChartProportion
                  proportion={estimate ? u1(estimate.value) : undefined}
                  start={0}
                />
              </div>
              <span className="text-center text-xl font-semibold">
                % non-overlap
              </span>
            </div>
          </div>

          <Button variant="secondary" className="whitespace-nowrap rounded-2xl">
            <a href="https://rpsychologist.com/cohend/" target="_blank">
              Learn more
            </a>
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
