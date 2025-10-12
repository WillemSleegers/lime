"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"

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
} from "@/components/filter-fields/intervention-fields"
import {
  OutcomeCategories,
  OutcomeMeasurementType,
  outcomeCategoriesFields,
  addOutcomeCategoriesRefinement,
} from "@/components/filter-fields/outcome-fields"
import {
  StudyPreregistration,
  StudyDataAvailable,
  StudyDesign,
  StudyConditionAssignment,
  StudyRandomization,
  studyFiltersFields,
} from "@/components/filter-fields/study-fields"
import {
  PaperYear,
  PaperType,
  PaperOpenAccess,
  paperFiltersFields,
} from "@/components/filter-fields/paper-fields"
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
    ...studyFiltersFields,
    ...paperFiltersFields,
  })
)

type FiltersProps = {
  status: string
  setData: Dispatch<SetStateAction<Data | undefined>>
}

export const Filters = ({ status, setData }: FiltersProps) => {
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
      study_data_available: META_ANALYSIS_DEFAULTS.study_data_available,
      study_design: META_ANALYSIS_DEFAULTS.study_design,
      study_condition_assignment: META_ANALYSIS_DEFAULTS.study_condition_assignment,
      study_randomization: META_ANALYSIS_DEFAULTS.study_randomization,
      paper_year: META_ANALYSIS_DEFAULTS.paper_year,
      paper_type: META_ANALYSIS_DEFAULTS.paper_type,
      paper_open_access: META_ANALYSIS_DEFAULTS.paper_open_access,
    },
  })

  const onInvalid = () => {
    form.setError("root", {
      type: "manual",
      message: "Please fix the errors above and try again.",
    })
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

    // Filter on data availability
    subset = subset.filter((datum) => {
      return values.study_data_available.some((value) =>
        datum.study_data_available.includes(value)
      )
    })

    // Filter on study design
    subset = subset.filter((datum) => {
      return values.study_design.some((value) =>
        datum.study_design.includes(value)
      )
    })

    // Filter on condition assignment
    subset = subset.filter((datum) => {
      return values.study_condition_assignment.some((value) =>
        datum.study_condition_assignment.includes(value)
      )
    })

    // Filter on randomization
    subset = subset.filter((datum) => {
      return values.study_randomization.some((value) =>
        datum.study_randomization.includes(value)
      )
    })

    // Filter on paper year
    subset = subset.filter(
      (datum) =>
        datum.paper_year >= values.paper_year[0] &&
        datum.paper_year <= values.paper_year[1]
    )

    // Filter on paper type
    subset = subset.filter((datum) => {
      return values.paper_type.some((paper_type) =>
        datum.paper_type.includes(paper_type)
      )
    })

    // Filter on paper open access
    subset = subset.filter((datum) => {
      return values.paper_open_access.some((open_access) =>
        datum.paper_open_access.includes(open_access)
      )
    })

    if (subset.length == 0) {
      form.setError("root", {
        type: "manual",
        message:
          "No papers match these criteria; please relax the inclusion criteria to include effects from more papers",
      })
      return
    } else if (new Set(subset.map((d) => d.paper)).size < 2) {
      form.setError("root", {
        type: "manual",
        message:
          "Only 1 paper matches these criteria; please relax the inclusion criteria to include effects from more papers",
      })
      return
    }

    setData(subset)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-10">
        {/* Levels */}
        <div className="space-y-8">
          {/* Paper-level */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Papers</h2>
              <p className="text-sm text-muted-foreground">
                Filter by publication characteristics
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6 items-start">
              <PaperYear
                control={form.control}
                minYear={Math.min(...data.map((datum) => datum.paper_year))}
                maxYear={Math.max(...data.map((datum) => datum.paper_year))}
              />
              <PaperType control={form.control} />
              <PaperOpenAccess control={form.control} />
            </div>
          </div>
          <Separator />
          {/* Study-level */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Studies</h2>
              <p className="text-sm text-muted-foreground">
                Filter by study design and methodology
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6 items-start">
              <StudyPreregistration control={form.control} />
              <StudyDataAvailable control={form.control} />
              <StudyDesign control={form.control} />
              <StudyConditionAssignment control={form.control} />
              <StudyRandomization control={form.control} />
            </div>
          </div>
          <Separator />
          {/* Outcome-level */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Outcomes</h2>
              <p className="text-sm text-muted-foreground">
                Select types of outcomes to include
              </p>
            </div>
            <div className="space-y-6">
              <OutcomeCategories control={form.control} />
              <OutcomeMeasurementType control={form.control} />
            </div>
          </div>
          <Separator />
          {/* Intervention-level */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Interventions</h2>
              <p className="text-sm text-muted-foreground">
                Filter by intervention characteristics
              </p>
            </div>
            <div className="space-y-6">
              <InterventionFilters control={form.control} />
            </div>
          </div>
          <Separator />
          {/* Samples-level */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Samples</h2>
              <p className="text-sm text-muted-foreground">
                Filter by sample characteristics
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
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
              <FormField
                control={form.control}
                name="sample_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Minimum sample size
                    </FormLabel>
                    <FormDescription>
                      Minimum per control or intervention condition
                    </FormDescription>
                    <FormControl>
                      <Input
                        className="rounded-lg bg-white"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={status !== "Ready"}
            className="h-auto rounded-lg w-fit"
          >
            Apply filters
          </Button>
          {form.formState.errors.root && (
            <div className="text-destructive text-sm font-semibold">
              {form.formState.errors.root.message}
            </div>
          )}
        </div>
      </form>
    </Form>
  )
}
