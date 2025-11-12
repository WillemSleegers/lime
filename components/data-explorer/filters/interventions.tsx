"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
import { MultiSelectField } from "@/components/form/multi-select-field"

import {
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
} from "@/constants/constants-filters"

import { Interventions } from "@/lib/types"
import { FilteredData } from "@/lib/data-explorer-utils"
import { interventionFiltersSchema } from "@/lib/filter-schemas"

type FilterInterventionsProps = {
  data: Interventions
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterInterventions = (props: FilterInterventionsProps) => {
  const {
    data,
    setFilteredData,
    filterOpen,
    setFilterOpen,
  } = props

  const form = useForm<z.infer<typeof interventionFiltersSchema>>({
    resolver: zodResolver(interventionFiltersSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      intervention_content: INTERVENTION_CONTENT_OPTIONS,
      intervention_mechanism: INTERVENTION_MECHANISM_OPTIONS,
      intervention_medium: INTERVENTION_MEDIUM_OPTIONS,
    },
  })

  async function onSubmit(values: z.infer<typeof interventionFiltersSchema>) {
    let subset = data

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

    setFilteredData((prev) => ({ ...prev, interventions: subset }))
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
