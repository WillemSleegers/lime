import { PureComponent, useEffect, useState } from "react"
import { VictoryChart, VictoryScatter, VictoryErrorBar } from "victory"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { dataProps } from "@/lib/json-functions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import effects from "../assets/data/prepared-effects.json"

type ForestPlotProps = {
  data: dataProps
}

export const VictoryForestPlot = (props: ForestPlotProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)
  const [plotData, setPlotData] = useState<{}[]>([])

  useEffect(() => {
    const newData = data.map((e, i) => {
      return {
        y: i,
        name: e.label,
        x: e.effect_size_value,
        errorX: [
          Math.abs(e.effect_size_value - e.effect_size_lower),
          Math.abs(e.effect_size_value - e.effect_size_upper),
        ],
      }
    })
    setPlotData(newData)
    console.log(plotData)
  }, [data])

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="mb-3">
        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Forest plot</h2>
            <ChevronRight
              className={cn("transition", open ? "rotate-90" : "rotate-0")}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <VictoryChart height={plotData.length * 10}>
          <VictoryScatter
            style={{ data: { fill: "#c43a31" } }}
            size={2}
            data={plotData}
          />
          <VictoryErrorBar data={plotData} errorX={(datum) => datum.errorX} />
        </VictoryChart>
      </CollapsibleContent>
    </Collapsible>
  )
}
