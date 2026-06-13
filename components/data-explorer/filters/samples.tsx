"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { FilterForm } from "@/components/data-explorer/filter-form"
import { CheckboxGroup } from "@/components/form/checkbox-group"
import { MultiSelectField } from "@/components/form/multi-select-field"

import {
  ALL_COUNTRY_VALUES,
  SAMPLE_COUNTRY_OPTIONS,
  SAMPLE_TYPE_OPTIONS,
  SAMPLE_REPRESENTATIVE_OPTIONS,
} from "@/constants/constants-filters"

import { Samples } from "@/lib/types"
import { FilteredData } from "@/lib/data-explorer-utils"
import { sampleFiltersFields } from "@/lib/filter-schemas"
import { usePersistedForm } from "@/hooks/use-persisted-form"
import {
  sampleCountryMatches,
  sampleTypeMatches,
  sampleRepresentativeMatches,
} from "@/lib/filter-predicates"

const STORAGE_KEY = "lime-data-explorer-samples"

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

  const defaults = {
    sample_country: ALL_COUNTRY_VALUES,
    sample_type: SAMPLE_TYPE_OPTIONS.map((option) => option.value),
    sample_representative: SAMPLE_REPRESENTATIVE_OPTIONS.map((option) => option.value),
  }

  const form = useForm<z.infer<typeof formSchemaSamples>>({
    resolver: zodResolver(formSchemaSamples),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaults,
  })

  usePersistedForm(form, STORAGE_KEY, defaults)

  async function onSubmit(values: z.infer<typeof formSchemaSamples>) {
    const subset = data.filter(
      (datum) =>
        sampleCountryMatches(datum, values.sample_country) &&
        sampleTypeMatches(datum, values.sample_type) &&
        sampleRepresentativeMatches(datum, values.sample_representative),
    )

    setFilteredData((prev) => ({ ...prev, samples: subset }))
  }

  return (
    <FilterForm form={form} filterOpen={filterOpen} setFilterOpen={setFilterOpen} onSubmit={onSubmit}>
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
    </FilterForm>
  )
}
