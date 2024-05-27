import { round } from "@/lib/utils"
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts"

type ChartHalfPieProps = {
  proportion: number
  start: 0 | 0.5
}

export const ChartHalfPie = (props: ChartHalfPieProps) => {
  const { proportion, start } = props

  const p = round(proportion, 2)

  const data =
    start == 0
      ? [
          { name: "Group A", value: p },
          { name: "Group B", value: 1 - p },
        ]
      : [
          { name: "Group A", value: 0.5 },
          { name: "Group B", value: p - 0.5 },
          { name: "Group C", value: 0.5 - (p - 0.5) },
        ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ bottom: -100 }}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={50}
          fill="#8884d8"
        >
          <Label
            className="text-xl"
            value={round(proportion * 100, 1) + "%"}
            position="center"
            dy={-15}
          />
          {start == 0 ? (
            <>
              <Cell fill="#16A34A" />
              <Cell fill="#efefef" />
            </>
          ) : (
            <>
              <Cell fill="#efefef" />
              <Cell fill="#16A34A" />
              <Cell fill="#efefef" />
            </>
          )}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
