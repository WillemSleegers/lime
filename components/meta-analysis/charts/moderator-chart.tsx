import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  ErrorBar,
  ReferenceLine,
  ZAxis,
} from "recharts"
import { round } from "@/lib/utils"
import { ModeratorLevel } from "@/lib/types"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"

type ModeratorChartProps = {
  levels: ModeratorLevel[]
}

export const ModeratorChart = ({ levels }: ModeratorChartProps) => {
  const plotData = [...levels].sort((a, b) => a.estimate - b.estimate).map((level) => ({
    name: level.label,
    value: level.estimate,
    error: [
      round(Math.abs(level.estimate - level.lower), 3),
      round(Math.abs(level.estimate - level.upper), 3),
    ],
    summary: `${round(level.estimate, 2)} [${round(level.lower, 2)}; ${round(level.upper, 2)}]`,
  }))

  const allLower = levels.map((l) => l.lower)
  const allUpper = levels.map((l) => l.upper)
  const dataMin = Math.min(0, ...allLower)
  const dataMax = Math.max(0, ...allUpper)
  const range = dataMax - dataMin
  const padding = range * 0.1
  const xMin = dataMin - padding
  const xMax = dataMax + padding

  const rawInterval = range / 4
  let tickInterval: number
  if (rawInterval <= 0.25) tickInterval = 0.25
  else if (rawInterval <= 0.5) tickInterval = 0.5
  else if (rawInterval <= 1) tickInterval = 1
  else if (rawInterval <= 2) tickInterval = 2
  else tickInterval = Math.ceil(rawInterval)

  const firstTick = Math.ceil(xMin / tickInterval) * tickInterval
  const lastTick = Math.floor(xMax / tickInterval) * tickInterval
  const xTicks: number[] = []
  for (let tick = firstTick; tick <= lastTick; tick += tickInterval) {
    xTicks.push(Number(tick.toFixed(2)))
  }
  if (!xTicks.includes(0)) {
    xTicks.push(0)
    xTicks.sort((a, b) => a - b)
  }

  const longestLabel = plotData.reduce(
    (a, b) => (a.name.length > b.name.length ? a : b),
    plotData[0],
  ).name

  const chartConfig = {
    moderator: { label: "Moderator", color: "var(--chart-1)" },
  } satisfies ChartConfig

  const height = Math.max(150, 60 * levels.length)

  return (
    <Card>
      <CardContent style={{ height }}>
        <ChartContainer config={chartConfig} className="h-full aspect-auto">
          <ScatterChart
            data={plotData}
            margin={{ bottom: 20, left: 0, right: 20, top: 5 }}
          >
            <CartesianGrid
              horizontal={false}
              className="fill-muted"
              verticalValues={xTicks}
            />
            <XAxis
              dataKey="value"
              type="number"
              label={{
                value: "Effect size (Cohen's d)",
                dy: 20,
                className: "fill-foreground",
              }}
              domain={[xMin, xMax]}
              ticks={xTicks}
            />
            <YAxis
              yAxisId="left"
              dataKey="name"
              type="category"
              interval={0}
              width={longestLabel.length * 11}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            />
            <ZAxis range={[40, 41]} />
            <Scatter yAxisId="left" className="fill-primary stroke-primary stroke-[1.5]">
              <ErrorBar
                dataKey="error"
                direction="x"
                strokeWidth={2}
                width={5}
                className="stroke-primary"
              />
            </Scatter>
            <ReferenceLine
              yAxisId="left"
              x={0}
              strokeWidth={2}
              className="stroke-muted-foreground"
              strokeDasharray="3 3"
            />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
