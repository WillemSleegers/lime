"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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

import data from "../assets/data/data.json"

import { getOptions } from "@/lib/json-functions"
import { MultiPillsForm } from "./forms/multi-pills-form"
import { Separator } from "./ui/separator"

const behaviors = getOptions("behaviors")
const intentions = getOptions("intentions")
const attitudes = getOptions("attitudes")
const measurements = getOptions("outcome_measurement_type")
const contents = getOptions("intervention_content")
const mediums = getOptions("intervention_medium")
const mechanisms = getOptions("intervention_mechanism")
const countries = getOptions("sample_intervention_country")

import { META_ANALYSIS_DEFAULTS } from "@/lib/constants"
import { Input } from "./ui/input"

const formSchema = z.object({
  outcomes: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome." }),
  measurements: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome measurement." }),
  contents: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention aspect." }),
  mechanisms: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention appeal." }),
  mediums: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention medium." }),
  countries: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one country." }),
  minimumCellSize: z.coerce.number().min(1),
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
    mode: "onChange",
    defaultValues: {
      outcomes: META_ANALYSIS_DEFAULTS.outcomes,
      measurements: META_ANALYSIS_DEFAULTS.measurement_type,
      contents: META_ANALYSIS_DEFAULTS.intervention_content,
      mechanisms: META_ANALYSIS_DEFAULTS.intervention_mechanism,
      mediums: META_ANALYSIS_DEFAULTS.intervention_medium,
      countries: countries.map((country) => country.value),
      minimumCellSize: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let subset: typeof data

    // Filter on outcome
    subset = data.filter((datum) =>
      values.outcomes.includes(datum.outcome_subcategory),
    )

    // Filter on outcome measurement
    subset = subset.filter((datum) => {
      return values.measurements.some((measurement) =>
        datum.outcome_measurement_type.includes(measurement.toLowerCase()),
      )
    })

    // Filter on cell size
    subset = subset.filter(
      (datum) =>
        datum.effect_control_n > values.minimumCellSize &&
        datum.effect_intervention_n > values.minimumCellSize,
    )

    // Filter on intervention aspect
    subset = subset.filter((datum) => {
      return values.contents.some(
        (value) =>
          datum.intervention_content.includes(value.toLowerCase()) ||
          datum.intervention_content == "",
      )
    })

    subset = subset.filter((datum) => {
      return values.mechanisms.some(
        (value) =>
          datum.intervention_mechanism.includes(value.toLowerCase()) ||
          datum.intervention_mechanism == "",
      )
    })

    subset = subset.filter((datum) => {
      return values.mediums.some(
        (medium) =>
          datum.intervention_medium?.includes(medium.toLowerCase()) ||
          datum.intervention_medium == "",
      )
    })

    // Filter on country (intervention sample only)
    subset = subset.filter((e) =>
      values.countries.includes(e.sample_intervention_country),
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
            effect_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }) => ({
            effect_size_value,
            effect_size_var,
            effect_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }))(e),
        )
        const df = await new webR.RObject(data)
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
      className="rounded-lg border bg-gray-100 p-3"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex flex-row items-center gap-1">
        <h2 className="text-2xl font-bold tracking-tight">
          Inclusion criteria
        </h2>
        <ChevronRight
          className={cn("transition", open ? "rotate-90" : "rotate-0")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent p-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3 space-y-4">
              <div className="space-y-3">
                <h3 className="mb-3 text-xl font-semibold">Outcomes</h3>
                <FormField
                  control={form.control}
                  name="outcomes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-3 ps-3 pb-3">
                          <div>
                            <FormLabel className="block pb-3 text-base">
                              Behavior outcomes
                            </FormLabel>
                            <MultiPillsForm field={field} options={behaviors} />
                          </div>
                          <div>
                            <FormLabel className="block pb-3 text-base">
                              Intention outcomes
                            </FormLabel>
                            <MultiPillsForm
                              field={field}
                              options={intentions}
                            />
                          </div>
                          <div>
                            <FormLabel className="block pb-3 text-base">
                              Attitude/belief outcomes
                            </FormLabel>
                            <MultiPillsForm field={field} options={attitudes} />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="measurements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Measurement type
                      </FormLabel>
                      <FormControl>
                        <MultiPillsForm field={field} options={measurements} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <div className="space-y-3">
                  <h3 className="mb-3 text-xl font-semibold">Interventions</h3>
                  <FormField
                    control={form.control}
                    name="contents"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Intervention content
                        </FormLabel>
                        <FormControl>
                          <MultiPillsForm field={field} options={contents} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mediums"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Intervention medium
                        </FormLabel>
                        <FormControl>
                          <MultiPillsForm field={field} options={mediums} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mechanisms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Intervention appeal
                        </FormLabel>
                        <FormControl>
                          <MultiPillsForm field={field} options={mechanisms} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <div>
                    <h3 className="text-xl font-semibold">Samples</h3>
                  </div>
                  <div className="flex gap-3">
                    <FormField
                      control={form.control}
                      name="countries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Country</FormLabel>
                          <FormControl>
                            <MultiPillsForm field={field} options={countries} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="minimumCellSize"
                  render={({ field }) => (
                    <FormItem className="w-60">
                      <FormLabel>Minimum sample size</FormLabel>
                      <FormControl>
                        <Input className="my-2" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the minimum sample size in either the control or
                        intervention condition.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
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
