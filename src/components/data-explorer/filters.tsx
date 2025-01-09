"use client"

import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

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

import { ToggleGroupAll } from "@/components/forms/toggle-group-all"
import { DataTableColumns } from "@/components/data-explorer/table-columns"

import { cn } from "@/lib/utils"

import { FilterCollapsible } from "./filter-collapsible"

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

const formSchemaStudies = z.object({
  study_n: z.number(),
  study_pregistered: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_data_available: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

const formSchemaInterventions = z.object({
  intervention_aspect: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_medium: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_appeal: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterPapersProps = {
  data: {
    paper: number
    paper_label: string
    paper_title: string
    paper_authors: string
    paper_year: number
    paper_type: string
    paper_open_access: string
  }[]
  setData: Function
}

type FilterStudiesProps = {
  data: {
    paper: number
    paper_label: string
    study: number
    study_n: number
    study_preregistered: string
    study_pregistration_link?: string
    study_data_available: string
    study_data_link?: string
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
    mode: "onChange",
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
                      defaultValue={field.value}
                      minStepsBetweenThumbs={1}
                      max={Math.max(...data.map((datum) => datum.paper_year))}
                      min={Math.min(...data.map((datum) => datum.paper_year))}
                      step={1}
                      onValueChange={field.onChange}
                      className={cn("w-full")}
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
                      type="multiple"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {paper_type_options.map((option, i) => (
                        <ToggleGroupItem
                          value={option}
                          key={"paper-type-" + i}
                          aria-label={"toggle" + option}
                          className="rounded-full border bg-background hover:bg-primary hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-white"
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
                <FormItem>
                  <FormLabel>Open access</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {paper_open_access_options.map((option, i) => (
                        <ToggleGroupItem
                          value={option}
                          key={"paper-open-access-" + i}
                          aria-label={"toggle" + option}
                          className="rounded-full border bg-background hover:bg-primary hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-white"
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

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
        </form>
      </Form>
    </FilterCollapsible>
  )
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
    mode: "onChange",
    defaultValues: {
      study_pregistered: study_preregistered_options,
      study_data_available: study_data_available_options,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaStudies>) {
    let subset = data

    console.log(values)

    subset = subset.filter((datum) => {
      return values.study_data_available.some((open_acess) =>
        datum.study_data_available.includes(open_acess),
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
                    <Input placeholder={"1"} type="number" {...field} />
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
                      type="multiple"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {study_preregistered_options.map((option, i) => (
                        <ToggleGroupItem
                          value={option}
                          key={"study-preregistered-" + i}
                          aria-label={"toggle" + option}
                          className="rounded-full border bg-background hover:bg-primary hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-white"
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
                <FormItem>
                  <FormLabel>Data available</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {study_data_available_options.map((option, i) => (
                        <ToggleGroupItem
                          value={option}
                          key={"study-data-available-" + i}
                          aria-label={"toggle" + option}
                          className="rounded-full border bg-background hover:bg-primary hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-white"
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

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
        </form>
      </Form>
    </FilterCollapsible>
  )
}

type FilterInterventionsProps = {
  data: {
    paper: number
    paper_label: string
    study: number
    intervention_appeal: string
    intervention_medium: string
    intervention_aspect: string
  }[]
  setData: Function
}

export const FilterInterventions = (props: FilterInterventionsProps) => {
  const { data, setData } = props

  const intervention_aspect_options = [
    ...new Set(
      data
        .map((datum) => datum.intervention_aspect)
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
  const intervention_appeal_options = [
    ...new Set(
      data
        .map((datum) => datum.intervention_appeal)
        .flatMap((str) => str.split(",").map((s) => s.trim())),
    ),
  ]

  const form = useForm<z.infer<typeof formSchemaInterventions>>({
    resolver: zodResolver(formSchemaInterventions),
    mode: "onChange",
    defaultValues: {
      intervention_aspect: intervention_aspect_options,
      intervention_medium: intervention_medium_options,
      intervention_appeal: intervention_appeal_options,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaInterventions>) {
    let subset = data

    console.log(values)

    setData(subset)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="intervention_aspect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aspect</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {intervention_aspect_options.map((option, i) => (
                        <ToggleGroupItem
                          value={option}
                          key={"intervention-aspect-" + i}
                          aria-label={"toggle" + option}
                          className="rounded-full border bg-background hover:bg-primary hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-white"
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
              name="intervention_medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {intervention_medium_options.map((option, i) => (
                        <ToggleGroupItem
                          value={option}
                          key={"intervention-medium-" + i}
                          aria-label={"toggle" + option}
                          className="rounded-full border bg-background hover:bg-primary hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-white"
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
              name="intervention_appeal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appeal</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="flex flex-wrap gap-3"
                      type="multiple"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {intervention_appeal_options.map((option, i) => (
                        <ToggleGroupItem
                          value={option}
                          key={"intervention-appeal-" + i}
                          aria-label={"toggle" + option}
                          className="whitespace-nowrap rounded-full border bg-background hover:bg-primary hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-white"
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

          <Button type="submit" className="h-auto rounded-full text-white">
            Update table
          </Button>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
