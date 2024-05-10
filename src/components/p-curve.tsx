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
  LineChart,
  Line,
  Legend,
} from "recharts"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn, countPValues, round } from "@/lib/utils"
import { dataProps } from "@/lib/json-functions"
import effects from "../assets/data/prepared-effects.json"
import { ValueType } from "tailwindcss/types/config"
import { NameType } from "recharts/types/component/DefaultTooltipContent"

type PCurveProps = {
  data: dataProps
}

export const PCurve = (props: PCurveProps) => {
  const { data } = props

  const [open, setOpen] = useState(false)
  const [pCount, setPCount] = useState(0)
  const [pSigCount, setSigPCount] = useState(0)
  const [plotData, setPlotData] = useState<{}[]>([])

  useEffect(() => {
    const pValues = data.map((e) => e.effect_p)
    const pSigValues = pValues.filter((e) => e < 0.05)

    setPCount(pValues.length)
    setSigPCount(pSigValues.length)

    const counts = countPValues(pSigValues)
    setPlotData(counts)
  }, [data])

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="mb-3">
        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-1">
            <h2 className="text-2xl font-bold tracking-tight">P-curve</h2>
            <ChevronRight
              className={cn("transition", open ? "rotate-90" : "rotate-0")}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="flex flex-col">
          <p>
            <span>Number of effects: </span>
            <span>{pCount}</span>
            <br />
            <span>Number of significant effects (p &lt; .05): </span>
            <span>{pSigCount}</span>
          </p>
          <div className="h-[400px] min-w-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                data={plotData}
              >
                <CartesianGrid fill="whitesmoke" />
                <XAxis dataKey="p" type="number" domain={[0.1, 0.05]} />
                <YAxis
                  tickFormatter={(x) => toPercent(x, 2)}
                  domain={[0, 1]}
                  ticks={[0, 0.25, 0.5, 0.75, 1]}
                />
                <Tooltip content={<CustomTooltip />} />

                <Line dataKey="prop" stroke="black" name="Observed p-curve" />
                <Line
                  name="Null of no effect"
                  dataKey="null"
                  stroke="gray"
                  dot={false}
                  strokeDasharray="3 3"
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const toPercent = (prop: number, digits = 2) => {
  return `${round(prop, digits) * 100}%`
}

const CustomTooltip = ({
  active,
  payload,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload
    return (
      <div className="rounded border border-gray-500 bg-white px-3 py-2">
        <span>{`%: ${round(dataPoint.prop, 2)}`}</span>
        <br />
        <span>{`p: ${dataPoint.p}`}</span>
        <br />
        <span>null: 0.2</span>
      </div>
    )
  }

  return null
}
