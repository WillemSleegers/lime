"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction } from "react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { CheckboxGroup } from "@/components/form/checkbox-group"
import { SliderField } from "@/components/form/slider-field"
import { InputField } from "@/components/form/input-field"
import { MultiSelectField } from "@/components/form/multi-select-field"
import {
  interventionFiltersFields,
  outcomeCategoriesFieldsNew,
  studyFiltersFields,
  paperFiltersFields,
} from "@/lib/filter-schemas"
import data from "@/assets/data/data.json"

import {
  COUNTRY_OPTIONS,
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  STUDY_RANDOMIZATION_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
  OUTCOME_CATEGORIES_GROUPED,
  INTERVENTION_MULTICOMPONENT_OPTIONS,
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
} from "@/constants/constants-filters"
import { META_ANALYSIS_DEFAULTS } from "@/constants/constants-meta-analysis"

import { Data } from "@/lib/types"

const formSchema = z.object({
  ...interventionFiltersFields,
  ...outcomeCategoriesFieldsNew,
  outcome_measurement_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one outcome measurement." }),
  sample_country: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one country." }),
  sample_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one sample type." }),
  sample_representative: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one representativeness option." }),
  effect_sample_size: z.coerce
    .number()
    .min(1, { message: "Must be a positive number." }) as z.ZodNumber,
  ...studyFiltersFields,
  ...paperFiltersFields,
})

type FiltersProps = {
  status: string
  setData: Dispatch<SetStateAction<Data | undefined>>
  onFiltersApplied: () => void
}

export const Filters = ({ status, setData, onFiltersApplied }: FiltersProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      outcome_subcategory: META_ANALYSIS_DEFAULTS.outcome_subcategory,
      outcome_measurement_type: META_ANALYSIS_DEFAULTS.outcome_measurement_type,
      intervention_multicomponent: META_ANALYSIS_DEFAULTS.intervention_multicomponent,
      intervention_content: META_ANALYSIS_DEFAULTS.intervention_content,
      intervention_mechanism: META_ANALYSIS_DEFAULTS.intervention_mechanism,
      intervention_medium: META_ANALYSIS_DEFAULTS.intervention_medium,
      sample_country: COUNTRY_OPTIONS,
      sample_type: META_ANALYSIS_DEFAULTS.sample_type,
      sample_representative: META_ANALYSIS_DEFAULTS.sample_representative,
      effect_sample_size: 1,
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
    subset = data.filter((datum) => {
      return values.outcome_subcategory.some(
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
        datum.effect_control_n >= values.effect_sample_size &&
        datum.effect_intervention_n >= values.effect_sample_size
    )

    // Filter on intervention aspect
    subset = subset.filter((datum) => {
      return values.intervention_multicomponent.some(
        (value) => datum.intervention_multicomponent === value
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_content.some((value) =>
        datum.intervention_content?.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_mechanism.some((value) =>
        datum.intervention_mechanism?.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_medium.some((value) =>
        datum.intervention_medium?.includes(value)
      )
    })

    // Filter on country
    subset = subset.filter((e) =>
      values.sample_country.includes(e.sample_country)
    )

    // Filter on sample type
    subset = subset.filter((datum) => {
      return values.sample_type.some((value) =>
        datum.sample_type.includes(value)
      )
    })

    // Filter on sample representativeness
    subset = subset.filter((datum) => {
      return values.sample_representative.some((value) =>
        datum.sample_representative.includes(value)
      )
    })

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
    onFiltersApplied()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        {/* Paper-level */}
        <Card>
          <CardHeader>
            <CardTitle>Papers</CardTitle>
            <CardDescription>
              Filter by publication characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 items-start">
              <SliderField
                control={form.control}
                name="paper_year"
                label="Publication year"
                min={Math.min(...data.map((datum) => datum.paper_year))}
                max={Math.max(...data.map((datum) => datum.paper_year))}
                minStepsBetweenThumbs={1}
                className="w-[200px]"
              />
              <div></div>
              <CheckboxGroup
                control={form.control}
                name="paper_type"
                label="Publication type"
                options={PAPER_TYPE_OPTIONS}
              />
              <CheckboxGroup
                control={form.control}
                name="paper_open_access"
                label="Access type"
                options={PAPER_OPEN_ACCESS_OPTIONS}
              />
            </div>
          </CardContent>
        </Card>

        {/* Study-level */}
        <Card>
          <CardHeader>
            <CardTitle>Studies</CardTitle>
            <CardDescription>
              Filter by study design and methodology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6 items-start">
              <CheckboxGroup
                control={form.control}
                name="study_preregistered"
                label="Preregistration"
                options={STUDY_PREREGISTERED_OPTIONS}
              />
              <CheckboxGroup
                control={form.control}
                name="study_data_available"
                label="Data availability"
                options={STUDY_DATA_AVAILABLE_OPTIONS}
              />
              <CheckboxGroup
                control={form.control}
                name="study_randomization"
                label="Randomization"
                options={STUDY_RANDOMIZATION_OPTIONS}
              />
              <CheckboxGroup
                control={form.control}
                name="study_design"
                label="Study design"
                options={STUDY_DESIGN_OPTIONS}
              />
              <CheckboxGroup
                control={form.control}
                name="study_condition_assignment"
                label="Condition assignment"
                options={STUDY_CONDITION_ASSIGNMENT_OPTIONS}
              />
            </div>
          </CardContent>
        </Card>

        {/* Samples-level */}
        <Card>
          <CardHeader>
            <CardTitle>Samples</CardTitle>
            <CardDescription>
              Filter by sample characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <MultiSelectField
                control={form.control}
                name="sample_country"
                label="Country"
                description="Countries where studies were conducted"
                placeholder="Select countries..."
                searchPlaceholder="Search countries..."
                searchEmptyMessage="No country found."
                options={COUNTRY_OPTIONS}
                className="w-full"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                <CheckboxGroup
                  control={form.control}
                  name="sample_representative"
                  label="Representativeness"
                  options={SAMPLE_REPRESENTATIVE_OPTIONS}
                />
                <CheckboxGroup
                  control={form.control}
                  name="sample_type"
                  label="Sample type"
                  options={SAMPLE_TYPE_OPTIONS}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intervention-level */}
        <Card>
          <CardHeader>
            <CardTitle>Interventions</CardTitle>
            <CardDescription>
              Filter by intervention characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <MultiSelectField
                control={form.control}
                name="intervention_content"
                label="Intervention content"
                description="Topics or arguments used to persuade people (e.g., animal welfare, health, environment)"
                placeholder="Select intervention content..."
                options={INTERVENTION_CONTENT_OPTIONS}
                className="w-full"
              />
              <MultiSelectField
                control={form.control}
                name="intervention_mechanism"
                label="Intervention mechanism"
                description="Persuasion strategies used by researchers (facts, emotions, social pressure, etc.)"
                placeholder="Select intervention mechanism..."
                options={INTERVENTION_MECHANISM_OPTIONS}
                className="w-full"
              />
              <MultiSelectField
                control={form.control}
                name="intervention_medium"
                label="Intervention medium"
                placeholder="Select intervention medium..."
                options={INTERVENTION_MEDIUM_OPTIONS}
                className="w-full"
              />
              <CheckboxGroup
                control={form.control}
                name="intervention_multicomponent"
                label="Intervention components"
                options={INTERVENTION_MULTICOMPONENT_OPTIONS}
              />
            </div>
          </CardContent>
        </Card>

        {/* Outcome-level */}
        <Card>
          <CardHeader>
            <CardTitle>Outcomes</CardTitle>
            <CardDescription>
              Select types of outcomes to include
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <MultiSelectField
                control={form.control}
                name="outcome_subcategory"
                label="Outcome categories"
                description="Choose between behaviors (actual consumption and food choices), intentions (plans to change diet), or attitudes/beliefs (moral views and feelings about meat)."
                placeholder="Select outcome categories..."
                searchPlaceholder="Search categories..."
                searchEmptyMessage="No category found."
                options={OUTCOME_CATEGORIES_GROUPED}
                className="w-full"
              />
              <CheckboxGroup
                control={form.control}
                name="outcome_measurement_type"
                label="Measurement type"
                options={OUTCOME_MEASUREMENT_TYPE_OPTIONS}
              />
            </div>
          </CardContent>
        </Card>

        {/* Effect-level */}
        <Card>
          <CardHeader>
            <CardTitle>Effects</CardTitle>
            <CardDescription>
              Filter by effect size characteristics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InputField
              control={form.control}
              name="effect_sample_size"
              label="Minimum sample size"
              description="Minimum per control or intervention condition"
              type="number"
              className="rounded-lg"
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={status !== "Ready"}
              className="h-auto rounded-lg w-fit px-6 py-3"
            >
              Apply filters and continue
            </Button>
            {status !== "Ready" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                <span>{status}</span>
              </div>
            )}
          </div>
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
