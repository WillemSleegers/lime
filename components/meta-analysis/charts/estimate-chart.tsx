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
  ReferenceArea,
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

    // CI lines
    lineCiLeft = [
      { x: estimate.value, y: 0 },
      { x: estimate.lower, y: 0 },
    ]
    lineCiRight = [
      { x: estimate.value, y: 0 },
      { x: estimate.upper, y: 0 },
    ]

    // PI lines - much thicker to show it as a band
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
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <ComposedChart
        margin={{
          bottom: 10,
          left: 20,
          right: 20,
          top: 25,
        }}
      >
        <XAxis dataKey="x" type="number" domain={[minX, maxX]} ticks={ticks} />
        <YAxis dataKey="y" type="number" domain={[-1, 1]} hide />
        <ZAxis dataKey="z" type="number" range={[0, 300]} />
        <Legend content={renderLegend} />

        {/* Prediction Interval - filled area with rounded corners */}
        {estimate && (
          <ReferenceArea
            x1={estimate.piLower}
            x2={estimate.piUpper}
            y1={-0.25}
            y2={0.25}
            fill="var(--color-stroke)"
            fillOpacity={0.25}
            strokeOpacity={0}
            radius={8}
          />
        )}

        {/* Confidence Interval - solid lines */}
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
          data={lineCiRight}
          dataKey={"y"}
          stroke="var(--color-stroke)"
          strokeWidth={4}
          dot={false}
          animationDuration={1000}
          activeDot={false}
        />

        {/* Average effect point */}
        <Scatter data={point} shape="circle" fill="var(--color-fill)" isAnimationActive={false} />

        {/* Reference line at zero */}
        <ReferenceLine x={0} className="stroke-muted-foreground" strokeDasharray="5 5" strokeWidth={1.5} />
      </ComposedChart>
    </ChartContainer>
  )
}

export default ChartEstimate

const renderLegend = () => {
  const legendItems = [
    { color: "var(--color-fill)", label: "Average Effect", shape: "circle" },
    { color: "var(--color-stroke)", label: "95% Confidence Interval", shape: "line" },
    { color: "var(--color-stroke)", label: "95% Prediction Interval", shape: "thick-line", opacity: 0.25 },
  ]

  return (
    <div className="flex justify-center gap-6 mt-4 text-sm">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.shape === "thick-line" ? (
            <div
              className="w-6 h-3"
              style={{
                backgroundColor: item.color,
                opacity: item.opacity,
              }}
            />
          ) : item.shape === "line" ? (
            <div
              className="w-6 h-1"
              style={{ backgroundColor: item.color }}
            />
          ) : (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
