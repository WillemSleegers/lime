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
import { Card, CardContent } from "@/components/ui/card"

import effects from "../../assets/data/data.json"

import { EffectDialogContent } from "./effect-dialog-content"
import { ChartConfig, ChartContainer } from "../ui/chart"

type ForestPlotProps = {
  data: Data
}

export const ForestPlot = ({ data }: ForestPlotProps) => {
  const [isOpen, setIsOpen] = useState(false)

  let xMin = -2
  let xMax = 2
  let xTicks = [-2, -1, 0, 1, 2]

  const plotData = data
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

  const longestLabel = data
    .map((e) => e.paper_label + " - " + e.effect)
    .reduce((a, b) => (a.length > b.length ? a : b))

  // Calculate dynamic x-axis range based on confidence intervals
  const allLowerBounds = data.map((e) => e.effect_size_lower)
  const allUpperBounds = data.map((e) => e.effect_size_upper)
  const dataMin = Math.min(...allLowerBounds)
  const dataMax = Math.max(...allUpperBounds)

  // Add 10% padding on each side
  const range = dataMax - dataMin
  const padding = range * 0.1
  xMin = dataMin - padding
  xMax = dataMax + padding

  // Generate nice round tick marks - use 0.5 intervals for cleaner ticks
  const rawInterval = range / 5
  let tickInterval: number

  if (rawInterval <= 0.5) {
    tickInterval = 0.5
  } else if (rawInterval <= 1) {
    tickInterval = 1
  } else if (rawInterval <= 2) {
    tickInterval = 2
  } else {
    tickInterval = Math.ceil(rawInterval)
  }

  // Generate ticks within the padded range
  const firstTick = Math.ceil(xMin / tickInterval) * tickInterval
  const lastTick = Math.floor(xMax / tickInterval) * tickInterval

  xTicks = []
  for (let tick = firstTick; tick <= lastTick; tick += tickInterval) {
    xTicks.push(Number(tick.toFixed(1)))
  }

  // Always include 0 if it's in range
  if (xMin < 0 && xMax > 0 && !xTicks.includes(0)) {
    xTicks.push(0)
    xTicks.sort((a, b) => a - b)
  }

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h2 className="text-subsection-title">Forest Plot</h2>
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          This forest plot displays the effect size and confidence interval for each individual study. The horizontal lines show the uncertainty around each estimate. Longer lines indicate more uncertainty, while points further from zero indicate stronger effects.
        </p>
      </div>
      {isOpen && (
        <Card>
          <CardContent className="py-5" style={{ height: 30 * plotData.length }}>
            <ChartContainer config={chartConfig} className="h-full aspect-auto">
              <ScatterChart
                data={plotData}
                margin={{
                  bottom: 20,
                  left: 0,
                  right: 20,
                  top: 5,
                }}
              >
                <CartesianGrid
                  horizontal={false}
                  className="fill-muted"
                  verticalValues={xTicks}
                />
                <XAxis
                  dataKey="value"
                  type="number"
                  label={{
                    value: "Effect size",
                    dy: 20,
                    className: "fill-foreground",
                  }}
                  domain={[xMin, xMax]}
                  ticks={xTicks}
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
                <Scatter yAxisId="left" className="fill-primary stroke-primary stroke-[1.5]">
                  <ErrorBar
                    dataKey="error"
                    direction="x"
                    strokeWidth={2}
                    width={5}
                    className="stroke-primary"
                  />
                </Scatter>
                <ReferenceLine
                  yAxisId="left"
                  x={0}
                  strokeWidth={2}
                  className="stroke-muted-foreground"
                  strokeDasharray="3 3"
                />
              </ScatterChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const CustomTooltip = (props: Props<ValueType, NameType>) => {
  if (props.payload && props.payload.length) {
    const dataPoint = props.payload[0].payload
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-sm text-xs">
        <p className="font-medium mb-2">{dataPoint.name}</p>
        <p className="text-muted-foreground text-xs">{dataPoint.summary}</p>
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
          className="fill-muted-foreground"
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
