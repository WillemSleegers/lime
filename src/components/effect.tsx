import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { useState } from "react"
import { cn, u1, pSup, round, u3 } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"
import { ChartPercentage } from "./charts/chart-percentage"
import { Button } from "./ui/button"
import { ChartPercentageBar } from "./charts/chart-percentage-bar"
import { ChartHalfPie } from "./charts/chart-half-pie"

type EffectProps = {
  effect: {
    value: number
    lower: number
    upper: number
  }
}

export const Effect = (props: EffectProps) => {
  const { effect } = props

  const [open, setOpen] = useState(true)

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Effect</h2>
            <ChevronRight
              className={cn("transition", open ? "rotate-90" : "rotate-0")}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        {effect.value ? (
          <div className="flex flex-col items-center gap-3">
            <span className="text-base text-gray-500">
              The average effect is a Cohen&apos;s d of:
            </span>
            <span className="text-4xl font-semibold">
              {round(effect.value)}
            </span>
            <span className="text-base text-gray-500">
              {"95% CI [" +
                round(effect.lower) +
                ", " +
                round(effect.upper) +
                "]"}
            </span>
            <div className="mt-6 flex flex-row flex-wrap justify-center gap-3">
              <div className="flex w-[200px] flex-col gap-3">
                <div className="mb-3 h-[100px] w-full">
                  <ChartHalfPie proportion={pSup(effect.value)} start={0.5} />
                </div>
                <span className="text-center text-xl font-semibold">
                  Probability of superiority
                </span>
              </div>
              <div className="flex w-[200px] flex-col gap-3">
                <div className="mb-3 h-[100px] w-full">
                  <ChartHalfPie proportion={u3(effect.value)} start={0.5} />
                </div>
                <span className="text-center text-xl font-semibold">
                  Cohen&apos;s U3
                </span>
              </div>
              <div className="flex w-[200px] flex-col gap-3">
                <div className="mb-3 h-[100px] w-full">
                  <ChartHalfPie proportion={u1(effect.value)} start={0} />
                </div>
                <span className="text-center text-xl font-semibold">
                  % non-overlap
                </span>
              </div>
            </div>
            <Button variant="secondary" className="w-[108px]">
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
