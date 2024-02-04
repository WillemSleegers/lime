import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

type HighlightLineChartProps = {
  title: string
  description: string
  data: {
    x: string
    y: number
  }[]
  classname?: string
}

export function HighlightLineChart(props: HighlightLineChartProps) {
  const { title, description, data, classname } = props

  return (
    <Card className={classname}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <Line
                type="monotone"
                strokeWidth={2}
                dataKey="y"
                style={{
                  stroke: "#16A34A",
                }}
                dot={false}
              />
              <XAxis dataKey="x" className="text-xs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
