"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
import { WebR } from "webr"
import { jsonToDataframe, runMetaAnalysis } from "@/lib/r-functions"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterInput } from "./filters/input"
import { FilterSelectMultiple } from "./filters/select-multiple"

import data from "../assets/data/prepared-effects.json"

const outcomesBehavior = [
  ...new Set(
    data
      .filter((column) => column.outcome_category == "behavior")
      .map((column) => column.outcome_subcategory)
  ),
].map((e) => {
  return {
    id: e!.toString().toLowerCase(),
    label: e!.toString(),
    checked: true,
  }
})

const outcomesIntentions = [
  ...new Set(
    data
      .filter((column) => column.outcome_category == "intentions")
      .map((column) => column.outcome_subcategory)
  ),
].map((e) => {
  return {
    id: e!.toString().toLowerCase(),
    label: e!.toString(),
    checked: false,
  }
})

const outcomesAttitudes = [
  ...new Set(
    data
      .filter((column) => column.outcome_category == "attitudes/beliefs")
      .map((column) => column.outcome_subcategory)
  ),
].map((e) => {
  return {
    id: e!.toString().toLowerCase(),
    label: e!.toString(),
    checked: false,
  }
})

const formSchema = z.object({
  outcomesBehavior: z.any(),
  outcomesIntentions: z.any(),
  outcomesAttitudes: z.any(),
  minimumCellSize: z.coerce.number().min(1).max(1000),
})

type FiltersProps = {
  setData: Function
  setEffect: Function
  setStatus: Function
  webR: WebR
}

export const Filters = (props: FiltersProps) => {
  const { setData, setEffect, setStatus, webR } = props

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outcomesBehavior: outcomesBehavior.map((e) => e.label),
      outcomesIntentions: outcomesIntentions.map((e) => e.label),
      outcomesAttitudes: outcomesAttitudes.map((e) => e.label),
      minimumCellSize: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let subset

    const selectedSubCategories = values.outcomesBehavior.concat(
      values.outcomesIntentions,
      values.outcomesAttitudes
    )

    subset = data.filter((e) =>
      selectedSubCategories.includes(e.outcome_subcategory)
    )

    subset = subset.filter(
      (e) =>
        e.control_n > values.minimumCellSize &&
        e.intervention_n > values.minimumCellSize
    )

    setData(subset)

    setStatus("Running meta-analysis...")
    await jsonToDataframe(webR, subset, "data")
    const results = await runMetaAnalysis(webR)
    setEffect({ value: results[0], lower: results[1], upper: results[2] })

    setStatus("Ready")
  }

  return (
    <Collapsible
      className=" bg-gray-100 rounded-lg p-3"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 m-1"
          >
            <div className="flex gap-6">
              <div>
                <h3 className="font-semibold">Outcomes</h3>
                <div className="flex flex-wrap gap-3">
                  <FilterSelectMultiple
                    form={form}
                    name="outcomesBehavior"
                    label="Behavioral outcomes"
                    items={outcomesBehavior}
                  />
                  <FilterSelectMultiple
                    form={form}
                    name="outcomesIntentions"
                    label="Intentions outcomes"
                    items={outcomesIntentions}
                  />
                  <FilterSelectMultiple
                    form={form}
                    name="outcomesAttitudes"
                    label="Attitudinal outcomes"
                    items={outcomesAttitudes}
                  />
                </div>
              </div>
            </div>
            <FilterInput
              form={form}
              name="minimumCellSize"
              label="Minimum cell size"
              description="This is the minimum cell size in either the control or intervention condition."
              placeholder="1"
              type="number"
            />
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  )
}
