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
import { useEffect, useState } from "react"
import { WebR } from "webr"
import { jsonToDataframe, runMetaAnalysis } from "@/lib/r-functions"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterInput } from "./filters/input"
import { FilterSelectMultiple } from "./filters/select-multiple"

import data from "../assets/data/prepared-effects.json"

import {
  INTERVENTION_ASPECTS,
  OUTCOMES_BEHAVIORS,
  OUTCOMES_INTENTIONS,
  OUTCOMES_ATTITUDES,
} from "@/lib/constants"
import { selectOptions } from "@/lib/utils"

const interventionAspectsOptions = selectOptions(
  INTERVENTION_ASPECTS,
  INTERVENTION_ASPECTS
)
const outcomesBehaviorOptions = selectOptions(
  OUTCOMES_BEHAVIORS,
  OUTCOMES_BEHAVIORS
)
const outcomesIntentionsOptions = selectOptions(OUTCOMES_INTENTIONS, [])
const outcomesAttitudesOptions = selectOptions(OUTCOMES_ATTITUDES, [])

const outcomesOptions = outcomesBehaviorOptions.concat(
  outcomesIntentionsOptions,
  outcomesAttitudesOptions
)

const formSchema = z.object({
  outcomes: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome" }),
  interventionAspect: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention aspect" }),
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
  const [error, setError] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outcomes: outcomesOptions.filter((e) => e.checked).map((e) => e.label),
      interventionAspect: interventionAspectsOptions
        .filter((e) => e.checked)
        .map((e) => e.label),
      minimumCellSize: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let subset: typeof data

    const selectedSubCategories = values.outcomes.map((e: string) =>
      e.toLowerCase()
    )

    // Filter on outcome
    subset = data.filter((e) =>
      selectedSubCategories.includes(e.outcome_subcategory)
    )

    // Filter on cell size
    subset = subset.filter(
      (e) =>
        e.control_n > values.minimumCellSize &&
        e.intervention_n > values.minimumCellSize
    )

    // Filter on intervention aspect
    subset = subset.filter((e) => {
      return values.interventionAspect.some((aspect) =>
        e.intervention_aspect.includes(aspect.toLowerCase())
      )
    })

    if (subset.length == 0) {
      setError(true)
    } else {
      setError(false)
      setData(subset)

      setStatus("Running meta-analysis...")
      await jsonToDataframe(webR, subset, "data")
      const results = await runMetaAnalysis(webR)
      setEffect({ value: results[0], lower: results[1], upper: results[2] })

      setStatus("Ready")
    }
  }

  useEffect(() => {
    form.handleSubmit(onSubmit)
  }, [])

  return (
    <Collapsible
      className=" bg-gray-100 rounded-lg p-3"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1 m-1">
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
            <div>
              <h3 className="font-semibold text-xl">Outcomes</h3>
              <FilterSelectMultiple
                form={form}
                name="outcomes"
                groups={[
                  {
                    label: "Behavioral outcomes",
                    items: outcomesBehaviorOptions,
                  },
                  {
                    label: "Intentions outcomes",
                    items: outcomesIntentionsOptions,
                  },
                  {
                    label: "Attitudinal outcomes",
                    items: outcomesAttitudesOptions,
                  },
                ]}
              />
            </div>
            <div>
              <div>
                <h3 className="font-semibold text-xl">Outcomes</h3>
              </div>
              <div>
                <FilterSelectMultiple
                  form={form}
                  name="interventionAspect"
                  groups={[
                    {
                      label: "Intervention aspect",
                      items: interventionAspectsOptions,
                    },
                  ]}
                />
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
        {error && (
          <div className="text-red-500 text-sm ms-1 mt-2">
            No papers match these criteria
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
