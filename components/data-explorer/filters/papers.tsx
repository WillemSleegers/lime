"use client"

import { Dispatch, SetStateAction } from "react"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
import { CheckboxGroup } from "@/components/form/checkbox-group"
import { SliderField } from "@/components/form/slider-field"
import { paperFiltersFields } from "@/lib/filter-schemas"

import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
} from "@/constants/constants-filters"

import { Papers } from "@/lib/types"
import { FilteredData } from "@/lib/data-explorer-utils"

const formSchemaPapers = z.object(paperFiltersFields)

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

  const form = useForm<z.infer<typeof formSchemaPapers>>({
    resolver: zodResolver(formSchemaPapers),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      paper_year: [
        Math.min(...data.map((datum) => datum.paper_year)),
        Math.max(...data.map((datum) => datum.paper_year)),
      ],
      paper_type: PAPER_TYPE_OPTIONS.map((option) => option.value),
      paper_open_access: PAPER_OPEN_ACCESS_OPTIONS.map(
        (option) => option.value
      ),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaPapers>) {
    let subset = data

    subset = subset.filter(
      (datum) =>
        datum.paper_year >= values.paper_year[0] &&
        datum.paper_year <= values.paper_year[1]
    )

    subset = subset.filter((datum) => {
      return values.paper_type.some((paper_type) =>
        datum.paper_type.includes(paper_type)
      )
    })

    subset = subset.filter((datum) => {
      return values.paper_open_access.some((open_acess) =>
        datum.paper_open_access.includes(open_acess)
      )
    })

    setFilteredData((prev) => ({ ...prev, papers: subset }))
  }

  return (
    <FilterCollapsible
      title="Filter"
      open={filterOpen}
      onOpenChange={setFilterOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            <SliderField
              control={form.control}
              name="paper_year"
              label="Publication year"
              min={Math.min(...data.map((datum) => datum.paper_year))}
              max={Math.max(...data.map((datum) => datum.paper_year))}
              minStepsBetweenThumbs={1}
              className="w-[100px]"
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
