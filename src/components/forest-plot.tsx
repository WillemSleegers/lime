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
  TooltipProps,
  ReferenceLine,
  ZAxis,
} from "recharts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn, round } from "@/lib/utils"
import { Data } from "@/lib/json-functions"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"
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
  data: Data
}

export const ForestPlot = (props: ForestPlotProps) => {
  const { data } = props

  const [open, setOpen] = useState(false)
  const [plotData, setPlotData] = useState<{}[]>([])

  const longestLabel = data
    .map((e) => e.effect_label)
    .reduce((a, b) => (a.length > b.length ? a : b))

  useEffect(() => {
    const newData = data
      .map((e) => {
        return {
          name: e.effect_label,
          value: e.effect_size_value,
          summary: `${round(e.effect_size_value)} [${round(e.effect_size_lower)}; ${round(e.effect_size_upper)}]`,
          error: [
            Math.abs(e.effect_size_value - e.effect_size_lower),
            Math.abs(e.effect_size_value - e.effect_size_upper),
          ],
        }
      })
      .sort((a, b) => a.value - b.value)
    setPlotData(newData)
  }, [data])

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="m-1 flex flex-row items-center gap-1">
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
                <Tooltip content={<CustomTooltip />} />
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

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    console.log(payload)
    const dataPoint = payload[0].payload
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

    const effect = effects.filter((e) => e.effect_label == payload.value)

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{payload.value}</DialogTitle>
            <DialogDescription>
              <h1 className="border-b pb-1 pt-2 text-xl font-semibold tracking-tight text-black first:mt-0">
                Paper
              </h1>

              <div className="my-3">
                <span className="font-semibold text-black">Title:</span>
                <br />
                <span>{effect[0].paper_title}</span>
              </div>
              <div className="my-3">
                <span className="font-semibold text-black">Authors:</span>
                <br />
                <span>{effect[0].paper_authors}</span>
              </div>
              <div className="my-3">
                <span className="font-semibold text-black">URL:</span>
                <br />
                <a target="_blank" href={effect[0].paper_link}>
                  {effect[0].paper_link}
                </a>
              </div>

              <h1 className="border-b pb-1 pt-2 text-xl font-semibold tracking-tight text-black first:mt-0">
                Outcome
              </h1>
              <div className="my-3">
                <span className="font-semibold text-black">Label:</span>
                <br />
                <span>{effect[0].outcome_label}</span>
              </div>
              <div className="my-3">
                <span className="font-semibold text-black">Category:</span>
                <br />
                <span>{effect[0].outcome_category}</span>
              </div>

              <h1 className="border-b pb-1 pt-2 text-xl font-semibold tracking-tight text-black first:mt-0">
                Effect
              </h1>
              <div className="my-3">
                <span className="font-semibold text-black">Value:</span>
                <br />
                <span>{effect[0].effect_size_value}</span>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }
}
