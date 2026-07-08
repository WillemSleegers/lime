"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { FilterForm } from "@/components/data-explorer/filter-form"
import { CheckboxGroup } from "@/components/form/checkbox-group"
import { MultiSelectField } from "@/components/form/multi-select-field"

import {
  OUTCOME_CATEGORY_OPTIONS,
  OUTCOME_CATEGORY_CHECKBOX_OPTIONS,
  OUTCOME_SUBCATEGORY_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
} from "@/constants/constants-filters"
import { FilteredData } from "@/lib/data-explorer-utils"

import { Outcomes } from "@/lib/types"
import { outcomeCategoriesFieldsNew } from "@/lib/filter-schemas"
import { usePersistedForm } from "@/hooks/use-persisted-form"
import { useOutcomeSubcategorySync } from "@/hooks/use-outcome-subcategory-sync"
import {
  outcomeCategoryMatches,
  outcomeSubcategoryMatches,
  outcomeMeasurementTypeMatches,
} from "@/lib/filter-predicates"

const STORAGE_KEY = "lime-data-explorer-outcomes"

const formSchemaOutcomes = z.object({
  ...outcomeCategoriesFieldsNew,
  outcome_measurement_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterOutcomesProps = {
  data: Outcomes
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterOutcomes = (props: FilterOutcomesProps) => {
  const {
    data,
    setFilteredData,
    filterOpen,
    setFilterOpen,
  } = props

  const defaults = {
    outcome_category: OUTCOME_CATEGORY_OPTIONS,
    outcome_subcategory: OUTCOME_SUBCATEGORY_OPTIONS,
    outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((option) => option.value),
  }

  const form = useForm<z.infer<typeof formSchemaOutcomes>>({
    resolver: zodResolver(formSchemaOutcomes),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaults,
  })

  usePersistedForm(form, STORAGE_KEY, defaults)

  const subcategoryOptions = useOutcomeSubcategorySync(form)

  async function onSubmit(values: z.infer<typeof formSchemaOutcomes>) {
    const subset = data.filter(
      (datum) =>
        outcomeCategoryMatches(datum, values.outcome_category) &&
        outcomeSubcategoryMatches(datum, values.outcome_subcategory) &&
        outcomeMeasurementTypeMatches(datum, values.outcome_measurement_type),
    )

    setFilteredData((prev) => ({ ...prev, outcomes: subset }))
  }

  return (
    <FilterForm form={form} filterOpen={filterOpen} setFilterOpen={setFilterOpen} onSubmit={onSubmit}>
      <div className="space-y-6">
        <CheckboxGroup
          control={form.control}
          name="outcome_category"
          label="Outcome categories"
          description="Choose between behaviors, observed directly (e.g. sales data) or self-reported (e.g. surveys), intentions (plans to change diet), or attitudes/beliefs (moral views and feelings about meat)."
          options={OUTCOME_CATEGORY_CHECKBOX_OPTIONS}
        />
        <MultiSelectField
          control={form.control}
          name="outcome_subcategory"
          label="Outcome subcategories"
          description="Narrow down to specific outcome measures within the categories selected above."
          placeholder="Select outcome subcategories..."
          searchPlaceholder="Search subcategories..."
          searchEmptyMessage="No subcategory found."
          options={subcategoryOptions}
          className="w-full"
        />
        <CheckboxGroup
          control={form.control}
          name="outcome_measurement_type"
          label="Measurement type"
          options={OUTCOME_MEASUREMENT_TYPE_OPTIONS}
        />
      </div>
    </FilterForm>
  )
}
