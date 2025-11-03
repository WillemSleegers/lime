"use client"

import { useEffect, useRef, useState } from "react"
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
  const [yAxisWidth, setYAxisWidth] = useState(100)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate dynamic height: 25px per bar (more compact) + padding
  const height = Math.max(150, data.length * 25 + 40)

  // Calculate Y-axis width based on container width and text content
  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth

        // Measure actual text width
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        if (context) {
          context.font = '11px sans-serif'
          const widths = data.map(d => context.measureText(d.name).width)
          const maxTextWidth = Math.max(...widths)

          // Use a percentage of container width, but ensure it fits the text
          // Allocate 20-30% of container width for labels, bounded by text needs
          const percentageWidth = containerWidth * 0.25
          const minNeeded = maxTextWidth + 10

          setYAxisWidth(Math.max(minNeeded, Math.min(percentageWidth, 300)))
        }
      }
    }

    calculateWidth()

    // Recalculate on window resize
    window.addEventListener('resize', calculateWidth)
    return () => window.removeEventListener('resize', calculateWidth)
  }, [data])

  return (
    <ChartContainer ref={containerRef} config={chartConfig} className="w-full overflow-visible" style={{ height: `${height}px` }}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 4,
          right: 20,
          top: 8,
          bottom: 20,
        }}
        barSize={16}
      >
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={yAxisWidth}
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
