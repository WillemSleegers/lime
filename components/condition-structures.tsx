const COLORS = {
  a1: "oklch(0.82 0.08 245)",
  a2: "oklch(0.55 0.13 250)",
  b1: "oklch(0.87 0.06 55)",
  b2: "oklch(0.6 0.16 42)",
}

type NodeSpec = {
  x: number
  y: number
  color: string
  group: string
  time?: string
  labelBelow?: boolean
}

const LEFT = 62
const RIGHT = 138
const TOP = 62
const BOTTOM = 122
const R = 17

function Node({ x, y, color, group, time, labelBelow }: NodeSpec) {
  const lines = time ? [group, time] : [group]
  const labelY = labelBelow ? y + R + 16 : y - R - 16 - (lines.length - 1) * 12

  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={R}
        fill={color}
        stroke="currentColor"
        strokeWidth={1.5}
        className="text-foreground/60"
      />
      <text
        x={x}
        y={labelY}
        textAnchor="middle"
        fontSize={11}
        fill="currentColor"
        className="text-foreground"
      >
        {lines.map((line, i) => (
          <tspan key={line} x={x} dy={i === 0 ? 0 : 12}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

function Link({
  from,
  to,
}: {
  from: { x: number; y: number }
  to: { x: number; y: number }
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke="currentColor"
      strokeWidth={1.5}
      className="text-foreground/60"
    />
  )
}

function Panel({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="text-center text-sm font-semibold">{title}</p>
      <svg
        viewBox="0 0 200 184"
        className="w-full"
        role="img"
        aria-label={`${title}: ${description}`}
      >
        {children}
      </svg>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

export function ConditionStructures() {
  return (
    <figure className="my-6 space-y-4 rounded-lg border p-4 md:p-6">
      <figcaption className="text-sm font-medium">
        Condition assignment structures
      </figcaption>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Panel
          title="Between"
          description="Different groups of participants provide data for the different conditions."
        >
          <Node x={100} y={TOP} color={COLORS.a1} group="Group A" />
          <Node
            x={100}
            y={BOTTOM}
            color={COLORS.b1}
            group="Group B"
            labelBelow
          />
        </Panel>

        <Panel
          title="Within"
          description="One group of participants provides data at two time points."
        >
          <Link from={{ x: LEFT, y: TOP }} to={{ x: RIGHT, y: TOP }} />
          <Node
            x={LEFT}
            y={TOP}
            color={COLORS.a1}
            group="Group A"
            time="Time 1"
          />
          <Node
            x={RIGHT}
            y={TOP}
            color={COLORS.a2}
            group="Group A"
            time="Time 2"
          />
        </Panel>

        <Panel
          title="Crossover"
          description="Both groups experience both conditions, in a different order."
        >
          <Link from={{ x: LEFT, y: TOP }} to={{ x: RIGHT, y: BOTTOM }} />
          <Link from={{ x: LEFT, y: BOTTOM }} to={{ x: RIGHT, y: TOP }} />
          <Node
            x={LEFT}
            y={TOP}
            color={COLORS.a1}
            group="Group A"
            time="Time 1"
          />
          <Node
            x={RIGHT}
            y={TOP}
            color={COLORS.b2}
            group="Group B"
            time="Time 2"
          />
          <Node
            x={LEFT}
            y={BOTTOM}
            color={COLORS.b1}
            group="Group B"
            time="Time 1"
            labelBelow
          />
          <Node
            x={RIGHT}
            y={BOTTOM}
            color={COLORS.a2}
            group="Group A"
            time="Time 2"
            labelBelow
          />
        </Panel>

        <Panel
          title="Mixed"
          description="Different groups of participants each provide data at two time points."
        >
          <Link from={{ x: LEFT, y: TOP }} to={{ x: RIGHT, y: TOP }} />
          <Link from={{ x: LEFT, y: BOTTOM }} to={{ x: RIGHT, y: BOTTOM }} />
          <Node
            x={LEFT}
            y={TOP}
            color={COLORS.a1}
            group="Group A"
            time="Time 1"
          />
          <Node
            x={RIGHT}
            y={TOP}
            color={COLORS.a2}
            group="Group A"
            time="Time 2"
          />
          <Node
            x={LEFT}
            y={BOTTOM}
            color={COLORS.b1}
            group="Group B"
            time="Time 1"
            labelBelow
          />
          <Node
            x={RIGHT}
            y={BOTTOM}
            color={COLORS.b2}
            group="Group B"
            time="Time 2"
            labelBelow
          />
        </Panel>
      </div>
    </figure>
  )
}
