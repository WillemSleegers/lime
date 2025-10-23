import { useState } from "react"
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  ErrorBar,
  Tooltip,
  ReferenceLine,
  ZAxis,
} from "recharts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn, round } from "@/lib/utils"
import { Data } from "@/lib/types"
import {
  Props,
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import effects from "../../assets/data/data.json"

import { EffectDialogContent } from "./effect-dialog-content"
import { ChartConfig, ChartContainer } from "../ui/chart"

type ForestPlotProps = {
  data?: Data
}

export const ForestPlot = ({ data }: ForestPlotProps) => {
  const [open, setOpen] = useState(false)

  let plotData
  let longestLabel

  if (data) {
    plotData = data
      .map((e) => {
        return {
          name: e.paper_label + " - " + e.effect,
          value: e.effect_size,
          summary: `${round(e.effect_size)} [${round(
            e.effect_size_lower
          )}; ${round(e.effect_size_upper)}]`,
          error: [
            round(Math.abs(e.effect_size - e.effect_size_lower), 2),
            round(Math.abs(e.effect_size - e.effect_size_upper), 2),
          ],
        }
      })
      .sort((a, b) => a.value - b.value)

    longestLabel = data
      .map((e) => e.paper_label + " - " + e.effect)
      .reduce((a, b) => (a.length > b.length ? a : b))
  } else {
    longestLabel = []
  }

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-subsection-title">Forest plot</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {plotData ? (
          <div className="py-5" style={{ height: 30 * plotData.length }}>
            <ChartContainer config={chartConfig} className="h-full aspect-auto">
              <ScatterChart
                data={plotData}
                margin={{
                  bottom: 20,
                  left: 20,
                  right: 20,
                  top: 5,
                }}
              >
                <CartesianGrid
                  horizontal={false}
                  fill="#F5F5F5"
                  verticalValues={[-1, 1]}
                />
                <XAxis
                  dataKey="value"
                  type="number"
                  label={{
                    value: "Effect size",
                    dy: 20,
                    fill: "black",
                  }}
                  domain={[-2, 2]}
                  ticks={[-2, -1, 0, 1, 2]}
                  allowDataOverflow
                />
                <YAxis
                  yAxisId="left"
                  dataKey="name"
                  type="category"
                  width={longestLabel.length * 8}
                  axisLine={false}
                  tickLine={false}
                  tick={<CustomizedAxisTick />}
                />
                <ZAxis range={[40, 41]} />
                <Tooltip
                  content={<CustomTooltip accessibilityLayer />}
                  isAnimationActive={false}
                />
                <Scatter yAxisId="left">
                  <ErrorBar
                    dataKey="error"
                    direction="x"
                    strokeWidth={1}
                    width={5}
                    stroke="black"
                  />
                </Scatter>
                <ReferenceLine
                  yAxisId="left"
                  x={0}
                  strokeWidth={2}
                  stroke="gray"
                  strokeDasharray="3 3"
                />
              </ScatterChart>
            </ChartContainer>
          </div>
        ) : (
          <></>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

const CustomTooltip = (props: Props<ValueType, NameType>) => {
  if (props.payload && props.payload.length) {
    const dataPoint = props.payload[0].payload
    return (
      <div className="custom-tooltip rounded border border-gray-500 bg-white p-3">
        <span className="font-semibold">{`${dataPoint.name}`}</span>
        <br />
        <span>{dataPoint.summary}</span>
      </div>
    )
  }

  return null
}

type CustomAxisTickProps = {
  x?: number
  y?: number
  payload?: {
    value: string | number // ✅ Specific union type
    index: number
    offset: number
    coordinate: number
  }
}

const CustomizedAxisTick = (props: CustomAxisTickProps) => {
  const { x, y, payload } = props

  if (!payload) return

  const effect = effects.find(
    (e) => e.paper_label + " - " + e.effect == payload.value
  )

  // Return nothing if no effect is found; shouldn't happen though
  if (!effect) return

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <text
          transform={`translate(${x},${y})`}
          x={0}
          y={0}
          dy={5}
          textAnchor="end"
          fill="#666"
        >
          {payload.value}
        </text>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-auto p-4"
        style={{ maxHeight: "95dvh" }}
        aria-description={
          "Effect information of " + effect.paper_label + " - " + effect.effect
        }
        aria-describedby={effect.paper_label + " - " + effect.effect}
      >
        <DialogHeader>
          <DialogTitle className="text-center">{payload.value}</DialogTitle>
        </DialogHeader>
        <EffectDialogContent effect={effect} />
      </DialogContent>
    </Dialog>
  )
}
