import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type HighlightPercentageProps = {
  title: string
  description: string
  percentage: number
}

export const HighlightPercentage = (props: HighlightPercentageProps) => {
  const { title, description, percentage } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[80px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[{ value: 1 - percentage }, { value: percentage }]}
                dataKey="value"
                startAngle={-270}
              >
                <Cell key={`cell-${0}`} fill="#eee" />
                <Cell key={`cell-${1}`} fill="#3b82f6" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
