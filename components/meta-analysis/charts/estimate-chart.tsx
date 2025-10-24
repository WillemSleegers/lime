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
  Legend,
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
    lineCiLeft: DataPoint[] = [],
    lineCiRight: DataPoint[] = [],
    linePiLeft: DataPoint[] = [],
    linePiRight: DataPoint[] = []

  if (estimate) {
    const range = estimate.piUpper - estimate.piLower
    const padding = range * 0.1
    minX = Math.min(0, estimate.piLower - padding)
    maxX = estimate.piUpper + padding
    point = [{ x: estimate.value, y: 0, z: 1 }]
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
        <ZAxis dataKey="z" type="number" range={[0, 400]} />
        <Legend content={renderLegend} />
        <Line
          data={linePiLeft}
          dataKey={"y"}
          className="stroke-muted"
          strokeWidth={20}
          dot={false}
          animationDuration={1000}
          activeDot={false}
        />
        <Line
          data={lineCiLeft}
          dataKey={"y"}
          stroke="var(--color-stroke)"
          strokeWidth={4}
          dot={false}
          animationDuration={1000}
          activeDot={false}
        />
        <Line
          data={linePiRight}
          dataKey={"y"}
          className="stroke-muted"
          strokeWidth={20}
          dot={false}
          animationDuration={1000}
          activeDot={false}
        />
        <Line
          data={lineCiRight}
          dataKey={"y"}
          stroke="var(--color-stroke)"
          strokeWidth={4}
          dot={false}
          animationDuration={1000}
          activeDot={false}
        />
        <Scatter data={point} shape="square" fill="var(--color-fill)" />
        <ReferenceLine x={0} className="stroke-muted-foreground" strokeDasharray="5 5" />
      </ComposedChart>
    </ChartContainer>
  )
}

export default ChartEstimate

const renderLegend = () => {
  const legendItems = [
    { color: "var(--color-fill)", label: "Average Estimate" },
    { color: "var(--color-stroke)", label: "Confidence Interval" },
    { color: "hsl(var(--muted))", label: "Prediction Interval" },
  ]

  return (
    <div className="flex justify-center gap-6 mt-2 text-sm">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.label === "Prediction Interval" ? (
            <div className="w-4 h-4" style={{ backgroundColor: item.color }} />
          ) : item.label === "Confidence Interval" ? (
            <div
              className="w-4 h-1.5"
              style={{ backgroundColor: item.color, height: "4px" }}
            />
          ) : (
            <div className="w-4 h-4" style={{ backgroundColor: item.color }} />
          )}
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
