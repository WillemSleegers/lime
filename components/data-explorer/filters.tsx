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
import { Input } from "@/components/ui/input"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
} from "@/constants/constants-filters"

import { Toggle } from "../ui/toggle"
import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react"

/* Paper-level */
const formSchemaPapers = z.object({
  paper_year: z.number().array(),
  paper_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  paper_open_access: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterPapersProps = {
  data: {
    paper_year: number
    paper_type: string
    paper_open_access: string
  }[]
  setData: Function
  lock: boolean
  setLock: Function
  setShouldHandleLocks: Function
}

export const FilterPapers = (props: FilterPapersProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

  const form = useForm<z.infer<typeof formSchemaPapers>>({
    resolver: zodResolver(formSchemaPapers),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      paper_year: [
        Math.min(...data.map((datum) => datum.paper_year)),
        Math.max(...data.map((datum) => datum.paper_year)),
      ],
      paper_type: PAPER_TYPE_OPTIONS,
      paper_open_access: PAPER_OPEN_ACCESS_OPTIONS,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaPapers>) {
    let subset = data

    subset = subset.filter(
      (datum) =>
        datum.paper_year >= values.paper_year[0] &&
        datum.paper_year <= values.paper_year[1]
    )

    subset = subset.filter((datum) => {
      return values.paper_type.some((paper_type) =>
        datum.paper_type.includes(paper_type)
      )
    })

    subset = subset.filter((datum) => {
      return values.paper_open_access.some((open_acess) =>
        datum.paper_open_access.includes(open_acess)
      )
    })

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <FormField
              control={form.control}
              name="paper_year"
              render={({ field }) => (
                <FormItem className="w-60 flex flex-col gap-3">
                  <FormLabel>Publication year</FormLabel>
                  <FormControl>
                    <Slider
                      className="my-2"
                      value={field.value}
                      minStepsBetweenThumbs={1}
                      max={Math.max(...data.map((datum) => datum.paper_year))}
                      min={Math.min(...data.map((datum) => datum.paper_year))}
                      step={1}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    From {field.value[0]} to {field.value[1]}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paper_type"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Paper type</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {PAPER_TYPE_OPTIONS.map((option) => (
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
            <FormField
              control={form.control}
              name="paper_open_access"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Open access</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {PAPER_OPEN_ACCESS_OPTIONS.map((option) => (
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
            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-full text-white">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLock((prev: boolean) => !prev)
                setShouldHandleLocks(true)
              }}
            >
              {lock ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}

/* Study-level */
const formSchemaStudies = z.object({
  study_n: z.coerce.number().min(1),
  study_pregistered: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_data_available: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterStudiesProps = {
  data: {
    study_n: number
    study_preregistered: string
    study_pregistration_link?: string
    study_data_available: string
    study_data_link?: string
  }[]
  setData: Function
  lock: boolean
  setLock: Function
  setShouldHandleLocks: Function
}

export const FilterStudies = (props: FilterStudiesProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

  const form = useForm<z.infer<typeof formSchemaStudies>>({
    resolver: zodResolver(formSchemaStudies),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      study_n: 1,
      study_pregistered: STUDY_PREREGISTERED_OPTIONS,
      study_data_available: STUDY_DATA_AVAILABLE_OPTIONS,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaStudies>) {
    let subset = data

    subset = subset.filter((datum) => {
      return datum.study_n > values.study_n
    })

    subset = subset.filter((datum) => {
      return values.study_pregistered.some((value) =>
        datum.study_preregistered.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.study_data_available.some((value) =>
        datum.study_data_available.includes(value)
      )
    })

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="study_n"
              render={({ field }) => (
                <FormItem className="w-60">
                  <FormLabel>Minimum sample size</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-2xl bg-white"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the total sample size across all conditions in a
                    study
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_pregistered"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Preregistered</FormLabel>
                  <FormControl>
                    <ToggleGroup
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

            <FormField
              control={form.control}
              name="study_data_available"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Data available</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {STUDY_DATA_AVAILABLE_OPTIONS.map((option) => (
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
            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-full text-white">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLock((prev: boolean) => !prev)
                setShouldHandleLocks(true)
              }}
            >
              {lock ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}

/* Intervention-level */
const formSchemaInterventions = z.object({
  intervention_content: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_mechanism: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_medium: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterInterventionsProps = {
  data: {
    intervention_content: string
    intervention_mechanism: string
    intervention_medium: string
  }[]
  setData: Function
  lock: boolean
  setLock: Function
  setShouldHandleLocks: Function
}

export const FilterInterventions = (props: FilterInterventionsProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

  const form = useForm<z.infer<typeof formSchemaInterventions>>({
    resolver: zodResolver(formSchemaInterventions),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      intervention_content: INTERVENTION_CONTENT_OPTIONS,
      intervention_mechanism: INTERVENTION_MECHANISM_OPTIONS,
      intervention_medium: INTERVENTION_MEDIUM_OPTIONS,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaInterventions>) {
    let subset = data

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

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="intervention_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormDescription>
                    Content categories of the appeals used in the interventions
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="flex flex-wrap gap-x-2"
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
            <FormField
              control={form.control}
              name="intervention_mechanism"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mechanism</FormLabel>
                  <FormDescription>
                    The psychological mechanisms targeted by the interventions
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="flex flex-wrap gap-x-2"
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
            <FormField
              control={form.control}
              name="intervention_medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <FormDescription>
                    The medium in which the interventions are adminstered
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      className="flex flex-wrap gap-x-2"
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
            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-full text-white">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLock((prev: boolean) => !prev)
                setShouldHandleLocks(true)
              }}
            >
              {lock ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}

/* Outcome-level */
const formSchemaOutcomes = z
  .object({
    outcome_subcategory_behavior: z.string().array(),
    outcome_subcategory_intention: z.string().array(),
    outcome_subcategory_attitude: z.string().array(),
    outcome_measurement_type: z
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

type FilterOutcomesProps = {
  data: {
    outcome_category: string
    outcome_subcategory: string
    outcome_measurement_type: string
  }[]
  setData: Function
  lock: boolean
  setLock: Function
  setShouldHandleLocks: Function
}

export const FilterOutcomes = (props: FilterOutcomesProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

  const form = useForm<z.infer<typeof formSchemaOutcomes>>({
    resolver: zodResolver(formSchemaOutcomes),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      outcome_subcategory_behavior: OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
      outcome_subcategory_intention: OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
      outcome_subcategory_attitude: OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
      outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaOutcomes>) {
    let subset = data

    const outcome_subcategory = [
      ...values.outcome_subcategory_behavior,
      ...values.outcome_subcategory_intention,
      ...values.outcome_subcategory_attitude,
    ]

    subset = subset.filter((datum) => {
      return outcome_subcategory.some(
        (value) => datum.outcome_subcategory === value
      )
    })

    subset = subset.filter((datum) => {
      return values.outcome_measurement_type.some(
        (value) => datum.outcome_measurement_type === value
      )
    })

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-col gap-x-12 gap-y-3">
            <FormLabel>Outcome categories</FormLabel>
            <div className="space-y-3 px-3">
              <FormField
                control={form.control}
                name="outcome_subcategory_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Behaviors</FormLabel>
                    <FormControl className="justify-start">
                      <ToggleGroup
                        className="my-2 flex flex-wrap gap-x-2"
                        type="multiple"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS.map((option) => (
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
                            field.onChange(OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS)
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
                    <FormLabel>Intentions</FormLabel>
                    <FormControl className="justify-start">
                      <ToggleGroup
                        className="my-2 flex flex-wrap gap-x-2"
                        type="multiple"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {OUTCOME_SUBCATEGORY_INTENTION_OPTIONS.map((option) => (
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
                    <FormLabel>Attitudes/beliefs</FormLabel>
                    <FormControl className="justify-start">
                      <ToggleGroup
                        className="my-2 flex flex-wrap gap-x-2"
                        type="multiple"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS.map((option) => (
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
                            field.onChange(OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS)
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
            <FormField
              control={form.control}
              name="outcome_measurement_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement type</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="my-2 flex flex-wrap gap-x-2"
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

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-full text-white">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLock((prev: boolean) => !prev)
                setShouldHandleLocks(true)
              }}
            >
              {lock ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}

const formSchemaEffects = z.object({
  effect_size: z.number().array(),
  sample_size: z.coerce.number().min(1),
})

type FilterEffectsProps = {
  data: {
    effect_size: number
    effect_intervention_n: number
    effect_control_n: number
  }[]
  setData: Function
  lock: boolean
  setLock: Function
  setShouldHandleLocks: Function
}

export const FilterEffects = (props: FilterEffectsProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

  const effect_size_min = Math.min(...data.map((datum) => datum.effect_size))
  const effect_size_max = Math.max(...data.map((datum) => datum.effect_size))

  const form = useForm<z.infer<typeof formSchemaEffects>>({
    resolver: zodResolver(formSchemaEffects),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      effect_size: [effect_size_min, effect_size_max],
      sample_size: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaEffects>) {
    let subset = data

    subset = subset.filter(
      (datum) =>
        datum.effect_size >= values.effect_size[0] &&
        datum.effect_size <= values.effect_size[1]
    )

    const sample_size = Number(values.sample_size)

    subset = subset.filter(
      (datum) =>
        datum.effect_intervention_n >= sample_size &&
        datum.effect_control_n >= sample_size
    )

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <FormField
              control={form.control}
              name="effect_size"
              render={({ field }) => (
                <FormItem className="w-60 flex flex-col gap-3">
                  <FormLabel>Effect size</FormLabel>
                  <FormControl>
                    <Slider
                      className="my-2"
                      value={field.value}
                      minStepsBetweenThumbs={0.1}
                      min={effect_size_min}
                      max={effect_size_max}
                      step={0.1}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    From {field.value[0].toFixed(2)} to{" "}
                    {field.value[1].toFixed(2)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sample_size"
              render={({ field }) => (
                <FormItem className="w-60">
                  <FormLabel>Minimum sample size</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white rounded-2xl"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="leading-5">
                    This is the minimum sample size in either the control or
                    intervention condition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-full text-white">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLock((prev: boolean) => !prev)
                setShouldHandleLocks(true)
              }}
            >
              {lock ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
