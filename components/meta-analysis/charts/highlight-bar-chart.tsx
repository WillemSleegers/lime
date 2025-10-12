"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Count",
    color: "var(--primary)",
  },
} satisfies ChartConfig

type HighlightBarChartProps = {
  data: {
    name: string
    value: number
  }[]
}

export const HighlightBarChart = ({ data }: HighlightBarChartProps) => {
  // Calculate dynamic height: 25px per bar (more compact) + padding
  const height = Math.max(150, data.length * 25 + 40)

  return (
    <ChartContainer config={chartConfig} className="w-full" style={{ height: `${height}px` }}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 0,
          right: 12,
          top: 8,
          bottom: 8,
        }}
        barSize={16}
      >
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          fontSize={11}
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={6}
          width={120}
          fontSize={11}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {payload[0].payload.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {payload[0].value} effects
                    </span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="value"
          fill="var(--color-value)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
