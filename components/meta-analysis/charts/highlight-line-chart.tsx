"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartConfig = {
  y: {
    color: "var(--primary)",
  },
} satisfies ChartConfig

type HighlightLineChartProps = {
  data: {
    x: number | string
    y: number
  }[]
}

export const HighlightLineChart = ({ data }: HighlightLineChartProps) => {
  return (
    <ChartContainer config={chartConfig} className="h-20 w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="x"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={4}
          interval="preserveStartEnd"
        />
        <Line
          dataKey="y"
          type="monotone"
          stroke="var(--color-y)"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
