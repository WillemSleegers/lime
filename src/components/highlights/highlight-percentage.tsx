import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type HighlightPercentageProps = {
  title: string
  percentage: number
}

export const HighlightPercentage = (props: HighlightPercentageProps) => {
  const { title, percentage } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: -10, left: -10, right: -10, bottom: -10 }}>
              <Pie
                data={[{ value: 1 - percentage }, { value: percentage }]}
                dataKey="value"
                startAngle={-270}
                innerRadius={35}
              >
                <Cell key={`cell-${0}`} fill="#eee" />
                <Cell key={`cell-${1}`} fill="#16A34A" />
                <Label
                  value={Math.round(percentage * 100) + "%"}
                  position="center"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
