"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useCallback } from "react"

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
import { useFilterCounts, applyFilters } from "@/hooks/use-filter-counts"
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
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  INTERVENTION_MULTICOMPONENT_OPTIONS,
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
} from "@/constants/constants-filters"
import { META_ANALYSIS_DEFAULTS } from "@/constants/constants-meta-analysis"
import {
  loadFormValues,
  usePersistedForm,
  clearFormValues,
} from "@/hooks/use-persisted-form"

import { Data } from "@/lib/types"

// ── Schema ────────────────────────────────────────────────────────────────────

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

type FormValues = z.infer<typeof formSchema>

// ── Defaults ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "lime-meta-analysis-filters"

const defaults = {
  outcome_subcategory: [
    ...OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
    ...OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
    ...OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  ],
  outcome_measurement_type: META_ANALYSIS_DEFAULTS.outcome_measurement_type,
  intervention_multicomponent: META_ANALYSIS_DEFAULTS.intervention_multicomponent,
  intervention_content: META_ANALYSIS_DEFAULTS.intervention_content,
  intervention_mechanism: META_ANALYSIS_DEFAULTS.intervention_mechanism,
  intervention_medium: META_ANALYSIS_DEFAULTS.intervention_medium,
  sample_country: COUNTRY_OPTIONS,
  sample_type: SAMPLE_TYPE_OPTIONS.map((option) => option.value),
  sample_representative: SAMPLE_REPRESENTATIVE_OPTIONS.map((option) => option.value),
  effect_sample_size: 1,
  study_preregistered: META_ANALYSIS_DEFAULTS.study_preregistered,
  study_data_available: META_ANALYSIS_DEFAULTS.study_data_available,
  study_design: META_ANALYSIS_DEFAULTS.study_design,
  study_condition_assignment: META_ANALYSIS_DEFAULTS.study_condition_assignment,
  study_randomization: META_ANALYSIS_DEFAULTS.study_randomization,
  paper_year: META_ANALYSIS_DEFAULTS.paper_year,
  paper_type: META_ANALYSIS_DEFAULTS.paper_type,
  paper_open_access: PAPER_OPEN_ACCESS_OPTIONS.map((o) => o.value),
}

// ── Component ─────────────────────────────────────────────────────────────────

type FiltersProps = {
  status: string
  setData: Dispatch<SetStateAction<Data | undefined>>
  onFiltersApplied: () => void
}

export const Filters = ({ status, setData, onFiltersApplied }: FiltersProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: loadFormValues(STORAGE_KEY, defaults),
  })

  usePersistedForm(form, STORAGE_KEY)

  const handleReset = useCallback(() => {
    clearFormValues(STORAGE_KEY)
    form.reset(defaults)
  }, [form])

  const onInvalid = () => {
    form.setError("root", {
      type: "manual",
      message: "Please fix the errors above and try again.",
    })
  }

  const onSubmit = (values: FormValues) => {
    form.clearErrors("root")

    const subset = applyFilters(data, values)

    if (subset.length === 0) {
      form.setError("root", {
        type: "manual",
        message:
          "No papers match these criteria; please relax the inclusion criteria to include effects from more papers",
      })
      return
    }
    if (new Set(subset.map((d) => d.paper)).size < 2) {
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

  const values = form.watch()
  const counts = useFilterCounts(values)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6"
      >
        {/* Paper-level */}
        <Card>
          <CardHeader>
            <CardTitle>Papers</CardTitle>
            <CardDescription>Filter by publication characteristics</CardDescription>
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
                count={counts.total}
                className="w-50"
              />
              <div />
              <CheckboxGroup
                control={form.control}
                name="paper_type"
                label="Publication type"
                options={PAPER_TYPE_OPTIONS}
                counts={counts.paperType}
              />
              <CheckboxGroup
                control={form.control}
                name="paper_open_access"
                label="Access type"
                options={PAPER_OPEN_ACCESS_OPTIONS}
                counts={counts.paperOpenAccess}
              />
            </div>
          </CardContent>
        </Card>

        {/* Study-level */}
        <Card>
          <CardHeader>
            <CardTitle>Studies</CardTitle>
            <CardDescription>Filter by study design and methodology</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-6 items-start">
              <CheckboxGroup
                control={form.control}
                name="study_preregistered"
                label="Preregistration"
                options={STUDY_PREREGISTERED_OPTIONS}
                counts={counts.studyPreregistered}
              />
              <CheckboxGroup
                control={form.control}
                name="study_data_available"
                label="Data availability"
                options={STUDY_DATA_AVAILABLE_OPTIONS}
                counts={counts.studyDataAvailable}
              />
              <CheckboxGroup
                control={form.control}
                name="study_randomization"
                label="Randomization"
                options={STUDY_RANDOMIZATION_OPTIONS}
                counts={counts.studyRandomization}
              />
              <CheckboxGroup
                control={form.control}
                name="study_design"
                label="Study design"
                options={STUDY_DESIGN_OPTIONS}
                counts={counts.studyDesign}
              />
              <CheckboxGroup
                control={form.control}
                name="study_condition_assignment"
                label="Condition assignment"
                options={STUDY_CONDITION_ASSIGNMENT_OPTIONS}
                counts={counts.studyConditionAssignment}
              />
            </div>
          </CardContent>
        </Card>

        {/* Samples-level */}
        <Card>
          <CardHeader>
            <CardTitle>Samples</CardTitle>
            <CardDescription>Filter by sample characteristics</CardDescription>
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
                counts={counts.sampleCountry}
                className="w-full"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                <CheckboxGroup
                  control={form.control}
                  name="sample_representative"
                  label="Representativeness"
                  options={SAMPLE_REPRESENTATIVE_OPTIONS}
                  counts={counts.sampleRepresentative}
                />
                <CheckboxGroup
                  control={form.control}
                  name="sample_type"
                  label="Sample type"
                  options={SAMPLE_TYPE_OPTIONS}
                  counts={counts.sampleType}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intervention-level */}
        <Card>
          <CardHeader>
            <CardTitle>Interventions</CardTitle>
            <CardDescription>Filter by intervention characteristics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <CheckboxGroup
                control={form.control}
                name="intervention_multicomponent"
                label="Intervention components"
                options={INTERVENTION_MULTICOMPONENT_OPTIONS}
                counts={counts.interventionMulticomponent}
              />
              <MultiSelectField
                control={form.control}
                name="intervention_content"
                label="Intervention content"
                description="Topics or arguments used to persuade people (e.g., animal welfare, health, environment)"
                placeholder="Select intervention content..."
                options={INTERVENTION_CONTENT_OPTIONS}
                counts={counts.interventionContent}
                className="w-full"
              />
              <MultiSelectField
                control={form.control}
                name="intervention_mechanism"
                label="Intervention mechanism"
                description="Persuasion strategies used by researchers (facts, emotions, social pressure, etc.)"
                placeholder="Select intervention mechanism..."
                options={INTERVENTION_MECHANISM_OPTIONS}
                counts={counts.interventionMechanism}
                className="w-full"
              />
              <MultiSelectField
                control={form.control}
                name="intervention_medium"
                label="Intervention medium"
                placeholder="Select intervention medium..."
                options={INTERVENTION_MEDIUM_OPTIONS}
                counts={counts.interventionMedium}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Outcome-level */}
        <Card>
          <CardHeader>
            <CardTitle>Outcomes</CardTitle>
            <CardDescription>Select types of outcomes to include</CardDescription>
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
                counts={counts.outcomeSubcategory}
                className="w-full"
              />
              <CheckboxGroup
                control={form.control}
                name="outcome_measurement_type"
                label="Measurement type"
                options={OUTCOME_MEASUREMENT_TYPE_OPTIONS}
                counts={counts.outcomeMeasurementType}
              />
            </div>
          </CardContent>
        </Card>

        {/* Effect-level */}
        <Card>
          <CardHeader>
            <CardTitle>Effects</CardTitle>
            <CardDescription>Filter by effect size characteristics</CardDescription>
          </CardHeader>
          <CardContent>
            <InputField
              control={form.control}
              name="effect_sample_size"
              label="Minimum sample size"
              description="Minimum per control or intervention condition"
              count={counts.total}
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
              className="h-auto"
            >
              Next
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-auto"
              onClick={handleReset}
            >
              Reset filters
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
