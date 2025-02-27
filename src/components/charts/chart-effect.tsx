import { generateTicks } from "@/lib/utils"
import React, { FC } from "react"
import {
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Scatter,
  ZAxis,
  Dot,
  Rectangle,
  RectangleProps,
} from "recharts"
import { ScatterCustomizedShape } from "recharts/types/cartesian/Scatter"

type ChartEffectProps = {
  effect: number
  lower: number
  upper: number
}

const ChartEffect = ({ effect, lower, upper }: ChartEffectProps) => {
  const range = upper - lower
  const padding = range * 0.5
  const minX = Math.min(0, lower - padding)
  const maxX = upper + padding

  const ticks = generateTicks(minX, maxX)

  return (
    <div className="mx-auto w-full max-w-xl space-y-6 text-center">
      <div className="text-muted-foreground">
        The average effect is a Cohen&apos;s d with a 95% confidence interval
        of:
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="text-3xl font-bold">{lower.toFixed(2)}</div>
          <div className="text-muted-foreground text-sm">Lower Bound</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-3xl font-bold">{effect.toFixed(2)}</div>
          <div className="text-muted-foreground text-sm">Estimate</div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-3xl font-bold">{upper.toFixed(2)}</div>
          <div className="text-muted-foreground text-sm">Upper Bound</div>
        </div>
      </div>
      <div className="h-32">
        <ResponsiveContainer>
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
                { x: effect, y: 0 },
                { x: upper, y: 0 },
              ]}
              dataKey={"y"}
              stroke="#eee"
              strokeWidth={16}
              dot={false}
            />
            <Line
              data={[
                { x: effect, y: 0 },
                { x: lower, y: 0 },
              ]}
              dataKey={"y"}
              stroke="#eee"
              strokeWidth={16}
              dot={false}
            />
            <Scatter
              data={[{ x: effect, y: 0, z: 1 }]}
              shape="square"
              fill="green"
            />
            <ReferenceLine x={0} stroke="#666" strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChartEffect
