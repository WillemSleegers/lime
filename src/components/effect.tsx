import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { useState } from "react"
import { cn } from "@/lib/utils"

type EffectProps = {
  effect: number
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
        <div className="flex flex-col gap-3 text-center">
          <p className="text-base text-gray-500">
            The average effect is a Cohen&apos;s d of:
          </p>
          <p className="text-4xl font-semibold">{effect}</p>
          <p className="text-base text-gray-500">95% CI [0.15, 0.24]</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
