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

const StyledToggleGroupItem = ({ option }: { option: string }) => {
  return (
    <ToggleGroupItem
      value={option}
      aria-label={"toggle" + option}
      className="bg-background hover:bg-primary hover:text-foreground data-[state=on]:bg-primary rounded-full border whitespace-nowrap data-[state=on]:text-white"
      size="sm"
    >
      {option}
    </ToggleGroupItem>
  )
}

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
}

export const FilterPapers = (props: FilterPapersProps) => {
  const { data, setData } = props

  const paper_type_options = [...new Set(data.map((d) => d.paper_type))]
  const paper_open_access_options = [
    ...new Set(data.map((d) => d.paper_open_access)),
  ]

  const form = useForm<z.infer<typeof formSchemaPapers>>({
    resolver: zodResolver(formSchemaPapers),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      paper_year: [
        Math.min(...data.map((datum) => datum.paper_year)),
        Math.max(...data.map((datum) => datum.paper_year)),
      ],
      paper_type: paper_type_options,
      paper_open_access: paper_open_access_options,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaPapers>) {
    let subset = data

    subset = subset.filter(
      (datum) =>
        datum.paper_year >= values.paper_year[0] &&
        datum.paper_year <= values.paper_year[1],
    )

    subset = subset.filter((datum) => {
      return values.paper_type.some((paper_type) =>
        datum.paper_type.includes(paper_type),
      )
    })

    subset = subset.filter((datum) => {
      return values.paper_open_access.some((open_acess) =>
        datum.paper_open_access.includes(open_acess),
      )
    })

    setData(subset)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="paper_year"
              render={({ field }) => (
                <FormItem className="w-60">
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
                <FormItem>
                  <FormLabel>Paper type</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="my-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {paper_type_options.map((option) => (
                        <StyledToggleGroupItem key={option} option={option} />
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
                <FormItem>
                  <FormLabel>Open access</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="my-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {paper_open_access_options.map((option) => (
                        <StyledToggleGroupItem key={option} option={option} />
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

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
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
}

export const FilterStudies = (props: FilterStudiesProps) => {
  const { data, setData } = props

  const study_preregistered_options = [
    ...new Set(data.map((d) => d.study_preregistered)),
  ]
  const study_data_available_options = [
    ...new Set(data.map((d) => d.study_data_available)),
  ]

  const form = useForm<z.infer<typeof formSchemaStudies>>({
    resolver: zodResolver(formSchemaStudies),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      study_n: 1,
      study_pregistered: study_preregistered_options,
      study_data_available: study_data_available_options,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaStudies>) {
    let subset = data

    subset = subset.filter((datum) => {
      return datum.study_n > values.study_n
    })

    subset = subset.filter((datum) => {
      return values.study_pregistered.some((value) =>
        datum.study_preregistered.includes(value),
      )
    })

    subset = subset.filter((datum) => {
      return values.study_data_available.some((value) =>
        datum.study_data_available.includes(value),
      )
    })

    setData(subset)
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
                    <Input className="my-2" type="number" {...field} />
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
                <FormItem>
                  <FormLabel>Preregistered</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="my-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {study_preregistered_options.map((option) => (
                        <StyledToggleGroupItem key={option} option={option} />
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
                <FormItem>
                  <FormLabel>Data available</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      className="my-2"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {study_data_available_options.map((option, i) => (
                        <StyledToggleGroupItem key={option} option={option} />
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

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
        </form>
      </Form>
    </FilterCollapsible>
  )
}

/* Intervention-level */
const formSchemaInterventions = z.object({
  intervention_appeal: z
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
    intervention_appeal: string
    intervention_mechanism: string
    intervention_medium: string
  }[]
  setData: Function
}

export const FilterInterventions = (props: FilterInterventionsProps) => {
  const { data, setData } = props

  const intervention_appeal_options = [
    ...new Set(
      data
        .map((datum) => datum.intervention_appeal)
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

  const form = useForm<z.infer<typeof formSchemaInterventions>>({
    resolver: zodResolver(formSchemaInterventions),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      intervention_appeal: intervention_appeal_options,
      intervention_mechanism: intervention_mechanism_options,
      intervention_medium: intervention_medium_options,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaInterventions>) {
    let subset = data

    subset = subset.filter((datum) => {
      return values.intervention_appeal.some((appeal) =>
        datum.intervention_appeal.includes(appeal),
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_mechanism.some((mechanism) =>
        datum.intervention_mechanism.includes(mechanism),
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_medium.some((medium) =>
        datum.intervention_medium.includes(medium),
      )
    })

    setData(subset)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="intervention_appeal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of appeal</FormLabel>
                  <FormDescription>
                    Content categories of different appeals used in the
                    intervention
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="flex flex-wrap gap-x-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {intervention_appeal_options.map((option) => (
                        <StyledToggleGroupItem key={option} option={option} />
                      ))}
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
                        onClick={() =>
                          field.onChange(intervention_appeal_options)
                        }
                      >
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
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
                    The psychological mechanism targeted by the intervention
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="flex flex-wrap gap-x-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {intervention_mechanism_options.map((option) => (
                        <StyledToggleGroupItem key={option} option={option} />
                      ))}
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
                        onClick={() =>
                          field.onChange(intervention_mechanism_options)
                        }
                      >
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
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
                    The medium in which the intervention was adminstered
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      className="flex flex-wrap gap-x-2"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {intervention_medium_options.map((option) => (
                        <StyledToggleGroupItem key={option} option={option} />
                      ))}
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
                        onClick={() =>
                          field.onChange(intervention_medium_options)
                        }
                      >
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
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

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
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
        path: ["error-test"],
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
}

export const FilterOutcomes = (props: FilterOutcomesProps) => {
  const { data, setData } = props

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

  const form = useForm<z.infer<typeof formSchemaOutcomes>>({
    resolver: zodResolver(formSchemaOutcomes),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      outcome_subcategory_behavior: outcome_subcategory_behavior_options,
      outcome_subcategory_intention: outcome_subcategory_intention_options,
      outcome_subcategory_attitude: outcome_subcategory_attitude_options,
      outcome_measurement_type: outcome_measurement_type_options,
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
        (value) => datum.outcome_subcategory === value,
      )
    })

    subset = subset.filter((datum) => {
      return values.outcome_measurement_type.some(
        (value) => datum.outcome_measurement_type === value,
      )
    })

    setData(subset)
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
                        {outcome_subcategory_behavior_options.map((option) => (
                          <StyledToggleGroupItem key={option} option={option} />
                        ))}
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto"
                          onClick={() =>
                            field.onChange(outcome_subcategory_behavior_options)
                          }
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto"
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
                        {outcome_subcategory_intention_options.map((option) => (
                          <StyledToggleGroupItem key={option} option={option} />
                        ))}
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto"
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
                          className="text-foreground h-auto"
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
                        {outcome_subcategory_attitude_options.map((option) => (
                          <StyledToggleGroupItem key={option} option={option} />
                        ))}
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto"
                          onClick={() =>
                            field.onChange(outcome_subcategory_attitude_options)
                          }
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto"
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
              name="error-test"
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
                      {outcome_measurement_type_options.map((option) => (
                        <StyledToggleGroupItem key={option} option={option} />
                      ))}
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
                        onClick={() =>
                          field.onChange(outcome_measurement_type_options)
                        }
                      >
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto"
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

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
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
    effect_size_value: number
    effect_intervention_n: number
    effect_control_n: number
  }[]
  setData: Function
}

export const FilterEffects = (props: FilterEffectsProps) => {
  const { data, setData } = props

  const effect_size_min = Math.min(
    ...data.map((datum) => datum.effect_size_value),
  )
  const effect_size_max = Math.max(
    ...data.map((datum) => datum.effect_size_value),
  )

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
        datum.effect_size_value >= values.effect_size[0] &&
        datum.effect_size_value <= values.effect_size[1],
    )

    const sample_size = Number(values.sample_size)

    subset = subset.filter(
      (datum) =>
        datum.effect_intervention_n >= sample_size &&
        datum.effect_control_n >= sample_size,
    )

    setData(subset)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="effect_size"
              render={({ field }) => (
                <FormItem className="w-60">
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

            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
