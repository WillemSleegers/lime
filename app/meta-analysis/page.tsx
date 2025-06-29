"use client"

import { WebR } from "webr"
import { useEffect, useState } from "react"

import { Effect } from "@/components/meta-analysis/effect"
import { Button } from "@/components/ui/button"
import { ForestPlot } from "@/components/meta-analysis/forest-plot"
import { RCode } from "@/components/meta-analysis/R-code"
import { Filters } from "@/components/meta-analysis/filters"
import { Highlights } from "@/components/meta-analysis/highlights"
import { PublicationBias } from "@/components/meta-analysis/publication-bias"

import { runMetaAnalysis } from "@/lib/r-functions"

import allData from "../../assets/data/data.json"
import codebook from "@/assets/data/codebook.json"

const handleDownload = (data: Record<string, unknown>[], fileName: string) => {
  if (data.length === 0) {
    console.warn("No data to download")
    return
  }

  // Extract column names
  const columnNames: string[] = []
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (!columnNames.includes(key)) {
        columnNames.push(key)
      }
    })
  })

  // Loop over the data and extract values for each column
  const rowsData: string[] = []

  data.forEach((row: Record<string, unknown>) => {
    const rowData: string[] = []
    columnNames.forEach((columnName: string) => {
      const value = String(row[columnName] || "")
      // Escape commas, quotes, and newlines
      const escapedValue =
        value.includes(",") || value.includes('"') || value.includes("\n")
          ? `"${value.replace(/"/g, '""')}"`
          : value
      rowData.push(escapedValue)
    })
    rowsData.push(rowData.join(","))
  })

  const text = columnNames.join(",") + "\n" + rowsData.join("\n")
  const element = document.createElement("a")
  element.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(text)
  )
  element.setAttribute("download", fileName)
  element.style.display = "none"
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")
  const [data, setData] = useState(allData)
  const [disableForm, setDisableForm] = useState(true)

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
      const newWebR = new WebR()
      setWebR(newWebR)

      await newWebR.init()

      setStatus("Installing packages...")
      await newWebR.installPackages(["metafor"])
      await newWebR.installPackages(["clubSandwich"])
      setDisableForm(false)
    }
    initializeR()
  }, [])

  useEffect(() => {
    const analyze = async (data: any) => {
      if (webR && data) {
        setStatus("Running meta-analysis...")
        setEffect({
          value: 0,
          lower: 0,
          upper: 0,
          egger_b: 0,
          egger_se: 0,
          egger_z: 0,
          egger_p: 0,
        })
        console.log("Running meta-analysis")
        const subset = data.map((e: any) =>
          (({
            effect_size,
            effect_size_var,
            effect_size_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }) => ({
            effect_size,
            effect_size_var,
            effect_size_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }))(e)
        )

        const df = await new webR.RObject(subset)
        await webR.objs.globalEnv.bind("data", df)
        const results = await runMetaAnalysis(webR)

        setEffect({
          value: results[0],
          lower: results[1],
          upper: results[2],
          egger_b: results[3],
          egger_se: results[4],
          egger_z: results[5],
          egger_p: results[6],
        })
        setStatus("Ready")
      }
    }
    analyze(data)
  }, [data])

  return (
    <main className="mx-auto w-full flex flex-col gap-1 max-w-4xl mb-12 p-2">
      <div className="py-3">
        <span className="font-semibold">Status:</span> {status}
      </div>
      <Filters setData={setData} disabled={disableForm} />
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
      <div className="p-3 flex justify-center gap-3">
        <RCode />
        <Button
          variant="secondary"
          className="rounded-2xl"
          onClick={() => handleDownload(data, "lime-data.csv")}
        >
          Download data
        </Button>
        <Button
          variant="secondary"
          className="rounded-2xl"
          onClick={() => handleDownload(codebook, "codebook.csv")}
        >
          Download codebook
        </Button>
      </div>
    </main>
  )
}

export default MetaAnalysis
