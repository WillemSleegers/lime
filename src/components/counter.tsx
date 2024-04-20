"use client"

import { useState, useEffect } from "react"

type CounterProps = {
  initialValue: number
  targetValue: number
}

export const Counter = (props: CounterProps) => {
  const { initialValue, targetValue } = props

  const [count, setCount] = useState(initialValue)
  const duration = (1000 / targetValue) * 10

  useEffect(() => {
    let startValue = initialValue
    const interval = Math.floor(duration / (targetValue - initialValue))

    const counter = setInterval(() => {
      startValue += 1
      setCount(startValue)
      if (startValue >= targetValue) {
        clearInterval(counter)
      }
    }, interval)

    return () => {
      clearInterval(counter)
    }
  }, [targetValue, initialValue])

  return <span>{count}</span>
}
