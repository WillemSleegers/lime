import { PureComponent, useEffect, useState } from "react"
import {
  ResponsiveContainer,
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

type ForestPlotProps = {
  data: Data
}

type ForestPlotDataProps = {
  name: string
  value: number
  summary: string
  error: number[]
}

export const ForestPlot = (props: ForestPlotProps) => {
  const { data } = props

  const [open, setOpen] = useState(false)
  const [plotData, setPlotData] = useState<ForestPlotDataProps[]>([])

  const longestLabel = data
    .map((e) => e.paper_label + " - " + e.effect)
    .reduce((a, b) => (a.length > b.length ? a : b))

  useEffect(() => {
    const newData = data
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
    setPlotData(newData)
  }, [data])

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Forest plot</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="py-5">
          <div className="flex flex-col overflow-auto p-3">
            <ResponsiveContainer
              height={40 * plotData.length + 50}
              width="100%"
              minWidth={600}
            >
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
            </ResponsiveContainer>
          </div>
        </div>
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

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, payload }: any = this.props

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
            "Effect information of " +
            effect.paper_label +
            " - " +
            effect.effect
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
}
