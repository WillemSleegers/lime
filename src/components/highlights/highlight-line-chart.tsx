import { Line, LineChart, ResponsiveContainer, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

const data = [
  {
    revenue: 10400,
    subscription: 2016,
  },
  {
    revenue: 14405,
    subscription: 2017,
  },
  {
    revenue: 9400,
    subscription: 2018,
  },
  {
    revenue: 8200,
    subscription: 2019,
  },
  {
    revenue: 7000,
    subscription: 2020,
  },
  {
    revenue: 9600,
    subscription: 2021,
  },
  {
    revenue: 11244,
    subscription: 2022,
  },
  {
    revenue: 26475,
    subscription: 2023,
  },
]

export function HighlightLineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>15 papers</CardTitle>
        <CardDescription>3 published this year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[80px] w-[200px]">
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
                dataKey="revenue"
                style={{
                  stroke: "#3b82f6",
                }}
                dot={false}
              />
              <XAxis dataKey="subscription" className="text-xs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
