"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"

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

type RadialChartProportionProps = {
  proportion: number
  start: 0 | 0.5
}

export const RadialChartProportion = ({
  proportion,
  start,
}: RadialChartProportionProps) => {
  const chartData = [
    {
      start: start,
      proportion: proportion - start,
      remainder: 1 - proportion,
    },
  ]
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[250px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={180}
        endAngle={0}
        innerRadius={80}
        outerRadius={150}
      >
        <PolarRadiusAxis
          tick={false}
          tickLine={false}
          axisLine={false}
          domain={[0, 1]}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - 12}
                      className="fill-foreground text-2xl font-bold"
                    >
                      57%
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>

        <RadialBar
          dataKey="start"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-half)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="proportion"
          stackId="a"
          cornerRadius={5}
          fill="var(--color-proportion)"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="remainder"
          fill="var(--color-remainder)"
          stackId="a"
          cornerRadius={5}
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  )
}
