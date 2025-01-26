"use client"

import { useEffect, useState } from "react"
import { Filters } from "@/components/filters"
import { Highlights } from "@/components/highlights/highlights"
import { Effect } from "@/components/effect"
import { ForestPlot } from "@/components/forest-plot"
import { PublicationBias } from "@/components/meta-analysis/publication-bias"

import allData from "../../assets/data/data.json"
import { WebR } from "webr"

const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")
  const [data, setData] = useState(allData)

  const [effect, setEffect] = useState({
    value: 0,
    lower: 0,
    upper: 0,
    egger_b: 0,
    egger_se: 0,
    egger_z: 0,
    egger_p: 0,
  })
  const [webR, setWebR] = useState<WebR>()

  useEffect(() => {
    const initializeR = async () => {
      console.log("Initializing...")
      const newWebR = new WebR()
      setWebR(newWebR)

      await newWebR.init()

      setStatus("Installing packages...")
      await newWebR.installPackages(["metafor"])
      await newWebR.installPackages(["clubSandwich"])

      setStatus("Ready")
    }
    initializeR()
  }, [])

  return (
    <main className="m-auto max-w-(--breakpoint-lg)">
      <div className="m-3">
        <div className="my-5">
          <span className="font-semibold">Status:</span> {status}
        </div>
        <Filters
          webR={webR}
          setData={setData}
          setEffect={setEffect}
          status={status}
          setStatus={setStatus}
        />
        <Highlights data={data} />
        <Effect effect={effect} />
        <PublicationBias
          data={data}
          effect={effect.value}
          egger_b={effect.egger_b}
          egger_se={effect.egger_se}
          egger_z={effect.egger_z}
          egger_p={effect.egger_p}
        />
        <ForestPlot data={data} />
      </div>
    </main>
  )
}

export default MetaAnalysis
