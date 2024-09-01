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
import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn, round } from "@/lib/utils"
import { FilterInput } from "./filters/input"
import { Separator } from "@/components/ui/separator"

import { Data, filterTableData, getOptions } from "@/lib/json-functions"
import { MultiPillsForm } from "./form/multi-pills-form"
import { Slider } from "./ui/slider"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

import {
  PAPER_COLUMNS,
  PAPER_COLUMNS_DEFAULT,
  STUDY_COLUMNS,
  STUDY_COLUMNS_DEFAULT,
  INTERVENTION_COLUMNS,
  INTERVENTION_COLUMNS_DEFAULT,
  OUTCOME_COLUMNS,
  OUTCOME_COLUMNS_DEFAULT,
  SAMPLE_COLUMNS,
  SAMPLE_COLUMNS_DEFAULT,
  EFFECT_COLUMNS,
  EFFECT_COLUMNS_DEFAULT,
} from "@/lib/constants"
import { DataTableColumns } from "./tables/databank/data-columns"

const intervention_aspects = getOptions("intervention_aspect")
const intervention_mediums = getOptions("intervention_medium")
const intervention_appeals = getOptions("intervention_appeal")
const behaviors = getOptions("behaviors")
const intentions = getOptions("intentions")
const attitudes = getOptions("attitudes")
const measurements = getOptions("outcome_measurement_type")
const countries = getOptions("sample_intervention_country")

const formSchema = z.object({
  paper_columns: z.string().array(),
  paper_year: z.number().array(),
  paper_open_access: z.string().optional(),
  paper_data_available: z.string().optional(),
  study_columns: z.string().array(),
  study_n: z.coerce.number().min(1),
  intervention_columns: z.string().array(),
  intervention_aspect: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention aspect." }),
  intervention_medium: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention medium." }),
  intervention_appeal: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one intervention appeal." }),
  outcome_columns: z.string().array(),
  outcomes: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome." }),
  measurements: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome measurement." }),
  sample_columns: z.string().array(),
  sample_country: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one country." }),
  effect_columns: z.string().array(),
  effect_cell_size: z.coerce.number().min(1),
  effect_size: z.number().array(),
})

type DataExplorerFilterProps = {
  data: Data
  setColumns: Function
  setData: Function
}

export const DataExplorerFilter = (props: DataExplorerFilterProps) => {
  const { data, setColumns, setData } = props

  const [open, setOpen] = useState(false)
  const [openPaper, setOpenPaper] = useState(true)
  const [openStudy, setOpenStudy] = useState(true)
  const [openIntervention, setOpenIntervention] = useState(true)
  const [openOutcome, setOpenOutcome] = useState(true)
  const [openSample, setOpenSample] = useState(true)
  const [openEffect, setOpenEffect] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paper_columns: PAPER_COLUMNS_DEFAULT,
      paper_year: [
        Math.min(...data.map((datum) => datum.paper_year)),
        Math.max(...data.map((datum) => datum.paper_year)),
      ],
      study_columns: STUDY_COLUMNS_DEFAULT,
      study_n: 1,
      intervention_columns: INTERVENTION_COLUMNS_DEFAULT,
      intervention_aspect: ["animal welfare"],
      intervention_medium: ["text"],
      intervention_appeal: ["factual"],
      outcome_columns: OUTCOME_COLUMNS_DEFAULT,
      outcomes: ["meat consumption", "meat consumption intention"],
      measurements: ["survey"],
      sample_columns: SAMPLE_COLUMNS_DEFAULT,
      sample_country: countries.map((country) => country.value),
      effect_columns: EFFECT_COLUMNS_DEFAULT,
      effect_size: [
        round(Math.min(...data.map((datum) => datum.effect_size_value)), 2),
        round(Math.max(...data.map((datum) => datum.effect_size_value)), 2),
      ],
      effect_cell_size: 1,
    },
    mode: "onSubmit",
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let subset = data

    // Paper-level filters
    subset = subset.filter(
      (datum) =>
        datum.paper_year >= values.paper_year[0] &&
        datum.paper_year <= values.paper_year[1],
    )

    if (values.paper_open_access) {
      subset = subset.filter(
        (datum) => datum.paper_open_access == values.paper_open_access,
      )
    }

    if (values.paper_data_available) {
      subset = subset.filter(
        (datum) => datum.paper_data_available == values.paper_data_available,
      )
    }

    // Study-level filters
    subset = subset.filter((datum) => datum.study_n >= values.study_n)

    // Intervention-level filters
    subset = subset.filter((datum) => {
      return values.intervention_aspect.some(
        (aspect) =>
          datum.intervention_aspect.includes(aspect.toLowerCase()) ||
          datum.intervention_aspect == "",
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_medium.some(
        (medium) =>
          datum.intervention_medium?.includes(medium.toLowerCase()) ||
          datum.intervention_medium == "",
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_appeal.some(
        (appeal) =>
          datum.intervention_appeal.includes(appeal.toLowerCase()) ||
          datum.intervention_appeal == "",
      )
    })

    // Outcome-level filters
    subset = data.filter((datum) =>
      values.outcomes.includes(datum.outcome_subcategory),
    )

    subset = subset.filter((datum) => {
      return values.measurements.some((measurement) =>
        datum.outcome_measurement_type.includes(measurement.toLowerCase()),
      )
    })

    // Sample-level filters
    // Note: Filtering country on intervention country only
    subset = subset.filter((e) =>
      values.sample_country.includes(e.sample_intervention_country),
    )

    // Effect-level filters
    subset = subset.filter(
      (datum) =>
        datum.effect_size_value >= values.effect_size[0] &&
        datum.effect_size_value <= values.effect_size[1],
    )

    subset = subset.filter(
      (datum) =>
        datum.effect_control_n > values.effect_cell_size &&
        datum.effect_intervention_n > values.effect_cell_size,
    )

    // Select only relevant columns
    const selectedColumns = ["paper_label"].concat(
      values.paper_columns,
      values.study_columns,
      values.intervention_columns,
      values.outcome_columns,
      values.sample_columns,
      values.effect_columns,
    )

    const newColumns = DataTableColumns.filter((column: any) =>
      selectedColumns.includes(column.id),
    )

    subset = filterTableData(subset, selectedColumns)

    setColumns(newColumns)
    setData(subset)
  }

  return (
    <Collapsible
      className="space-y-3 rounded-lg border bg-gray-100 p-3"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex flex-row items-center gap-1">
        <h2 className="text-xl font-bold tracking-tight">Filter table</h2>
        <ChevronRight
          className={cn("transition", open ? "rotate-90" : "rotate-0")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3 space-y-4">
              <Collapsible
                className="space-y-3 rounded-lg bg-gray-100"
                open={openPaper}
                onOpenChange={setOpenPaper}
              >
                <CollapsibleTrigger className="flex flex-row items-center gap-1">
                  <h3 className="text-xl font-semibold">Paper-info</h3>
                  <ChevronRight
                    className={cn(
                      "transition",
                      openPaper ? "rotate-90" : "rotate-0",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent space-y-3 ps-3">
                  <FormField
                    control={form.control}
                    name="paper_columns"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">Columns</FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={PAPER_COLUMNS}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="paper_year"
                    render={({ field }) => (
                      <FormItem className="max-w-60">
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Publication year
                            </FormLabel>
                            <FormDescription>
                              From {field.value[0]} to {field.value[1]}
                            </FormDescription>
                            <Slider
                              defaultValue={field.value}
                              minStepsBetweenThumbs={1}
                              max={Math.max(
                                ...data.map((datum) => datum.paper_year),
                              )}
                              min={Math.min(
                                ...data.map((datum) => datum.paper_year),
                              )}
                              step={1}
                              onValueChange={field.onChange}
                              className={cn("w-full")}
                            />
                          </>
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
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Open access
                            </FormLabel>
                            <FormDescription></FormDescription>
                            <ToggleGroup
                              type="single"
                              onValueChange={field.onChange}
                              className="justify-start"
                            >
                              <ToggleGroupItem
                                value="yes"
                                aria-label="Include open access papers"
                                className="w-12 rounded-full bg-black/5 hover:bg-primary/80 hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                              >
                                yes
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="no"
                                aria-label="Exclude open access papers"
                                className="w-12 rounded-full bg-black/5 hover:bg-primary/80 hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                              >
                                no
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paper_data_available"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Data available
                            </FormLabel>
                            <FormDescription></FormDescription>
                            <ToggleGroup
                              type="single"
                              onValueChange={field.onChange}
                              className="justify-start"
                            >
                              <ToggleGroupItem
                                value="yes"
                                aria-label="Include data available papers"
                                className="w-12 rounded-full bg-black/5 hover:bg-primary/80 hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                              >
                                yes
                              </ToggleGroupItem>
                              <ToggleGroupItem
                                value="no"
                                aria-label="Exclude data available papers"
                                className="w-12 rounded-full bg-black/5 hover:bg-primary/80 hover:text-secondary-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                              >
                                no
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
              <Collapsible
                className="space-y-3 rounded-lg bg-gray-100"
                open={openStudy}
                onOpenChange={setOpenStudy}
              >
                <CollapsibleTrigger className="flex flex-row items-center gap-1">
                  <h3 className="text-xl font-semibold">Study-info</h3>
                  <ChevronRight
                    className={cn(
                      "transition",
                      openStudy ? "rotate-90" : "rotate-0",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent space-y-3 ps-3">
                  <FormField
                    control={form.control}
                    name="study_columns"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">Columns</FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={STUDY_COLUMNS}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FilterInput
                    form={form}
                    name="study_n"
                    label="Minimum number of observations"
                    description="This refers to the number of recruited participants or recorded sales in a study."
                    placeholder="1"
                    type="number"
                  />
                </CollapsibleContent>
              </Collapsible>
              <Collapsible
                className="space-y-3 rounded-lg bg-gray-100"
                open={openIntervention}
                onOpenChange={setOpenIntervention}
              >
                <CollapsibleTrigger className="flex flex-row items-center gap-1">
                  <h3 className="text-xl font-semibold">Intervention-info</h3>
                  <ChevronRight
                    className={cn(
                      "transition",
                      openIntervention ? "rotate-90" : "rotate-0",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent space-y-3 ps-3">
                  <FormField
                    control={form.control}
                    name="intervention_columns"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">Columns</FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={INTERVENTION_COLUMNS}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="intervention_aspect"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Intervention aspect
                            </FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={intervention_aspects}
                            />
                          </>
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
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Intervention medium
                            </FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={intervention_mediums}
                            />
                          </>
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
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Intervention appeal
                            </FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={intervention_appeals}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
              <Collapsible
                className="space-y-3 rounded-lg bg-gray-100"
                open={openOutcome}
                onOpenChange={setOpenOutcome}
              >
                <CollapsibleTrigger className="flex flex-row items-center gap-1">
                  <h3 className="text-xl font-semibold">Outcome-info</h3>
                  <ChevronRight
                    className={cn(
                      "transition",
                      openOutcome ? "rotate-90" : "rotate-0",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent space-y-3 ps-3">
                  <FormField
                    control={form.control}
                    name="outcome_columns"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">Columns</FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={OUTCOME_COLUMNS}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="outcomes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-6">
                            <div>
                              <FormLabel className="text-base">
                                Behavior outcomes
                              </FormLabel>
                              <MultiPillsForm
                                field={field}
                                options={behaviors}
                              />
                            </div>
                            <div>
                              <FormLabel className="text-base">
                                Intention outcomes
                              </FormLabel>
                              <MultiPillsForm
                                field={field}
                                options={intentions}
                              />
                            </div>
                            <div>
                              <FormLabel className="text-base">
                                Attitude/belief outcomes
                              </FormLabel>
                              <MultiPillsForm
                                field={field}
                                options={attitudes}
                              />
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
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Measurement type
                            </FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={measurements}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
              <Collapsible
                className="space-y-3 rounded-lg bg-gray-100"
                open={openSample}
                onOpenChange={setOpenSample}
              >
                <CollapsibleTrigger className="flex flex-row items-center gap-1">
                  <h3 className="text-xl font-semibold">Sample-info</h3>
                  <ChevronRight
                    className={cn(
                      "transition",
                      openSample ? "rotate-90" : "rotate-0",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent space-y-3 ps-3">
                  <FormField
                    control={form.control}
                    name="sample_columns"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">Columns</FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={SAMPLE_COLUMNS}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="sample_country"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">Country</FormLabel>
                            <MultiPillsForm field={field} options={countries} />
                            <FormDescription>
                              N/A means the country information is not
                              available.
                            </FormDescription>
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>
              <Collapsible
                className="space-y-3 rounded-lg bg-gray-100"
                open={openEffect}
                onOpenChange={setOpenEffect}
              >
                <CollapsibleTrigger className="flex flex-row items-center gap-1">
                  <h3 className="text-xl font-semibold">Effect-info</h3>
                  <ChevronRight
                    className={cn(
                      "transition",
                      openEffect ? "rotate-90" : "rotate-0",
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="CollapsibleContent space-y-3 ps-3">
                  <FormField
                    control={form.control}
                    name="effect_columns"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <FormLabel className="text-base">Columns</FormLabel>
                            <FormDescription></FormDescription>
                            <MultiPillsForm
                              field={field}
                              options={EFFECT_COLUMNS}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <FormField
                    control={form.control}
                    name="effect_size"
                    render={({ field }) => (
                      <FormItem className="max-w-60">
                        <FormControl>
                          <>
                            <FormLabel className="text-base">
                              Effect size
                            </FormLabel>
                            <FormDescription>
                              From {field.value[0]} to {field.value[1]}
                            </FormDescription>
                            <Slider
                              defaultValue={field.value}
                              minStepsBetweenThumbs={0.5}
                              max={round(
                                Math.max(
                                  ...data.map(
                                    (datum) => datum.effect_size_value,
                                  ),
                                ),
                                2,
                              )}
                              min={round(
                                Math.min(
                                  ...data.map(
                                    (datum) => datum.effect_size_value,
                                  ),
                                ),
                                2,
                              )}
                              step={0.1}
                              onValueChange={field.onChange}
                              className={cn("w-full")}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FilterInput
                    form={form}
                    name="effect_cell_size"
                    label="Minimum cell size"
                    description="This is the minimum cell size in either the control or intervention condition."
                    placeholder="1"
                    type="number"
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Update table</Button>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  )
}
