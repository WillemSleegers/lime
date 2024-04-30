import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

type ChartPercentageBarProps = {
  percentage: number
}

export const ChartPercentageBar = (props: ChartPercentageBarProps) => {
  const { percentage } = props

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        margin={{ top: 0, bottom: 0, left: 20, right: 20 }}
        layout="vertical"
        data={[{ x: percentage, name: "group" }]}
      >
        <Bar dataKey="x" fill="#16A34A" background />
        <XAxis type="number" domain={[-100, 100]} ticks={[-100, 0, 100]} />
        <YAxis dataKey="name" type="category" hide />
      </BarChart>
    </ResponsiveContainer>
  )
}
