import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts"

type ChartPercentageProps = {
  percentage: number
}

export const ChartPercentage = (props: ChartPercentageProps) => {
  const { percentage } = props

  return (
    <ResponsiveContainer>
      <PieChart margin={{ top: -10, left: -10, right: -10, bottom: -10 }}>
        <Pie
          data={[{ value: 100 - percentage }, { value: percentage }]}
          dataKey="value"
          startAngle={-270}
          innerRadius={25}
        >
          <Cell key={`cell-${0}`} fill="#eee" />
          <Cell key={`cell-${1}`} fill="#16A34A" />
          <Label
            className="text-base"
            value={percentage + "%"}
            position="center"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
