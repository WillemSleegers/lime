"use client"

import { WebR } from "webr"
import { useState, useEffect } from "react"

const webR = new WebR({ serviceWorkerUrl: "/" })

async function getRandomNumbers() {
  await webR.init()
  const result = await webR.evalR("rnorm(25,10,10)")
  try {
    return await result.toArray()
  } finally {
    webR.destroy(result)
  }
}

export default function Test() {
  const [values, updateResult] = useState(["Loading webR..."])
  useEffect(() => {
    ;(async () => {
      const values = await getRandomNumbers()
      updateResult(values)
    })()
  }, [])
  return <div>{values.join(", ")}</div>
}
