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

import { round } from "@/lib/utils"
import { Data, Egger, Estimate } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"

import {
  NameType,
  Props,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

type CollapsiblePublicationBiasProps = {
  estimate: Estimate
  egger: Egger
  data: Data
}

export const CollapsiblePublicationBias = (
  props: CollapsiblePublicationBiasProps
) => {
  const { estimate, egger, data } = props

  const plotData = data.map((e) => {
    return {
      x: e.effect_size,
      y: e.effect_size_se,
      name: e.paper_label + " - " + e.effect,
    }
  })

  const ymax = Math.max(...plotData.map((e) => e.y))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-subsection-title">Publication Bias</h2>
        <p className="text-sm text-muted-foreground">
          Publication bias occurs when studies with positive results are more
          likely to be published than studies with null or negative results,
          which can make interventions appear more effective than they actually
          are. The tests below help detect whether this bias might be present in
          the data.
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Small Study Effect Methods
          </h3>
          <div className="space-y-3">
            <h4 className="text-base font-medium">Egger&apos;s Test</h4>
            <p className="text-sm leading-relaxed">
              We found{" "}
              {egger.egger_p < 0.05 ? (
                <span className="font-semibold text-red-500">evidence</span>
              ) : (
                <span>no evidence</span>
              )}{" "}
              of publication bias using the{" "}
              <Link
                href="https://doi.org/10.1080/00220973.2019.1582470"
                className="text-primary hover:underline"
              >
                Egger&apos;s regression test
              </Link>{" "}
              (b = {round(egger.egger_b, 2)}, SE = {round(egger.egger_se, 2)}, z
              = {round(egger.egger_z, 2)}, p = {round(egger.egger_p, 2)}).
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Funnel Plot</h3>
          <Card>
            <CardContent className="overflow-auto py-5">
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
                  <CartesianGrid className="fill-muted" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    label={{
                      value: "Effect size",
                      dy: 20,
                      className: "fill-foreground",
                    }}
                  />
                  <YAxis
                    dataKey="y"
                    type="number"
                    label={{
                      value: "Standard error",
                      angle: -90,
                      dx: -30,
                      className: "fill-foreground",
                    }}
                    reversed
                  />
                  <Tooltip content={<CustomTooltip accessibilityLayer />} />
                  <ReferenceLine
                    x={estimate.value}
                    className="stroke-muted-foreground"
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
                    className="stroke-muted-foreground"
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
                    className="stroke-muted-foreground"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    ifOverflow="hidden"
                  />
                  <Scatter
                    className="fill-primary/70 stroke-primary stroke-[1.5]"
                    animationBegin={300}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ payload }: Props<ValueType, NameType>) => {
  if (payload && payload.length) {
    const dataPoint = payload[0].payload
    return (
      <div className="bg-card border border-border rounded-xl p-3 shadow-sm text-xs">
        <p className="font-medium mb-2">{dataPoint.name}</p>
        <p className="font-medium">
          <span className="text-muted-foreground">Effect size:</span>{" "}
          {dataPoint.x}
        </p>
        <p className="font-medium">
          <span className="text-muted-foreground">Standard error:</span>{" "}
          {dataPoint.y}
        </p>
      </div>
    )
  }

  return null
}
