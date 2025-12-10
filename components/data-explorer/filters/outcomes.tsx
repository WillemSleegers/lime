"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
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

  const form = useForm<z.infer<typeof formSchemaOutcomes>>({
    resolver: zodResolver(formSchemaOutcomes),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      outcome_subcategory: [
        ...OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
        ...OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
        ...OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
      ],
      outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map(
        (option) => option.value
      ),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaOutcomes>) {
    let subset = data

    subset = subset.filter((datum) => {
      return values.outcome_subcategory.some(
        (value) => datum.outcome_subcategory === value
      )
    })

    subset = subset.filter((datum) => {
      return values.outcome_measurement_type.some(
        (value) => datum.outcome_measurement_type === value
      )
    })

    setFilteredData((prev) => ({ ...prev, outcomes: subset }))
  }

  return (
    <FilterCollapsible
      title="Filter"
      open={filterOpen}
      onOpenChange={setFilterOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
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
          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto">
              Update table
            </Button>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
