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
import { Dispatch, SetStateAction, useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import data from "../../assets/data/data.json"

import { Separator } from "../ui/separator"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

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
    study_preregistered: z
      .string()
      .array()
      .nonempty({ message: "Must select at least one option." }),
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
  status: string
  setData: Dispatch<SetStateAction<Data | undefined>>
}

export const Filters = ({ status, setData }: FiltersProps) => {
  const [open, setOpen] = useState(true)
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
      sample_country: COUNTRY_OPTIONS,
      sample_size: 1,
      study_preregistered: META_ANALYSIS_DEFAULTS.study_preregistered,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
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
      setError("No papers match these criteria")
    } else if (new Set(subset.map((d) => d.paper)).size < 2) {
      setError(
        "Only 1 paper matches these criteria; please relax the inclusion criteria to include effects from more papers"
      )
    } else {
      setError(undefined)
      setData(subset)
    }
  }

  return (
    <Collapsible
      className="bg-muted p-4 rounded-2xl"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex flex-row items-center gap-1">
        <h1 className="text-xl font-bold tracking-tight">Inclusion criteria</h1>
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
                                className="flex flex-wrap gap-x-2 gap-y-1"
                                type="multiple"
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                {OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS.map(
                                  (option) => (
                                    <ToggleGroupItem
                                      key={option}
                                      value={option}
                                      variant="pill"
                                      size="sm"
                                    >
                                      {option}
                                    </ToggleGroupItem>
                                  )
                                )}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() =>
                                    field.onChange(
                                      OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS
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
                                className="flex flex-wrap gap-x-2 gap-y-1"
                                type="multiple"
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                {OUTCOME_SUBCATEGORY_INTENTION_OPTIONS.map(
                                  (option) => (
                                    <ToggleGroupItem
                                      key={option}
                                      value={option}
                                      variant="pill"
                                      size="sm"
                                    >
                                      {option}
                                    </ToggleGroupItem>
                                  )
                                )}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() =>
                                    field.onChange(
                                      OUTCOME_SUBCATEGORY_INTENTION_OPTIONS
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
                                className="flex flex-wrap gap-x-2 gap-y-1"
                                type="multiple"
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                {OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS.map(
                                  (option) => (
                                    <ToggleGroupItem
                                      key={option}
                                      value={option}
                                      variant="pill"
                                      size="sm"
                                    >
                                      {option}
                                    </ToggleGroupItem>
                                  )
                                )}
                                <Button
                                  type="button"
                                  variant="link"
                                  className="text-foreground h-auto px-2"
                                  onClick={() =>
                                    field.onChange(
                                      OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS
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
                            className="flex flex-wrap gap-x-2 gap-y-1"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((option) => (
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
                                field.onChange(OUTCOME_MEASUREMENT_TYPE_OPTIONS)
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
                            className="flex flex-wrap gap-x-2 gap-y-1"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {INTERVENTION_CONTENT_OPTIONS.map((option) => (
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
                                field.onChange(INTERVENTION_CONTENT_OPTIONS)
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
                            className="flex flex-wrap gap-x-2 gap-y-1"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {INTERVENTION_MECHANISM_OPTIONS.map((option) => (
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
                                field.onChange(INTERVENTION_MECHANISM_OPTIONS)
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
                            className="flex flex-wrap gap-x-2 gap-y-1"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {INTERVENTION_MEDIUM_OPTIONS.map((option) => (
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
                                field.onChange(INTERVENTION_MEDIUM_OPTIONS)
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
                <h2 className="text-xl font-semibold">Study</h2>
                <div className="mx-3 space-y-3">
                  {/* Sample country */}
                  <FormField
                    control={form.control}
                    name="study_preregistered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">
                          Preregistered
                        </FormLabel>
                        <FormControl className="justify-start">
                          <ToggleGroup
                            className="flex flex-wrap gap-x-2 gap-y-1"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {STUDY_PREREGISTERED_OPTIONS.map((option) => (
                              <ToggleGroupItem
                                key={option}
                                value={option}
                                variant="pill"
                                size="sm"
                              >
                                {option}
                              </ToggleGroupItem>
                            ))}
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
                            className="flex flex-wrap gap-x-2 gap-y-1"
                            type="multiple"
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            {COUNTRY_OPTIONS.map((option) => (
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
                              onClick={() => field.onChange(COUNTRY_OPTIONS)}
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

              <Button
                type="submit"
                disabled={status != "Ready"}
                className="h-auto w-fit rounded-full "
              >
                Run meta-analysis
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
