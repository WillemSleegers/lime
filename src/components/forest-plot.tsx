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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import effects from "../assets/data/prepared-effects.json"
import { Button } from "./ui/button"

type ForestPlotProps = {
  data: dataProps
}

export const ForestPlot = (props: ForestPlotProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)
  const [plotData, setPlotData] = useState<{}[]>([])

  const longestLabel = data
    .map((e) => e.label)
    .reduce((a, b) => (a.length > b.length ? a : b))

  useEffect(() => {
    const newData = data
      .map((e) => {
        return {
          name: e.label,
          x: e.effect_size_value,
          errorX: [
            Math.abs(e.effect_size_value - e.effect_size_lower),
            Math.abs(e.effect_size_value - e.effect_size_upper),
          ],
        }
      })
      .sort((a, b) => a.x - b.x)
    setPlotData(newData)
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
        <div className="py-5">
          <div className="flex flex-col p-3 overflow-auto">
            <ResponsiveContainer
              height={40 * plotData.length + 50}
              width="100%"
              minWidth={600}
            >
              <ScatterChart
                data={plotData}
                margin={{
                  bottom: 5,
                  left: 20,
                  right: 20,
                  top: 5,
                }}
              >
                <CartesianGrid horizontal={false} verticalValues={[0]} />
                <XAxis
                  dataKey="x"
                  type="number"
                  domain={[-3, 3]}
                  ticks={[-3, -2, -1, 0, 1, 2, 3]}
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
                <YAxis
                  yAxisId="right"
                  dataKey="x"
                  type="category"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter shape="square" fill="#16A34A" yAxisId="left">
                  <ErrorBar
                    dataKey="errorX"
                    direction="x"
                    strokeWidth={2}
                    opacity={0.8}
                    width={0}
                  />
                </Scatter>
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
      <div className="custom-tooltip bg-gray-50 p-3 rounded border">
        <p>{`${payload[0].payload.name} : ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, payload }: any = this.props

    const effect = effects.filter((e) => e.label == payload.value)

    return (
      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
              {payload.value}
            </text>
          </g>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">{payload.value}</DialogTitle>
            <DialogDescription>
              <h1 className="border-b pb-1 pt-2 text-xl font-semibold tracking-tight first:mt-0 text-black">
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

              <h1 className="border-b pb-1 pt-2 text-xl font-semibold tracking-tight first:mt-0 text-black">
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

              <h1 className="border-b pb-1 pt-2 text-xl font-semibold tracking-tight first:mt-0 text-black">
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
