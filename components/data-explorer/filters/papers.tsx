"use client"

import { Dispatch, SetStateAction } from "react"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react"

import { Form } from "@/components/ui/form"
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
import {
  paperFiltersFields,
  PaperYear,
  PaperType,
  PaperOpenAccess,
} from "@/components/filter-fields/paper-fields"

import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
} from "@/constants/constants-filters"

import { Papers } from "@/lib/types"
import { FilteredData, Locks } from "@/lib/data-explorer-utils"

const formSchemaPapers = z.object(paperFiltersFields)

type FilterPapersProps = {
  data: Papers
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  locks: Locks
  setLocks: Dispatch<SetStateAction<Locks>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterPapers = (props: FilterPapersProps) => {
  const {
    data,
    setFilteredData,
    locks,
    setLocks,
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
          <div className="flex flex-col lg:flex-row gap-6 items-baseline">
            <PaperYear
              control={form.control}
              minYear={Math.min(...data.map((datum) => datum.paper_year))}
              maxYear={Math.max(...data.map((datum) => datum.paper_year))}
            />
            <PaperType control={form.control} />
            <PaperOpenAccess control={form.control} />
          </div>

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-lg">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLocks((prev) => ({ ...prev, papers: !prev.papers }))
              }}
            >
              {locks.papers ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
