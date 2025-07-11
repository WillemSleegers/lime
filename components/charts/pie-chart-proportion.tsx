"use client"

import { Label, Pie, PieChart } from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { round } from "@/lib/utils"

const chartConfig = {
  half: {
    color: "var(--muted)",
  },
  proportion: {
    color: "var(--primary)",
  },
  remainder: {
    color: "var(--muted)",
  },
} satisfies ChartConfig

type PieChartProportionProps = {
  proportion?: number
  start: 0 | 0.5
}

export const PieChartProportion = ({
  proportion,
  start,
}: PieChartProportionProps) => {
  const chartData = [
    { proportion: proportion ? start : 0, fill: "var(--color-half)" },
    {
      proportion: proportion ? proportion - start : 0,
      fill: "var(--color-proportion)",
    },
    {
      proportion: proportion ? 1 - proportion : 1,
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
          animationDuration={proportion ? 1000 : 0}
        >
          <Label
            value={proportion ? round(proportion * 100, 0) + "%" : "-"}
            fontSize={22}
            fontWeight={600}
            fill="black"
            dy={-10}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}
