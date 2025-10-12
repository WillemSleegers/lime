"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Toggle } from "@/components/ui/toggle"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

import {
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
} from "@/constants/constants-filters"
import { FilteredData, Locks } from "@/lib/data-explorer-utils"

import { Outcomes } from "@/lib/types"
import {
  OutcomeCategories,
  OutcomeMeasurementType,
  createOutcomeCategoriesSchema,
} from "@/components/filter-fields/outcome-fields"

const formSchemaOutcomes = createOutcomeCategoriesSchema({
  outcome_measurement_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterOutcomesProps = {
  data: Outcomes
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  locks: Locks
  setLocks: Dispatch<SetStateAction<Locks>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterOutcomes = (props: FilterOutcomesProps) => {
  const {
    data,
    setFilteredData,
    locks,
    setLocks,
    filterOpen,
    setFilterOpen,
  } = props

  const form = useForm<z.infer<typeof formSchemaOutcomes>>({
    resolver: zodResolver(formSchemaOutcomes),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      outcome_subcategory_behavior: OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
      outcome_subcategory_intention: OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
      outcome_subcategory_attitude: OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
      outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS.map(
        (option) => option.value
      ),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaOutcomes>) {
    let subset = data

    const outcome_subcategory = [
      ...values.outcome_subcategory_behavior,
      ...values.outcome_subcategory_intention,
      ...values.outcome_subcategory_attitude,
    ]

    subset = subset.filter((datum) => {
      return outcome_subcategory.some(
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
          <div className="space-y-2">
            <OutcomeCategories control={form.control} />
            <OutcomeMeasurementType control={form.control} />
          </div>
          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-lg">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLocks((prev) => ({ ...prev, outcomes: !prev.outcomes }))
              }}
            >
              {locks.outcomes ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
