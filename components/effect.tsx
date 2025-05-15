import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { useState } from "react"
import { cn, u1, pSup, round, u3 } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"
import { PieChartProportion } from "./charts/pie-chart-proportion"
import ChartEffect from "./charts/chart-effect"

type EffectProps = {
  effect: {
    value: number
    lower: number
    upper: number
    egger_b: number
    egger_se: number
    egger_z: number
    egger_p: number
  }
}

export const Effect = (props: EffectProps) => {
  const { effect } = props

  const [open, setOpen] = useState(true)

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
        {effect.value ? (
          <div className="flex flex-col items-center gap-3 my-3">
            <ChartEffect
              effect={effect.value}
              lower={effect.lower}
              upper={effect.upper}
            />
            <div className="mt-6 flex flex-row flex-wrap justify-center gap-3">
              <div className="flex w-[200px] flex-col gap-3">
                <div className="mb-1 h-[100px] w-full">
                  <PieChartProportion
                    proportion={pSup(effect.value)}
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
                    proportion={u3(effect.value)}
                    start={0.5}
                  />
                </div>
                <span className="text-center text-xl font-semibold">
                  Cohen&apos;s U3
                </span>
              </div>
              <div className="flex w-[200px] flex-col gap-3">
                <div className="mb-1 h-[100px] w-full">
                  <PieChartProportion proportion={u1(effect.value)} start={0} />
                </div>
                <span className="text-center text-xl font-semibold">
                  % non-overlap
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              className="whitespace-nowrap rounded-2xl"
            >
              <a href="https://rpsychologist.com/cohend/" target="_blank">
                Learn more
              </a>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-[24px] w-[278px] rounded-full" />
            <Skeleton className="h-[40px] w-[87px] rounded-full" />
            <Skeleton className="h-[24px] w-[157px] rounded-full" />
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
