import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { useState } from "react"
import { cdfNormal, cn, round } from "@/lib/utils"
import { Skeleton } from "./ui/skeleton"

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
            <div>
              <span className="mb-0 text-base font-semibold">
                Probability of superiority
              </span>
              <br />
              <span className="text-gray-500">
                There is a{" "}
                <strong className="text-black">
                  {round(cdfNormal(effect.value / Math.sqrt(2)) * 100)}
                </strong>
                % chance that a person picked at random from the treatment group
                will have a higher score than a person picked at random from the
                control group
              </span>
            </div>
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
