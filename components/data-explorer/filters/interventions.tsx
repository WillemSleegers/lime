"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
import { MultiSelectField } from "@/components/form/multi-select-field"
import { CheckboxGroup } from "@/components/form/checkbox-group"

import {
  INTERVENTION_MULTICOMPONENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
} from "@/constants/constants-filters"

import { Interventions } from "@/lib/types"
import { FilteredData } from "@/lib/data-explorer-utils"
import { interventionFiltersSchema } from "@/lib/filter-schemas"
import { usePersistedForm } from "@/hooks/use-persisted-form"
import {
  interventionMechanismMatches,
  interventionMediumMatches,
  interventionMechanismMulticomponentMatches,
  interventionMediumMulticomponentMatches,
} from "@/lib/filter-predicates"

const STORAGE_KEY = "lime-data-explorer-interventions"

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

  const defaults = {
    intervention_mechanism_multicomponent: INTERVENTION_MULTICOMPONENT_OPTIONS.map((o) => o.value),
    intervention_medium_multicomponent: INTERVENTION_MULTICOMPONENT_OPTIONS.map((o) => o.value),
    intervention_mechanism: INTERVENTION_MECHANISM_OPTIONS,
    intervention_medium: INTERVENTION_MEDIUM_OPTIONS,
  }

  const form = useForm<z.infer<typeof interventionFiltersSchema>>({
    resolver: zodResolver(interventionFiltersSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaults,
  })

  usePersistedForm(form, STORAGE_KEY, defaults)

  async function onSubmit(values: z.infer<typeof interventionFiltersSchema>) {
    const subset = data.filter(
      (datum) =>
        interventionMechanismMulticomponentMatches(
          datum,
          values.intervention_mechanism_multicomponent,
        ) &&
        interventionMediumMulticomponentMatches(
          datum,
          values.intervention_medium_multicomponent,
        ) &&
        interventionMechanismMatches(datum, values.intervention_mechanism) &&
        interventionMediumMatches(datum, values.intervention_medium),
    )

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
              name="intervention_mechanism"
              label="Intervention mechanism"
              description="Persuasion strategies used by researchers (facts, emotions, social pressure, etc.)"
              placeholder="Select intervention mechanism..."
              options={INTERVENTION_MECHANISM_OPTIONS}
              className="w-full"
            />
            <CheckboxGroup
              control={form.control}
              name="intervention_mechanism_multicomponent"
              label="Mechanism components"
              options={INTERVENTION_MULTICOMPONENT_OPTIONS}
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
              name="intervention_medium_multicomponent"
              label="Medium components"
              options={INTERVENTION_MULTICOMPONENT_OPTIONS}
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
