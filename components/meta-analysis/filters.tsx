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
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

import data from "@/assets/data/data.json"

import {
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  COUNTRY_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  STUDY_PREREGISTERED_OPTIONS,
} from "@/constants/constants-filters"
import { META_ANALYSIS_DEFAULTS } from "@/constants/constants-meta-analysis"

import { Data } from "@/lib/types"

const formSchema = z
  .object({
    outcome_subcategory_behavior: z.string().array(),
    outcome_subcategory_intention: z.string().array(),
    outcome_subcategory_attitude: z.string().array(),
    outcome_measurement_type: z
      .string()
      .array()
      .nonempty({ error: "Must select at least one outcome measurement." }),
    intervention_content: z
      .string()
      .array()
      .nonempty({ error: "Must select at least one intervention content." }),
    intervention_mechanism: z.string().array().nonempty({
      error: "Must select at least one intervention mechanism.",
    }),
    intervention_medium: z
      .string()
      .array()
      .nonempty({ error: "Must select at least one intervention medium." }),
    sample_country: z
      .string()
      .array()
      .nonempty({ error: "Must select at least one country." }),
    sample_size: z.coerce
      .number()
      .min(1, { error: "Must be a positive number." }) as z.ZodNumber,
    study_preregistered: z
      .string()
      .array()
      .nonempty({ error: "Must select at least one option." }),
  })
  .check((ctx) => {
    if (
      ctx.value.outcome_subcategory_behavior.length +
        ctx.value.outcome_subcategory_intention.length +
        ctx.value.outcome_subcategory_attitude.length ==
      0
    ) {
      ctx.issues.push({
        input: ctx.value,
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_behavior"],
      })
      ctx.issues.push({
        input: ctx.value,
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_intention"],
      })
      ctx.issues.push({
        input: ctx.value,
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_attitude"],
      })
      ctx.issues.push({
        input: ctx.value,
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory"],
      })
    }
  })

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
    <FilterCollapsible
      title="Inclusion criteria"
      open={open}
      onOpenChange={setOpen}
    >
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
                    <div className="space-y-1">
                      <FormLabel className="text-base">
                        Outcome categories
                      </FormLabel>
                      <FormDescription>
                        Select at least one outcome from any of the three categories below
                      </FormDescription>
                    </div>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="outcome_subcategory_behavior"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Behaviors
                            </FormLabel>
                            <MultiSelect
                              onValuesChange={field.onChange}
                              values={field.value}
                            >
                              <FormControl>
                                <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                                  <MultiSelectValue placeholder="Select behaviors..." />
                                </MultiSelectTrigger>
                              </FormControl>
                              <MultiSelectContent>
                                <MultiSelectGroup>
                                  {OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS.map(
                                    (option) => (
                                      <MultiSelectItem key={option} value={option}>
                                        {option}
                                      </MultiSelectItem>
                                    )
                                  )}
                                </MultiSelectGroup>
                              </MultiSelectContent>
                            </MultiSelect>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="outcome_subcategory_intention"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Intentions
                            </FormLabel>
                            <MultiSelect
                              onValuesChange={field.onChange}
                              values={field.value}
                            >
                              <FormControl>
                                <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                                  <MultiSelectValue placeholder="Select intentions..." />
                                </MultiSelectTrigger>
                              </FormControl>
                              <MultiSelectContent>
                                <MultiSelectGroup>
                                  {OUTCOME_SUBCATEGORY_INTENTION_OPTIONS.map(
                                    (option) => (
                                      <MultiSelectItem key={option} value={option}>
                                        {option}
                                      </MultiSelectItem>
                                    )
                                  )}
                                </MultiSelectGroup>
                              </MultiSelectContent>
                            </MultiSelect>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="outcome_subcategory_attitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Attitudes/beliefs
                            </FormLabel>
                            <MultiSelect
                              onValuesChange={field.onChange}
                              values={field.value}
                            >
                              <FormControl>
                                <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                                  <MultiSelectValue placeholder="Select attitudes/beliefs..." />
                                </MultiSelectTrigger>
                              </FormControl>
                              <MultiSelectContent>
                                <MultiSelectGroup>
                                  {OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS.map(
                                    (option) => (
                                      <MultiSelectItem key={option} value={option}>
                                        {option}
                                      </MultiSelectItem>
                                    )
                                  )}
                                </MultiSelectGroup>
                              </MultiSelectContent>
                            </MultiSelect>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      name="outcome_subcategory"
                      render={() => (
                        <FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Outcome measurement type */}
                  <FormField
                    control={form.control}
                    name="outcome_measurement_type"
                    render={() => (
                      <FormItem>
                        <div className="space-y-1">
                          <FormLabel className="text-base">
                            Measurement type
                          </FormLabel>
                        </div>
                        {OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((option) => (
                          <FormField
                            key={option.value}
                            control={form.control}
                            name="outcome_measurement_type"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.value}
                                  className="flex flex-row items-center gap-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        option.value
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              option.value,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) =>
                                                  value !== option.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                {/* Intervention-level */}
                <h2 className="text-xl font-semibold">Interventions</h2>
                <div className="mx-3 space-y-4">
                  {/* Intervention content */}
                  <FormField
                    control={form.control}
                    name="intervention_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Content</FormLabel>
                        <FormDescription>
                          Topics or arguments used to persuade people
                        </FormDescription>
                        <MultiSelect
                          onValuesChange={field.onChange}
                          values={field.value}
                        >
                          <FormControl>
                            <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                              <MultiSelectValue placeholder="Select intervention content..." />
                            </MultiSelectTrigger>
                          </FormControl>
                          <MultiSelectContent>
                            <MultiSelectGroup>
                              {INTERVENTION_CONTENT_OPTIONS.map((option) => (
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
                  {/* Intervention mechanism */}
                  <FormField
                    control={form.control}
                    name="intervention_mechanism"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Mechanism</FormLabel>
                        <FormDescription>
                          Persuasion strategies used by researchers
                        </FormDescription>
                        <MultiSelect
                          onValuesChange={field.onChange}
                          values={field.value}
                        >
                          <FormControl>
                            <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                              <MultiSelectValue placeholder="Select intervention mechanism..." />
                            </MultiSelectTrigger>
                          </FormControl>
                          <MultiSelectContent>
                            <MultiSelectGroup>
                              {INTERVENTION_MECHANISM_OPTIONS.map((option) => (
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
                  {/* Intervention medium */}
                  <FormField
                    control={form.control}
                    name="intervention_medium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Medium</FormLabel>
                        <FormDescription>
                          How the intervention was delivered to participants
                        </FormDescription>
                        <MultiSelect
                          onValuesChange={field.onChange}
                          values={field.value}
                        >
                          <FormControl>
                            <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                              <MultiSelectValue placeholder="Select intervention medium..." />
                            </MultiSelectTrigger>
                          </FormControl>
                          <MultiSelectContent>
                            <MultiSelectGroup>
                              {INTERVENTION_MEDIUM_OPTIONS.map((option) => (
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
                </div>
                <Separator />
                {/* Samples-level */}
                <h2 className="text-xl font-semibold">Study</h2>
                <div className="mx-3 space-y-4">
                  {/* Study preregistration */}
                  <FormField
                    control={form.control}
                    name="study_preregistered"
                    render={() => (
                      <FormItem>
                        <div className="space-y-1">
                          <FormLabel>Study preregistration</FormLabel>
                        </div>
                        {STUDY_PREREGISTERED_OPTIONS.map((option) => (
                          <FormField
                            key={option.value}
                            control={form.control}
                            name="study_preregistered"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.value}
                                  className="flex flex-row items-center gap-2"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        option.value
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              option.value,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) =>
                                                  value !== option.value
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-sm font-normal">
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
    </FilterCollapsible>
  )
}
