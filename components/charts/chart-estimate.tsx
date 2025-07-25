import { generateTicks } from "@/lib/utils"
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
  stroke: {
    color: "var(--primary)",
  },
} satisfies ChartConfig

type ChartEstimateProps = {
  estimate?: Estimate
}

type DataPoint = {
  x: number
  y: number
  z?: number
}

const ChartEstimate = ({ estimate }: ChartEstimateProps) => {
  let minX,
    maxX,
    point: DataPoint[] = [],
    pointsCi: DataPoint[] = [],
    pointsPi: DataPoint[] = [],
    lineCiLeft: DataPoint[] = [],
    lineCiRight: DataPoint[] = [],
    linePiLeft: DataPoint[] = [],
    linePiRight: DataPoint[] = []

  if (estimate) {
    const range = estimate.piUpper - estimate.piLower
    const padding = range * 0.1
    minX = Math.min(0, estimate.piLower - padding)
    maxX = estimate.piUpper + padding
    point = [{ x: estimate.value, y: 0, z: 3 }]
    pointsCi = [
      { x: estimate.lower, y: 0, z: 2 },
      { x: estimate.upper, y: 0, z: 2 },
    ]
    pointsPi = [
      { x: estimate.piLower, y: 0, z: 2 },
      { x: estimate.piUpper, y: 0, z: 2 },
    ]
    lineCiLeft = [
      { x: estimate.value, y: 0 },
      { x: estimate.lower, y: 0 },
    ]
    lineCiRight = [
      { x: estimate.value, y: 0 },
      { x: estimate.upper, y: 0 },
    ]
    linePiLeft = [
      { x: estimate.value, y: 0 },
      { x: estimate.piLower, y: 0 },
    ]
    linePiRight = [
      { x: estimate.value, y: 0 },
      { x: estimate.piUpper, y: 0 },
    ]
  } else {
    minX = -2
    maxX = 2
    point = []
    pointsCi = []
    pointsPi = []
    lineCiLeft = []
    lineCiRight = []
    linePiLeft = []
    linePiRight = []
  }

  const ticks = generateTicks(minX, maxX)

  return (
    <ChartContainer config={chartConfig} className="h-32 w-full">
      <ComposedChart
        margin={{
          bottom: 5,
          left: 20,
          right: 20,
          top: 5,
        }}
      >
        <XAxis dataKey="x" type="number" domain={[minX, maxX]} ticks={ticks} />
        <YAxis dataKey="y" type="number" domain={[-1, 1]} hide />
        <ZAxis dataKey="z" type="number" range={[0, 150]} />
        <Line
          data={linePiLeft}
          dataKey={"y"}
          stroke="var(--color-stroke)"
          strokeWidth={6}
          dot={false}
          animationDuration={1000}
        />
        <Line
          data={lineCiLeft}
          dataKey={"y"}
          stroke="var(--color-stroke)"
          strokeWidth={6}
          dot={false}
          animationDuration={1000}
        />
        <Line
          data={lineCiRight}
          dataKey={"y"}
          stroke="var(--color-stroke)"
          strokeWidth={6}
          dot={false}
          animationDuration={1000}
        />
        <Line
          data={linePiRight}
          dataKey={"y"}
          stroke="var(--color-stroke)"
          strokeWidth={6}
          dot={false}
          animationDuration={1000}
        />
        <Scatter
          data={pointsPi}
          fill="var(--color-fill)"
          stroke="white"
          strokeWidth={2}
          animationBegin={1000}
        />
        <Scatter
          data={pointsCi}
          fill="var(--color-fill)"
          stroke="white"
          strokeWidth={2}
          animationBegin={1000}
        />
        <Scatter
          data={point}
          fill="var(--color-fill)"
          stroke="white"
          strokeWidth={2}
        />
        <ReferenceLine x={0} stroke="#666" strokeDasharray="5 5" />
      </ComposedChart>
    </ChartContainer>
  )
}

export default ChartEstimate
