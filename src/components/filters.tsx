"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { getData, getUniqueColumnValues } from "@/lib/json-functions"
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

const formSchema = z.object({
  outcomes: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one outcome.",
  }),
  minimumCellSize: z.coerce.number().min(1).max(1000),
})

const outcomes = getUniqueColumnValues("outcome_category").map((e) => {
  return { id: e!.toString().toLowerCase(), label: e!.toString() }
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
      outcomes: outcomes.map((e) => e.label),
      minimumCellSize: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let data

    data = getData({
      outcomes: values.outcomes,
    })

    data = data.filter(
      (e) =>
        e.control_n > values.minimumCellSize &&
        e.intervention_n > values.minimumCellSize
    )

    setData(data)

    setStatus("Running meta-analysis...")
    await jsonToDataframe(webR, data, "data")
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mt-3 flex gap-6">
              <FilterSelectMultiple
                form={form}
                name="outcomes"
                label="Outcomes"
                description="Select the outcomes you want to include in the
                meta-analysis."
                items={outcomes}
              />

              <FilterInput
                form={form}
                name="minimumCellSize"
                label="Minimum cell size"
                description="This is the minimum cell size in either the control or intervention condition."
                placeholder="1"
                type="number"
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  )
}
