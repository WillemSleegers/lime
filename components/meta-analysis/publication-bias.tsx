import { useState } from "react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  Tooltip,
  ReferenceLine,
} from "recharts"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"

import { cn, round } from "@/lib/utils"
import { Data, Egger, Estimate } from "@/lib/types"

import {
  NameType,
  Props,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

type CollapsiblePublicationBiasProps = {
  estimate?: Estimate
  egger?: Egger
  data?: Data
}

export const CollapsiblePublicationBias = (
  props: CollapsiblePublicationBiasProps
) => {
  const { estimate, egger, data } = props

  const [open, setOpen] = useState(false)

  let plotData
  let ymax

  if (data) {
    plotData = data.map((e) => {
      return {
        x: e.effect_size,
        y: e.effect_size_se,
        name: e.paper_label + " - " + e.effect,
      }
    })

    ymax = Math.max(...plotData.map((e) => e.y))
  } else {
    ymax = 0
  }

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Publication bias
          </h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent prose mx-auto">
        <div className="my-3">
          <h3 className="text-center">Small Study Effect Methods</h3>
          <h4 className="text-center">Egger&apos;s Test</h4>
          {egger && (
            <p>
              We found{" "}
              {egger.egger_p < 0.05 ? (
                <span className="font-semibold text-red-500">evidence</span>
              ) : (
                <span>no evidence</span>
              )}{" "}
              of publication bias using the{" "}
              <Link href="https://doi.org/10.1080/00220973.2019.1582470">
                Egger&apos;s regression test
              </Link>{" "}
              (b = {round(egger.egger_b, 2)}, SE = {round(egger.egger_se, 2)}, z
              = {round(egger.egger_z, 2)}, p = {round(egger.egger_p, 2)}).
            </p>
          )}
          <h4 className="text-center">Funnel plot</h4>
          <div className="overflow-auto">
            {estimate && (
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
                      dx: -30,
                      fill: "black",
                    }}
                    reversed
                  />
                  <Tooltip content={<CustomTooltip accessibilityLayer />} />
                  <ReferenceLine
                    x={estimate.value}
                    stroke="black"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    segment={[
                      { x: estimate.value, y: 0 },
                      {
                        x: estimate.value - 1.96 * Math.ceil(ymax),
                        y: Math.ceil(ymax),
                      },
                    ]}
                    stroke="black"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    ifOverflow="hidden"
                  />
                  <ReferenceLine
                    segment={[
                      { x: estimate.value, y: 0 },
                      {
                        x: estimate.value + 1.96 * Math.ceil(ymax),
                        y: Math.ceil(ymax),
                      },
                    ]}
                    stroke="black"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    ifOverflow="hidden"
                  />
                  <Scatter
                    fill="lightgray"
                    stroke="black"
                    animationBegin={300}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

const CustomTooltip = ({ payload }: Props<ValueType, NameType>) => {
  if (payload && payload.length) {
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
