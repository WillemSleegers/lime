import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Tooltip,
  TooltipProps,
  ReferenceLine,
} from "recharts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { dataProps } from "@/lib/json-functions"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import effects from "../assets/data/prepared-effects.json"

type FunnelPlotProps = {
  effect: number
  data: dataProps
}

export const FunnelPlot = (props: FunnelPlotProps) => {
  const { effect, data } = props

  const [open, setOpen] = useState(false)
  const [ymin, setYmin] = useState(0)
  const [plotData, setPlotData] = useState<{ x: number; y: number }[]>()

  useEffect(() => {
    const newData = data.map((e) => {
      return {
        x: e.yi,
        y: e.se * -1,
      }
    })

    setYmin(Math.min(...newData.map((e) => e.y)))
    console.log(ymin)

    setPlotData(newData)
  }, [data])

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="mb-3">
        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Funnel plot</h2>
            <ChevronRight
              className={cn("transition", open ? "rotate-90" : "rotate-0")}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="py-5">
          <div className="flex flex-col overflow-auto p-3">
            <ResponsiveContainer height={500} width="100%" minWidth={600}>
              <ScatterChart
                data={plotData}
                margin={{
                  bottom: 5,
                  left: 20,
                  right: 20,
                  top: 5,
                }}
              >
                <CartesianGrid />
                <XAxis dataKey="x" type="number" />
                <YAxis dataKey="y" type="number" range={[0, ymin]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  x={effect}
                  stroke="black"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                />
                <ReferenceLine
                  segment={[
                    { x: effect, y: 0 },
                    { x: effect - 1.96 * ymin, y: ymin },
                  ]}
                  stroke="black"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  ifOverflow="hidden"
                />
                <ReferenceLine
                  segment={[
                    { x: effect, y: 0 },
                    { x: effect + 1.96 * -1, y: -1 },
                  ]}
                  stroke="black"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  ifOverflow="hidden"
                />
                <Scatter />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip rounded border bg-gray-50 p-3">
        <p>{`${payload[0].payload.name} : ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}
