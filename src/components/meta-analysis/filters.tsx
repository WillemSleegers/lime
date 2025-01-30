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
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import data from "../../assets/data/data.json"

import { Separator } from "../ui/separator"
import { Input } from "@/components/ui/input"

const outcome_subcategory_behavior_options = [
  ...new Set(
    data
      .filter((d) => d.outcome_category === "behavior")
      .map((d) => d.outcome_subcategory),
  ),
]
const outcome_subcategory_intention_options = [
  ...new Set(
    data
      .filter((d) => d.outcome_category === "intentions")
      .map((d) => d.outcome_subcategory),
  ),
]
const outcome_subcategory_attitude_options = [
  ...new Set(
    data
      .filter((d) => d.outcome_category === "attitudes/beliefs")
      .map((d) => d.outcome_subcategory),
  ),
]

const outcome_measurement_type_options = [
  ...new Set(data.map((d) => d.outcome_measurement_type)),
]
const intervention_content_options = [
  ...new Set(
    data
      .map((datum) => datum.intervention_content)
      .flatMap((str) => str.split(", ").map((s) => s)),
  ),
]
const intervention_mechanism_options = [
  ...new Set(
    data
      .map((datum) => datum.intervention_mechanism)
      .flatMap((str) => str.split(",").map((s) => s.trim())),
  ),
]
const intervention_medium_options = [
  ...new Set(
    data
      .map((datum) => datum.intervention_medium)
      .flatMap((str) => str.split(",").map((s) => s.trim())),
  ),
]
const country_options = [
  ...new Set(data.map((d) => d.sample_intervention_country)),
]

import { META_ANALYSIS_DEFAULTS } from "@/lib/constants"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

const formSchema = z
  .object({
    outcome_subcategory_behavior: z.string().array(),
    outcome_subcategory_intention: z.string().array(),
    outcome_subcategory_attitude: z.string().array(),
    outcome_measurement_type: z
      .string()
      .array()
      .nonempty({ message: "Must select at least one outcome measurement." }),
    intervention_content: z
      .string()
      .array()
      .nonempty({ message: "Must select at least one intervention content." }),
    intervention_mechanism: z.string().array().nonempty({
      message: "Must select at least one intervention mechanism.",
    }),
    intervention_medium: z
      .string()
      .array()
      .nonempty({ message: "Must select at least one intervention medium." }),
    sample_country: z
      .string()
      .array()
      .nonempty({ message: "Must select at least one country." }),
    sample_size: z.coerce.number().min(1),
  })
  .superRefine((values, ctx) => {
    if (
      values.outcome_subcategory_behavior.length +
        values.outcome_subcategory_intention.length +
        values.outcome_subcategory_attitude.length ==
      0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_behavior"],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_intention"],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_attitude"],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory"],
      })
    }
  })

type FiltersProps = {
  setData: Function
  disabled: boolean
}

export const Filters = (props: FiltersProps) => {
  const { setData, disabled } = props

  const [open, setOpen] = useState(false)
  const [ranOnce, setRanOnce] = useState(false)

  const [error, setError] = useState<string | undefined>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
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
      sample_country: country_options,
      sample_size: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let subset: typeof data

    // Filter on outcome subcategory
    const outcome_subcategory = [
      ...values.outcome_subcategory_behavior,
      ...values.outcome_subcategory_intention,
      ...values.outcome_subcategory_attitude,
    ]

    subset = data.filter((datum) => {
      return outcome_subcategory.some(
        (value) => datum.outcome_subcategory === value,
      )
    })

    // Filter on outcome measurement
    subset = subset.filter((datum) => {
      return values.outcome_measurement_type.some((value) =>
        datum.outcome_measurement_type.includes(value.toLowerCase()),
      )
    })

    // Filter on cell size
    subset = subset.filter(
      (datum) =>
        datum.effect_control_n > values.sample_size &&
        datum.effect_intervention_n > values.sample_size,
    )

    // Filter on intervention aspect
    subset = subset.filter((datum) => {
      return values.intervention_content.some((value) =>
        datum.intervention_content.includes(value),
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_mechanism.some((value) =>
        datum.intervention_mechanism.includes(value),
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_medium.some((value) =>
        datum.intervention_medium.includes(value),
      )
    })

    // Filter on country (intervention sample only)
    subset = subset.filter((e) =>
      values.sample_country.includes(e.sample_intervention_country),
    )

    if (subset.length == 0) {
      setError("No papers match these criteria")
    } else if (new Set(subset.map((d) => d.paper)).size < 2) {
      setError(
        "Only 1 paper matches these criteria; please relax the inclusion criteria to include effects from more papers",
      )
    } else {
      setError(undefined)
      setData(subset)
    }
  }

  useEffect(() => {
    if (!disabled) {
      if (!ranOnce) {
        form.handleSubmit(onSubmit)()
      }
      setRanOnce(true)
    }
  }, [disabled])

  return (
    <Collapsible
      className="bg-muted rounded-lg border p-3"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex flex-row items-center gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Inclusion criteria
        </h1>
        <ChevronRight
          className={cn("transition", open ? "rotate-90" : "rotate-0")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-3">
              {/* Levels */}
              <div className="my-3 space-y-3">
                {/* Outcome-level */}
                <h2 className="text-xl font-semibold">Outcomes</h2>
                <div className="mx-3">
                  {/* Outcome categories */}
                  <div className="space-y-3">
                    <FormLabel className="text-base">
                      Outcome categories
                    </FormLabel>
                    <div className="my-3 space-y-3 px-3">
                      <FormField
                        control={form.control}
                        name="outcome_subcategory_behavior"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Behaviors
                            </FormLabel>
                            <FormControl className="justify-start">
                              <ToggleGroup
                                className="my-2 flex flex-wrap gap-x-2"
                                type="multiple"
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                {outcome_subcategory_behavior_options.map(
                                  (option) => (
                                    <ToggleGroupItem
                                      key={option}
                                      value={option}
                                      variant="pill"
                                      size="sm"
                                    >
                                      {option}
                                    </ToggleGroupItem>
                                  ),
                                )}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() =>
                                    field.onChange(
                                      outcome_subcategory_behavior_options,
                                    )
                                  }
                                >
                                  Select all
                                </Button>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() => field.onChange([])}
                                >
                                  Deselect all
                                </Button>
                              </ToggleGroup>
                            </FormControl>
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
                            <FormControl className="justify-start">
                              <ToggleGroup
                                className="my-2 flex flex-wrap gap-x-2"
                                type="multiple"
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                {outcome_subcategory_intention_options.map(
                                  (option) => (
                                    <ToggleGroupItem
                                      key={option}
                                      value={option}
                                      variant="pill"
                                      size="sm"
                                    >
                                      {option}
                                    </ToggleGroupItem>
                                  ),
                                )}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() =>
                                    field.onChange(
                                      outcome_subcategory_intention_options,
                                    )
                                  }
                                >
                                  Select all
                                </Button>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() => field.onChange([])}
                                >
                                  Deselect all
                                </Button>
                              </ToggleGroup>
                            </FormControl>
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
                            <FormControl className="justify-start">
                              <ToggleGroup
                                className="my-2 flex flex-wrap gap-x-2"
                                type="multiple"
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                {outcome_subcategory_attitude_options.map(
                                  (option) => (
                                    <ToggleGroupItem
                                      key={option}
                                      value={option}
                                      variant="pill"
                                      size="sm"
                                    >
                                      {option}
                                    </ToggleGroupItem>
                                  ),
                                )}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() =>
                                    field.onChange(
                                      outcome_subcategory_attitude_options,
                                    )
                                  }
                                >
                                  Select all
                                </Button>
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() => field.onChange([])}
                                >
                                  Deselect all
                                </Button>
                              </ToggleGroup>
                            </FormControl>
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Measurement type
                        </FormLabel>
                        <FormControl className="justify-start">
                          <ToggleGroup
                            className="my-2 flex flex-wrap gap-x-2"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {outcome_measurement_type_options.map((option) => (
                              <ToggleGroupItem
                                key={option}
                                value={option}
                                variant="pill"
                                size="sm"
                              >
                                {option}
                              </ToggleGroupItem>
                            ))}
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() =>
                                field.onChange(outcome_measurement_type_options)
                              }
                            >
                              Select all
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() => field.onChange([])}
                            >
                              Deselect all
                            </Button>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                {/* Intervention-level */}
                <h2 className="text-xl font-semibold">Interventions</h2>
                <div className="mx-3 space-y-3">
                  {/* Intervention content */}
                  <FormField
                    control={form.control}
                    name="intervention_content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Content</FormLabel>
                        <FormControl className="justify-start">
                          <ToggleGroup
                            className="my-2 flex flex-wrap gap-x-2"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {intervention_content_options.map((option) => (
                              <ToggleGroupItem
                                key={option}
                                value={option}
                                variant="pill"
                                size="sm"
                              >
                                {option}
                              </ToggleGroupItem>
                            ))}
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() =>
                                field.onChange(intervention_content_options)
                              }
                            >
                              Select all
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() => field.onChange([])}
                            >
                              Deselect all
                            </Button>
                          </ToggleGroup>
                        </FormControl>
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
                        <FormControl className="justify-start">
                          <ToggleGroup
                            className="my-2 flex flex-wrap gap-x-2"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {intervention_mechanism_options.map((option) => (
                              <ToggleGroupItem
                                key={option}
                                value={option}
                                variant="pill"
                                size="sm"
                              >
                                {option}
                              </ToggleGroupItem>
                            ))}
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() =>
                                field.onChange(intervention_mechanism_options)
                              }
                            >
                              Select all
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() => field.onChange([])}
                            >
                              Deselect all
                            </Button>
                          </ToggleGroup>
                        </FormControl>
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
                        <FormControl className="justify-start">
                          <ToggleGroup
                            type="multiple"
                            className="my-2 flex flex-wrap gap-x-2"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {intervention_medium_options.map((option) => (
                              <ToggleGroupItem
                                key={option}
                                value={option}
                                variant="pill"
                                size="sm"
                              >
                                {option}
                              </ToggleGroupItem>
                            ))}
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() =>
                                field.onChange(intervention_medium_options)
                              }
                            >
                              Select all
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() => field.onChange([])}
                            >
                              Deselect all
                            </Button>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                {/* Samples-level */}
                <h2 className="text-xl font-semibold">Samples</h2>
                <div className="mx-3 space-y-3">
                  {/* Sample country */}
                  <FormField
                    control={form.control}
                    name="sample_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Country</FormLabel>
                        <FormControl className="justify-start">
                          <ToggleGroup
                            className="my-2 flex flex-wrap gap-x-2"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {country_options.map((option) => (
                              <ToggleGroupItem
                                key={option}
                                value={option}
                                variant="pill"
                                size="sm"
                              >
                                {option}
                              </ToggleGroupItem>
                            ))}
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() => field.onChange(country_options)}
                            >
                              Select all
                            </Button>
                            <Button
                              type="button"
                              variant="link"
                              className="text-foreground h-auto px-2"
                              onClick={() => field.onChange([])}
                            >
                              Deselect all
                            </Button>
                          </ToggleGroup>
                        </FormControl>
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
                            className="my-2 rounded-xl"
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

              <Button
                type="submit"
                disabled={disabled}
                className="h-auto w-30 rounded-full text-white"
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
        {error && (
          <div className="text-destructive ms-1 mt-2 text-sm font-semibold">
            {error}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}
