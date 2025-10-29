"use client"

import { useState, useEffect } from "react"

type CounterProps = {
  duration: number
  target: number
}

const easeOutQuad = (t: number) => t * (2 - t)
const frameDuration = 1000 / 60

export const Counter = ({ duration, target }: CounterProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let frame = 0
    const totalFrames = Math.round(duration / frameDuration)
    const counter = setInterval(() => {
      frame++
      const progress = easeOutQuad(frame / totalFrames)
      setCount(Math.round(target * progress))

      if (frame === totalFrames) {
        clearInterval(counter)
      }
    }, frameDuration)
  }, [duration, target])

  return count
}
