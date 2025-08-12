import React, { useState, useEffect } from "react"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Data } from "@/lib/types"

// Constants
const ADAPTIVE_CONSTANTS = {
  DATA_TO_BINS_RATIO: 5,
  MIN_BINS: 8,
  MAX_BINS: 40,
  DOT_SIZE_FACTOR: 660, // Calibrated for ~50 dot size at 174 data points
  MIN_DOT_SIZE: 25,
  MAX_DOT_SIZE: 100,
  MAX_DISPLAY_TICKS: 10,
} as const

type DotData = {
  x: number
  y: number
  originalValue: number
  paperLabel: string
  binRange: string
}


type DotPlotProps = {
  data?: Data
}

const DotPlotExample = ({ data }: DotPlotProps) => {
  const [open, setOpen] = useState(false)

  // Extract values for bin calculation
  const rawData = data?.map(d => d.effect_size) || []

  // Calculate adaptive defaults based on data size
  const getAdaptiveDefaults = (dataSize: number) => {
    if (dataSize === 0) return { bins: ADAPTIVE_CONSTANTS.MIN_BINS, size: 50, jitter: 0 }

    const adaptiveBins = Math.min(
      Math.max(Math.ceil(dataSize / ADAPTIVE_CONSTANTS.DATA_TO_BINS_RATIO), ADAPTIVE_CONSTANTS.MIN_BINS),
      ADAPTIVE_CONSTANTS.MAX_BINS
    )

    const adaptiveSize = Math.max(
      ADAPTIVE_CONSTANTS.MIN_DOT_SIZE,
      Math.min(ADAPTIVE_CONSTANTS.MAX_DOT_SIZE, ADAPTIVE_CONSTANTS.DOT_SIZE_FACTOR / Math.sqrt(dataSize))
    )

    return {
      bins: adaptiveBins,
      size: Math.round(adaptiveSize),
      jitter: 0,
    }
  }

  const [binCount, setBinCount] = useState(8)
  const [dotSize, setDotSize] = useState(50)
  const [jitterAmount, setJitterAmount] = useState(0)
  
  // Debounced values for actual rendering
  const [debouncedBinCount, setDebouncedBinCount] = useState(8)
  const [debouncedDotSize, setDebouncedDotSize] = useState(50)
  const [debouncedJitterAmount, setDebouncedJitterAmount] = useState(0)

  // Update defaults when data changes
  useEffect(() => {
    const defaults = getAdaptiveDefaults(rawData.length)
    setBinCount(defaults.bins)
    setDotSize(defaults.size)
    setJitterAmount(defaults.jitter)
    // Also update debounced values immediately for data changes
    setDebouncedBinCount(defaults.bins)
    setDebouncedDotSize(defaults.size)
    setDebouncedJitterAmount(defaults.jitter)
  }, [rawData.length])
  
  // Debounce slider changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBinCount(binCount)
    }, 150)
    return () => clearTimeout(timer)
  }, [binCount])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedDotSize(dotSize)
    }, 100)
    return () => clearTimeout(timer)
  }, [dotSize])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJitterAmount(jitterAmount)
    }, 100)
    return () => clearTimeout(timer)
  }, [jitterAmount])

  const CustomDot = (props: { cx?: number; cy?: number }) => {
    const { cx, cy } = props
    return (
      <circle
        cx={cx}
        cy={cy}
        r={debouncedDotSize / 10}
        className="fill-primary stroke-primary"
      />
    )
  }

  // Process data for plotting
  const dotData: DotData[] = []
  let binBoundaries: number[] = []
  let maxY = 1

  if (rawData.length > 0) {
    // Calculate bin parameters
    const min = Math.min(...rawData)
    const max = Math.max(...rawData)
    const binWidth = (max - min) / debouncedBinCount

    // Create bin structure
    const bins = Array.from({ length: debouncedBinCount }, (_, i) => ({
      binStart: min + i * binWidth,
      binEnd: min + (i + 1) * binWidth,
      binCenter: min + (i + 0.5) * binWidth,
    }))

    // Track position in each bin
    const binPositions = Array(debouncedBinCount).fill(0)

    // Process each data point
    data!.forEach((datum) => {
      const value = datum.effect_size
      const binIndex = Math.min(Math.floor((value - min) / binWidth), debouncedBinCount - 1)
      const bin = bins[binIndex]
      
      // Get position in this bin
      const positionInBin = binPositions[binIndex]
      binPositions[binIndex]++
      
      // Calculate jitter
      const direction = positionInBin % 2 === 0 ? -1 : 1
      const jitter = direction * ((debouncedJitterAmount * binWidth) / 2)
      
      const y = positionInBin + 1
      maxY = Math.max(maxY, y)
      
      dotData.push({
        x: bin.binCenter + jitter,
        y,
        originalValue: value,
        paperLabel: datum.paper_label,
        binRange: `${bin.binStart.toFixed(1)} - ${bin.binEnd.toFixed(1)}`,
      })
    })

    // Generate display ticks
    const allBoundaries = [...bins.map((bin) => bin.binStart), bins[bins.length - 1].binEnd]
    const skipInterval = Math.max(1, Math.floor(debouncedBinCount / ADAPTIVE_CONSTANTS.MAX_DISPLAY_TICKS))
    binBoundaries = allBoundaries.filter((_, i) => i % skipInterval === 0)
  }
  
  const yAxisTicks = Array.from({ length: maxY + 2 }, (_, i) => i)

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{
      payload: {
        originalValue: number
        paperLabel: string
        binRange: string
        y: number
      }
    }>
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-sm text-xs">
          <p className="font-medium">
            <span className="text-muted-foreground">Paper:</span>{" "}
            {data.paperLabel}
          </p>
          <p className="font-medium">
            <span className="text-muted-foreground">Effect Size:</span>{" "}
            {data.originalValue.toFixed(3)}
          </p>
          <p className="font-medium">
            <span className="text-muted-foreground">Bin:</span> {data.binRange}
          </p>
          <p className="font-medium">
            <span className="text-muted-foreground">Position in bin:</span>{" "}
            {data.y}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Dot plot</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <div className="py-5 space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <Label htmlFor="bins-slider" className="text-sm font-medium">
                Bins:
              </Label>
              <Slider
                id="bins-slider"
                value={[binCount]}
                onValueChange={(value) => setBinCount(value[0])}
                max={50}
                min={5}
                step={1}
                className="w-32"
              />
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {binCount}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="dot-size-slider" className="text-sm font-medium">
                Dot Size:
              </Label>
              <Slider
                id="dot-size-slider"
                value={[dotSize]}
                onValueChange={(value) => setDotSize(value[0])}
                max={100}
                min={25}
                step={1}
                className="w-32"
              />
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {dotSize}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Label htmlFor="jitter-slider" className="text-sm font-medium">
                Jitter:
              </Label>
              <Slider
                id="jitter-slider"
                value={[jitterAmount * 100]}
                onValueChange={(value) => setJitterAmount(value[0] / 100)}
                max={50}
                min={0}
                step={5}
                className="w-32"
              />
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {Math.round(jitterAmount * 100)}%
              </span>
            </div>
          </div>

          {/* Chart */}
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[
                    binBoundaries[0],
                    binBoundaries[binBoundaries.length - 1],
                  ]}
                  name="Value"
                  ticks={binBoundaries}
                  tickFormatter={(value) => value.toFixed(1)}
                  className="text-xs"
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[0, maxY + 1]}
                  name="Count"
                  ticks={yAxisTicks}
                  tickFormatter={(value) => value.toFixed(0)}
                  className="text-xs"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Scatter
                  name="Data Points"
                  data={dotData}
                  shape={<CustomDot />}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default DotPlotExample
