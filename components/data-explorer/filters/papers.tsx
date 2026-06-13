"use client"

import { Dispatch, SetStateAction } from "react"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { FilterForm } from "@/components/data-explorer/filter-form"
import { CheckboxGroup } from "@/components/form/checkbox-group"
import { SliderField } from "@/components/form/slider-field"
import { paperFiltersFields } from "@/lib/filter-schemas"

import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
} from "@/constants/constants-filters"

import papersData from "@/assets/data/papers.json"
import { Papers } from "@/lib/types"
import { FilteredData } from "@/lib/data-explorer-utils"
import { usePersistedForm } from "@/hooks/use-persisted-form"
import {
  paperYearInRange,
  paperTypeMatches,
  paperOpenAccessMatches,
} from "@/lib/filter-predicates"

const STORAGE_KEY = "lime-data-explorer-papers"
const formSchemaPapers = z.object(paperFiltersFields)

// paper_year range is static at build time — compute once at module load.
const PAPER_YEAR_MIN = Math.min(...papersData.map((p) => p.paper_year))
const PAPER_YEAR_MAX = Math.max(...papersData.map((p) => p.paper_year))

type FilterPapersProps = {
  data: Papers
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterPapers = (props: FilterPapersProps) => {
  const {
    data,
    setFilteredData,
    filterOpen,
    setFilterOpen,
  } = props

  const defaults = {
    paper_year: [PAPER_YEAR_MIN, PAPER_YEAR_MAX],
    paper_type: PAPER_TYPE_OPTIONS.map((option) => option.value),
    paper_open_access: PAPER_OPEN_ACCESS_OPTIONS.map((option) => option.value),
  }

  const form = useForm<z.infer<typeof formSchemaPapers>>({
    resolver: zodResolver(formSchemaPapers),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaults,
  })

  usePersistedForm(form, STORAGE_KEY, defaults)

  async function onSubmit(values: z.infer<typeof formSchemaPapers>) {
    const subset = data.filter(
      (datum) =>
        paperYearInRange(datum, values.paper_year) &&
        paperTypeMatches(datum, values.paper_type) &&
        paperOpenAccessMatches(datum, values.paper_open_access),
    )

    setFilteredData((prev) => ({ ...prev, papers: subset }))
  }

  return (
    <FilterForm form={form} filterOpen={filterOpen} setFilterOpen={setFilterOpen} onSubmit={onSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
        <SliderField
          control={form.control}
          name="paper_year"
          label="Publication year"
          min={PAPER_YEAR_MIN}
          max={PAPER_YEAR_MAX}
          minStepsBetweenThumbs={1}
          className="w-25"
        />
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
    </FilterForm>
  )
}
