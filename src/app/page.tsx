"use client"

import { useState, useEffect } from "react"
import { WebR } from "webr"

const webR = new WebR({
  baseUrl: "./node_modules/webr/dist/",
})

async function getRandomNumbers() {
  await webR.init()
  const result = await webR.evalR("rnorm(20,10,10)")
  try {
    return await result.toArray()
  } finally {
    webR.destroy(result)
  }
}

export default function Home() {
  const [values, updateResult] = useState(["Loading webR..."])
  useEffect(() => {
    ;(async () => {
      const values = await getRandomNumbers()
      updateResult(values)
    })()
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center">
      <h1>Meta-analysis</h1>
      <p className="">{values.join(", ")}</p>
    </main>
  )
}
