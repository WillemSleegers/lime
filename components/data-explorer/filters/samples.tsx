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
  SAMPLE_COUNTRY_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
} from "@/constants/constants-filters"

import { Samples } from "@/lib/types"
import { FilteredData } from "@/lib/data-explorer-utils"
import { sampleFiltersFields } from "@/lib/filter-schemas"

const formSchemaSamples = z.object({
  ...sampleFiltersFields,
})

type FilterSamplesProps = {
  data: Samples
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterSamples = (props: FilterSamplesProps) => {
  const {
    data,
    setFilteredData,
    filterOpen,
    setFilterOpen,
  } = props

  const form = useForm<z.infer<typeof formSchemaSamples>>({
    resolver: zodResolver(formSchemaSamples),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      sample_country: SAMPLE_COUNTRY_OPTIONS,
      sample_type: SAMPLE_TYPE_OPTIONS.map((option) => option.value),
      sample_representative: SAMPLE_REPRESENTATIVE_OPTIONS.map(
        (option) => option.value
      ),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaSamples>) {
    let subset = data

    subset = subset.filter((datum) => {
      return values.sample_country.some((value) =>
        datum.sample_country.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.sample_type.some((value) =>
        datum.sample_type.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.sample_representative.some((value) =>
        datum.sample_representative.includes(value)
      )
    })

    setFilteredData((prev) => ({ ...prev, samples: subset }))
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
              name="sample_country"
              label="Country"
              placeholder="Select countries..."
              options={SAMPLE_COUNTRY_OPTIONS}
              className="w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CheckboxGroup
                control={form.control}
                name="sample_type"
                label="Sample type"
                options={SAMPLE_TYPE_OPTIONS}
              />
              <CheckboxGroup
                control={form.control}
                name="sample_representative"
                label="Representativeness"
                options={SAMPLE_REPRESENTATIVE_OPTIONS}
              />
            </div>
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
