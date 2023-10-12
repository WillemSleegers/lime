import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Scatter,
  ErrorBar,
  Tooltip,
} from "recharts"

type ForestPlotProps = {
  data: {
    name: string
    errorX: number[]
    x: number
  }[]
}

export const ForestPlot = (props: ForestPlotProps) => {
  const { data } = props

  return (
    <ResponsiveContainer height={30 * data.length} width="100%">
      <ScatterChart
        data={data}
        margin={{
          bottom: 5,
          left: 20,
          right: 20,
          top: 5,
        }}
      >
        <CartesianGrid
          horizontalFill={[]}
          horizontalPoints={[]}
          verticalFill={[]}
          verticalPoints={[]}
        />
        <XAxis
          dataKey="x"
          type="number"
          domain={[-3, 3]}
          ticks={[-3, -2, -1, 0, 1, 2, 3]}
        />
        <YAxis yAxisId="left" dataKey="name" type="category" width={240} />
        <YAxis
          yAxisId="right"
          dataKey="x"
          type="category"
          orientation="right"
        />
        <Tooltip />
        <Scatter shape="square" fill="black" yAxisId="left">
          <ErrorBar dataKey="errorX" direction="x" strokeWidth={2} width={0} />
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}
