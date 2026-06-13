"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { FilterForm } from "@/components/data-explorer/filter-form"
import { CheckboxGroup } from "@/components/form/checkbox-group"
import { MultiSelectField } from "@/components/form/multi-select-field"

import {
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
  OUTCOME_CATEGORIES_GROUPED,
} from "@/constants/constants-filters"
import { FilteredData } from "@/lib/data-explorer-utils"

import { Outcomes } from "@/lib/types"
import { outcomeCategoriesFieldsNew } from "@/lib/filter-schemas"
import { usePersistedForm } from "@/hooks/use-persisted-form"
import {
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
    outcome_subcategory: [
      ...OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
      ...OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
      ...OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
    ],
    outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((option) => option.value),
  }

  const form = useForm<z.infer<typeof formSchemaOutcomes>>({
    resolver: zodResolver(formSchemaOutcomes),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaults,
  })

  usePersistedForm(form, STORAGE_KEY, defaults)

  async function onSubmit(values: z.infer<typeof formSchemaOutcomes>) {
    const subset = data.filter(
      (datum) =>
        outcomeSubcategoryMatches(datum, values.outcome_subcategory) &&
        outcomeMeasurementTypeMatches(datum, values.outcome_measurement_type),
    )

    setFilteredData((prev) => ({ ...prev, outcomes: subset }))
  }

  return (
    <FilterForm form={form} filterOpen={filterOpen} setFilterOpen={setFilterOpen} onSubmit={onSubmit}>
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
    </FilterForm>
  )
}
