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
import { runMetaAnalysis } from "@/lib/r-functions"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterInput } from "./filters/input"
import { FilterSelectMultiple } from "./filters/select-multiple"

import data from "../assets/data/prepared-effects.json"

import {
  OUTCOMES_INTENTIONS,
  OUTCOMES_ATTITUDES,
  OUTCOME_MEASUREMENTS,
  INTERVENTION_ASPECTS,
  INTERVENTION_MEDIA,
  INTERVENTION_APPEALS,
  COUNTRIES,
} from "@/lib/constants"
import { selectOptions } from "@/lib/utils"
import { getOptions, getUniqueColumnValues } from "@/lib/json-functions"

// Outcome options
const outcomesBehaviorOptions = getOptions("behaviors")
const outcomesIntentionsOptions = getOptions("intentions")
const outcomesAttitudesOptions = getOptions("attitudes")
const outcomesOptions = getOptions("outcome_subcategory")
const outcomeMeasurementsOptions = getOptions("outcome_measurement_type")
const interventionAspectsOptions = getOptions("intervention_aspect")
const interventionMediaOptions = getOptions("intervention_medium")
const interventionAppealsOptions = getOptions("intervention_appeal")
const countriesOptions = getOptions("intervention_sample_country")

const formSchema = z.object({
  outcomes: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome" }),
  outcomeMeasurements: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome measurement" }),
  interventionAspect: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention aspect" }),
  interventionMedium: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention medium" }),
  interventionAppeal: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention appeal" }),
  countries: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one country" }),
  minimumCellSize: z.coerce.number().min(1).max(1000),
})

type FiltersProps = {
  webR?: WebR
  setData: Function
  setEffect: Function
  status: string
  setStatus: Function
}

export const Filters = (props: FiltersProps) => {
  const { webR, setData, setEffect, status, setStatus } = props

  const [open, setOpen] = useState(false)
  const [ranOnce, setRanOnce] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [error, setError] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      outcomes: outcomesOptions.filter((e) => e.checked).map((e) => e.id),
      outcomeMeasurements: outcomeMeasurementsOptions
        .filter((e) => e.checked)
        .map((e) => e.id),
      interventionAspect: interventionAspectsOptions
        .filter((e) => e.checked)
        .map((e) => e.id),
      interventionMedium: interventionMediaOptions
        .filter((e) => e.checked)
        .map((e) => e.id),
      interventionAppeal: interventionAppealsOptions
        .filter((e) => e.checked)
        .map((e) => e.id),
      countries: countriesOptions.filter((e) => e.checked).map((e) => e.id),
      minimumCellSize: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let subset: typeof data

    const selectedSubCategories = values.outcomes

    // Filter on outcome
    subset = data.filter((e) =>
      selectedSubCategories.includes(e.outcome_subcategory),
    )

    // Filter on outcome measurement
    subset = subset.filter((e) => {
      return values.outcomeMeasurements.some((aspect) =>
        e.outcome_measurement_type.includes(aspect.toLowerCase()),
      )
    })

    // Filter on cell size
    subset = subset.filter(
      (e) =>
        e.control_n > values.minimumCellSize &&
        e.intervention_n > values.minimumCellSize,
    )

    // Filter on intervention aspect
    subset = subset.filter((e) => {
      return values.interventionAspect.some(
        (aspect) =>
          e.intervention_aspect.includes(aspect.toLowerCase()) ||
          e.intervention_aspect == "",
      )
    })

    subset = subset.filter((e) => {
      return values.interventionMedium.some(
        (medium) =>
          e.intervention_medium.includes(medium.toLowerCase()) ||
          e.intervention_medium == "",
      )
    })

    subset = subset.filter((e) => {
      return values.interventionAppeal.some(
        (appeal) =>
          e.intervention_appeal.includes(appeal.toLowerCase()) ||
          e.intervention_appeal == "",
      )
    })

    // Filter on country
    // subset = subset.filter((e) =>
    //   values.countries.includes(e.control_sample_country.toLowerCase()),
    // )

    subset = subset.filter((e) =>
      values.countries.includes(e.intervention_sample_country),
    )

    if (subset.length == 0) {
      setError(true)
    } else {
      setError(false)
      setData(subset)

      if (webR) {
        setStatus("Running meta-analysis...")
        setDisabled(true)
        const data = subset.map((e) =>
          (({
            effect_size_value,
            effect_size_var,
            paper_study,
            outcome,
            group_1,
            group_2,
          }) => ({
            effect_size_value,
            effect_size_var,
            paper_study,
            outcome,
            group_1,
            group_2,
          }))(e),
        )
        const df = await new webR.RObject(data)
        await webR.objs.globalEnv.bind("data", df)
        const results = await runMetaAnalysis(webR)
        setEffect({ value: results[0], lower: results[1], upper: results[2] })

        setStatus("Ready")
        setDisabled(false)
      }
    }
  }

  useEffect(() => {
    form.handleSubmit(onSubmit)
  }, [form, setStatus])

  useEffect(() => {
    if (status == "Ready") {
      if (!ranOnce) {
        form.handleSubmit(onSubmit)()
      }
      setRanOnce(true)
      setDisabled(false)
    }
  }, [status, form, ranOnce])

  return (
    <Collapsible
      className="rounded-lg bg-gray-100 p-3"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger>
        <div className="m-1 flex flex-row items-center gap-1">
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
            className="m-1 space-y-8"
          >
            <div>
              <h3 className="text-xl font-semibold">Outcomes</h3>
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
              <FilterSelectMultiple
                form={form}
                name="outcomeMeasurements"
                groups={[
                  {
                    label: "Outcome measurement",
                    items: outcomeMeasurementsOptions,
                  },
                ]}
              />
            </div>
            <div>
              <div>
                <h3 className="text-xl font-semibold">Interventions</h3>
              </div>
              <div className="flex gap-3">
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
                <FilterSelectMultiple
                  form={form}
                  name="interventionMedium"
                  groups={[
                    {
                      label: "Intervention medium",
                      items: interventionMediaOptions,
                    },
                  ]}
                />
                <FilterSelectMultiple
                  form={form}
                  name="interventionAppeal"
                  groups={[
                    {
                      label: "Intervention appeal",
                      items: interventionAppealsOptions,
                    },
                  ]}
                />
              </div>
            </div>
            <div>
              <div>
                <h3 className="text-xl font-semibold">Samples</h3>
              </div>
              <div className="flex gap-3">
                <FilterSelectMultiple
                  form={form}
                  name="countries"
                  groups={[
                    {
                      label: "Country",
                      items: countriesOptions,
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
            <Button type="submit" disabled={disabled}>
              Update
            </Button>
          </form>
        </Form>
        {error && (
          <div className="ms-1 mt-2 text-sm text-red-500">
            No papers match these criteria
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
