import { useEffect, useState, useRef } from "react"
import * as d3 from "d3"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { dataProps } from "@/lib/json-functions"

type ForestPlotProps = {
  data: dataProps
}

export const ForestPlotD3 = (props: ForestPlotProps) => {
  const data = d3.ticks(-2, 2, 200).map(Math.sin)

  const width = 640
  const height = 400
  const marginTop = 20
  const marginRight = 20
  const marginBottom = 30
  const marginLeft = 40

  const [open, setOpen] = useState(true)
  const gx = useRef(null)
  const gy = useRef(null)
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight]
  )
  const y = d3.scaleLinear(d3.extent(data) as any, [
    height - marginBottom,
    marginTop,
  ])
  const line = d3.line((d, i) => x(i), y)
  useEffect(
    () => void d3.select(gx.current).call(d3.axisBottom(x) as any),
    [gx, x]
  )
  useEffect(
    () => void d3.select(gy.current).call(d3.axisLeft(y) as any),
    [gy, y]
  )

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="mb-3">
        <div className="space-y-0.5">
          <div className="flex flex-row items-center gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Forest plot</h2>
            <ChevronRight
              className={cn("transition", open ? "rotate-90" : "rotate-0")}
            />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <svg width={width} height={height}>
          <g ref={gx} transform={`translate(0,${height - marginBottom})`} />
          <g ref={gy} transform={`translate(${marginLeft},0)`} />
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            d={line(data)}
          />
          <g fill="white" stroke="currentColor" stroke-width="1.5">
            {data.map((d, i) => (
              <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
            ))}
          </g>
        </svg>
      </CollapsibleContent>
    </Collapsible>
  )
}
