"use client"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import {
  Label,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "var(--primary)",
  },
} satisfies ChartConfig

type HighlightRadialBarChartProps = {
  percentage: number
}

export const HighlightRadialBarChart = ({
  percentage,
}: HighlightRadialBarChartProps) => {
  const chartData = [
    { percentage: percentage, fill: "var(--color-percentage)" },
  ]

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[100px] w-full aspect-square"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={40}
        outerRadius={60}
      >
        <RadialBar
          dataKey="percentage"
          background
          cornerRadius={10}
          className="fill-primary"
        />
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          tickLine={false}
          axisLine={false}
        />
        <PolarRadiusAxis
          tick={false}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="block fill-foreground p-3 text-xl font-bold"
                  >
                    {chartData[0].percentage.toLocaleString() + "%"}
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
