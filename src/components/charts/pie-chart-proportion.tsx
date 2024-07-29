"use client"

import { Label, Pie, PieChart } from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { round } from "@/lib/utils"

const chartConfig = {
  half: {
    color: "hsl(var(--muted))",
  },
  proportion: {
    color: "hsl(var(--primary))",
  },
  remainder: {
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig

type PieChartProportionProps = {
  proportion: number
  start: 0 | 0.5
}

export const PieChartProportion = ({
  proportion,
  start,
}: PieChartProportionProps) => {
  const chartData = [
    { proportion: start, fill: "var(--color-half)" },
    {
      proportion: proportion - start,
      fill: "var(--color-proportion)",
    },
    {
      proportion: 1 - proportion,
      fill: "var(--color-remainder",
    },
  ]
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <PieChart data={chartData}>
        <Pie
          data={chartData}
          dataKey="proportion"
          startAngle={180}
          endAngle={0}
          innerRadius={50}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 8}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {round(proportion * 100, 0) + "%"}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
