"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useState } from "react"

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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"
import {
  InterventionFilters,
  interventionFiltersFields,
} from "@/components/filters/intervention-filters"
import {
  OutcomeCategories,
  OutcomeMeasurementType,
  outcomeCategoriesFields,
  addOutcomeCategoriesRefinement,
} from "@/components/filters/outcome-filters"
import {
  StudyPreregistration,
  studyPreregistrationField,
} from "@/components/filters/study-filters"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import data from "@/assets/data/data.json"

import { COUNTRY_OPTIONS } from "@/constants/constants-filters"
import { META_ANALYSIS_DEFAULTS } from "@/constants/constants-meta-analysis"

import { Data } from "@/lib/types"

const formSchema = addOutcomeCategoriesRefinement(
  z.object({
    ...interventionFiltersFields,
    ...outcomeCategoriesFields,
    outcome_measurement_type: z
      .string()
      .array()
      .nonempty({ error: "Must select at least one outcome measurement." }),
    sample_country: z
      .string()
      .array()
      .nonempty({ error: "Must select at least one country." }),
    sample_size: z.coerce
      .number()
      .min(1, { error: "Must be a positive number." }) as z.ZodNumber,
    ...studyPreregistrationField,
  })
)

type FiltersProps = {
  status: string
  setData: Dispatch<SetStateAction<Data | undefined>>
}

export const Filters = ({ status, setData }: FiltersProps) => {
  const [open, setOpen] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      outcome_subcategory_behavior:
        META_ANALYSIS_DEFAULTS.outcome_subcategory_behavior,
      outcome_subcategory_intention:
        META_ANALYSIS_DEFAULTS.outcome_subcategory_intention,
      outcome_subcategory_attitude:
        META_ANALYSIS_DEFAULTS.outcome_subcategory_attitude,
      outcome_measurement_type: META_ANALYSIS_DEFAULTS.outcome_measurement_type,
      intervention_content: META_ANALYSIS_DEFAULTS.intervention_content,
      intervention_mechanism: META_ANALYSIS_DEFAULTS.intervention_mechanism,
      intervention_medium: META_ANALYSIS_DEFAULTS.intervention_medium,
      sample_country: COUNTRY_OPTIONS,
      sample_size: 1,
      study_preregistered: META_ANALYSIS_DEFAULTS.study_preregistered,
    },
  })

  const onInvalid = () => {
    form.setError("root", {
      type: "manual",
      message: "Please fix the errors above and try again.",
    })
    setOpen(true) // Open the collapsible to show validation errors
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Clear errors
    form.clearErrors("root")

    let subset: typeof data

    // Filter on outcome subcategory
    const outcome_subcategory = [
      ...values.outcome_subcategory_behavior,
      ...values.outcome_subcategory_intention,
      ...values.outcome_subcategory_attitude,
    ]

    subset = data.filter((datum) => {
      return outcome_subcategory.some(
        (value) => datum.outcome_subcategory === value
      )
    })

    // Filter on outcome measurement
    subset = subset.filter((datum) => {
      return values.outcome_measurement_type.some((value) =>
        datum.outcome_measurement_type.includes(value.toLowerCase())
      )
    })

    // Filter on cell size
    subset = subset.filter(
      (datum) =>
        datum.effect_control_n > values.sample_size &&
        datum.effect_intervention_n > values.sample_size
    )

    // Filter on intervention aspect
    subset = subset.filter((datum) => {
      return values.intervention_content.some((value) =>
        datum.intervention_content.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_mechanism.some((value) =>
        datum.intervention_mechanism.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_medium.some((value) =>
        datum.intervention_medium.includes(value)
      )
    })

    // Filter on country
    subset = subset.filter((e) =>
      values.sample_country.includes(e.sample_country)
    )

    // Filter on preregistration
    subset = subset.filter((e) =>
      values.study_preregistered.includes(e.study_preregistered)
    )

    if (subset.length == 0) {
      form.setError("root", {
        type: "manual",
        message:
          "No papers match these criteria; please relax the inclusion criteria to include effects from more papers",
      })
      setOpen(true) // Open the collapsible to show the error
      return
    } else if (new Set(subset.map((d) => d.paper)).size < 2) {
      form.setError("root", {
        type: "manual",
        message:
          "Only 1 paper matches these criteria; please relax the inclusion criteria to include effects from more papers",
      })
      setOpen(true) // Open the collapsible to show the error
      return
    }

    setData(subset)
  }

  return (
    <Collapsible
      className="rounded-2xl border bg-muted px-[2px] py-[5px]"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="ms-0.5 flex flex-row items-center gap-1 px-3 py-2 focus:rounded-2xl focus:outline-2 focus:outline-primary">
        <h2 className="text-2xl font-bold tracking-tight">Inclusion criteria</h2>
        <ChevronRight
          className={cn("transition", open ? "rotate-90" : "rotate-0")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="p-3">
          <div className="flex flex-col gap-3">
              {/* Levels */}
              <div className="my-3 space-y-4">
                {/* Outcome-level */}
                <h2 className="text-xl font-semibold">Outcomes</h2>
                <div className="mx-3">
                  {/* Outcome categories */}
                  <div className="space-y-4">
                    <OutcomeCategories control={form.control} />
                  </div>

                  {/* Outcome measurement type */}
                  <OutcomeMeasurementType control={form.control} />
                </div>
                <Separator />
                {/* Intervention-level */}
                <h2 className="text-xl font-semibold">Interventions</h2>
                <div className="mx-3 space-y-4">
                  <InterventionFilters control={form.control} />
                </div>
                <Separator />
                {/* Samples-level */}
                <h2 className="text-xl font-semibold">Study</h2>
                <div className="mx-3 space-y-4">
                  {/* Study preregistration */}
                  <StudyPreregistration control={form.control} />
                </div>
                <Separator />
                {/* Samples-level */}
                <h2 className="text-xl font-semibold">Samples</h2>
                <div className="mx-3 space-y-4">
                  {/* Sample country */}
                  <FormField
                    control={form.control}
                    name="sample_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Country</FormLabel>
                        <FormDescription>
                          Countries where studies were conducted
                        </FormDescription>
                        <MultiSelect
                          onValuesChange={field.onChange}
                          values={field.value}
                        >
                          <FormControl>
                            <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                              <MultiSelectValue placeholder="Select countries..." />
                            </MultiSelectTrigger>
                          </FormControl>
                          <MultiSelectContent search={{ placeholder: "Search countries...", emptyMessage: "No country found." }}>
                            <MultiSelectGroup>
                              {COUNTRY_OPTIONS.map((option) => (
                                <MultiSelectItem key={option} value={option}>
                                  {option}
                                </MultiSelectItem>
                              ))}
                            </MultiSelectGroup>
                          </MultiSelectContent>
                        </MultiSelect>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Sample size */}
                  <FormField
                    control={form.control}
                    name="sample_size"
                    render={({ field }) => (
                      <FormItem className="w-60">
                        <FormLabel className="text-base">
                          Minimum sample size
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="my-2 rounded-xl bg-primary-foreground"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="leading-5">
                          This is the minimum sample size in either the control
                          or intervention condition.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={status !== "Ready"}
                className="h-auto rounded-lg w-fit"
              >
                {status !== "Ready" ? (
                  <Spinner className="size-4" />
                ) : (
                  "Run meta-analysis"
                )}
              </Button>
              {form.formState.errors.root && (
                <div className="text-destructive text-sm font-semibold">
                  {form.formState.errors.root.message}
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
      </CollapsibleContent>
    </Collapsible>
  )
}
