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

type FunnelPlotProps = {
  effect: number
  data: dataProps
}

export const FunnelPlot = (props: FunnelPlotProps) => {
  const { effect, data } = props

  const [open, setOpen] = useState(false)
  const [ymin, setYmin] = useState(0)
  const [plotData, setPlotData] =
    useState<{ x: number; y: number; name: string }[]>()

  useEffect(() => {
    const newData = data.map((e) => {
      return {
        x: e.yi,
        y: e.se * -1,
        name: e.effect_label,
      }
    })

    setYmin(Math.min(...newData.map((e) => e.y)))
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
                  bottom: 20,
                  left: 20,
                  right: 20,
                  top: 5,
                }}
              >
                <CartesianGrid fill="whitesmoke" />
                <XAxis
                  dataKey="x"
                  type="number"
                  label={{
                    value: "Effect size",
                    dy: 20,
                    fill: "black",
                  }}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  label={{
                    value: "Standard error",
                    angle: -90,
                    dx: -25,
                    fill: "black",
                  }}
                  domain={[Math.floor(ymin), 0]}
                />
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
                    {
                      x: effect - 1.96 * Math.floor(ymin),
                      y: Math.floor(ymin),
                    },
                  ]}
                  stroke="black"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  ifOverflow="hidden"
                />
                <ReferenceLine
                  segment={[
                    { x: effect, y: 0 },
                    {
                      x: effect + 1.96 * Math.floor(ymin),
                      y: Math.floor(ymin),
                    },
                  ]}
                  stroke="black"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  ifOverflow="hidden"
                />
                <Scatter fill="lightgray" stroke="black" />
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
    const dataPoint = payload[0].payload
    return (
      <div className="custom-tooltip rounded border border-gray-500 bg-white p-3">
        <span className="font-semibold">{`${dataPoint.name}`}</span>
        <br />
        <span>{`x: ${dataPoint.x}`}</span>
        <br />
        <span>{`y: ${dataPoint.y}`}</span>
      </div>
    )
  }

  return null
}
