import { generateTicks, round } from "@/lib/utils"
import React from "react"
import {
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  Scatter,
  ZAxis,
} from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Estimate } from "@/lib/types"

const chartConfig = {
  fill: {
    color: "var(--primary)",
  },
} satisfies ChartConfig

type ChartEffectProps = {
  effect?: Estimate
}

const ChartEffect = ({ effect }: ChartEffectProps) => {
  let minX, maxX, lower, estimate, upper
  if (effect) {
    const range = effect.upper - effect.lower
    const padding = range * 0.5
    minX = Math.min(0, effect.lower - padding)
    maxX = effect.upper + padding
    lower = round(effect.lower, 2)
    estimate = round(effect.value, 2)
    upper = round(effect.upper, 2)
  } else {
    minX = -2
    maxX = 2
    lower = "-"
    estimate = "-"
    upper = "-"
  }

  const ticks = generateTicks(minX, maxX)

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 text-center">
      <div className="text-muted-foreground">
        The average effect is a Cohen&apos;s d with a 95% confidence interval
        of:
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg px-4 py-2">
          <div className="text-2xl font-bold">{lower}</div>
          <div className="text-muted-foreground text-sm">Lower Bound</div>
        </div>
        <div className="bg-muted rounded-lg px-4 py-2">
          <div className="text-2xl font-bold">{estimate}</div>
          <div className="text-muted-foreground text-sm">Estimate</div>
        </div>
        <div className="bg-muted rounded-lg px-4 py-2">
          <div className="text-2xl font-bold">{upper}</div>
          <div className="text-muted-foreground text-sm">Upper Bound</div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-32 w-full">
        <ComposedChart
          margin={{
            bottom: 5,
            left: 20,
            right: 20,
            top: 5,
          }}
        >
          <XAxis
            dataKey="x"
            type="number"
            domain={[minX, maxX]}
            ticks={ticks}
          />
          <YAxis dataKey="y" type="number" domain={[-1, 1]} hide />
          <ZAxis dataKey="z" type="number" range={[0, 250]} />

          <Line
            data={[
              { x: effect ? estimate : 0, y: 0 },
              { x: effect ? upper : 0, y: 0 },
            ]}
            dataKey={"y"}
            stroke="#eee"
            strokeWidth={16}
            dot={false}
          />

          <Line
            data={[
              { x: effect ? estimate : 0, y: 0 },
              { x: effect ? lower : 0, y: 0 },
            ]}
            dataKey={"y"}
            stroke="#eee"
            strokeWidth={16}
            dot={false}
          />

          <Scatter
            data={[{ x: effect ? estimate : 0, y: 0, z: 1 }]}
            shape="square"
            fill="var(--color-fill)"
            animationDuration={0}
            hide={effect == undefined}
          />

          <ReferenceLine x={0} stroke="#666" strokeDasharray="5 5" />
        </ComposedChart>
      </ChartContainer>
    </div>
  )
}

export default ChartEffect
