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
import { CheckboxGroup } from "@/components/form/checkbox-group"
import { InputField } from "@/components/form/input-field"

import {
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  STUDY_RANDOMIZATION_OPTIONS,
  STUDY_PREREGISTERED_OPTIONS_NEW,
  STUDY_DATA_AVAILABLE_OPTIONS_NEW,
  STUDY_DESIGN_OPTIONS_NEW,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS_NEW,
  STUDY_RANDOMIZATION_OPTIONS_NEW,
} from "@/constants/constants-filters"

import { Studies } from "@/lib/types"
import { FilteredData, Locks } from "@/lib/data-explorer-utils"
import { studyFiltersFields } from "@/lib/filter-schemas"

const formSchemaStudies = z.object({
  study_n: z.coerce
    .number()
    .min(1, { message: "Must be a positive number." }) as z.ZodNumber,
  ...studyFiltersFields,
})

type FilterStudiesProps = {
  data: Studies
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  locks: Locks
  setLocks: Dispatch<SetStateAction<Locks>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterStudies = (props: FilterStudiesProps) => {
  const {
    data,
    setFilteredData,
    locks,
    setLocks,
    filterOpen,
    setFilterOpen,
  } = props

  const form = useForm<z.infer<typeof formSchemaStudies>>({
    resolver: zodResolver(formSchemaStudies),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      study_n: 1,
      study_preregistered: STUDY_PREREGISTERED_OPTIONS.map(
        (option) => option.value
      ),
      study_data_available: STUDY_DATA_AVAILABLE_OPTIONS.map(
        (option) => option.value
      ),
      study_design: STUDY_DESIGN_OPTIONS.map((option) => option.value),
      study_condition_assignment: STUDY_CONDITION_ASSIGNMENT_OPTIONS.map(
        (option) => option.value
      ),
      study_randomization: STUDY_RANDOMIZATION_OPTIONS.map(
        (option) => option.value
      ),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaStudies>) {
    let subset = data

    subset = subset.filter((datum) => {
      return datum.study_n > values.study_n
    })

    subset = subset.filter((datum) => {
      return values.study_preregistered.some((value) =>
        datum.study_preregistered.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.study_data_available.some((value) =>
        datum.study_data_available.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.study_condition_assignment.some((value) =>
        datum.study_condition_assignment.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.study_design.some((value) =>
        datum.study_design.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.study_randomization.some((value) =>
        datum.study_randomization.includes(value)
      )
    })

    setFilteredData((prev) => ({ ...prev, studies: subset }))
  }

  return (
    <FilterCollapsible
      title="Filter"
      open={filterOpen}
      onOpenChange={setFilterOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:max-w-4xl xl:max-w-full xl:grid-cols-3 gap-6 items-baseline">
            <CheckboxGroup
              control={form.control}
              name="study_preregistered"
              label="Preregistration"
              options={STUDY_PREREGISTERED_OPTIONS_NEW}
            />
            <CheckboxGroup
              control={form.control}
              name="study_data_available"
              label="Data availability"
              options={STUDY_DATA_AVAILABLE_OPTIONS_NEW}
            />
            <CheckboxGroup
              control={form.control}
              name="study_design"
              label="Study design"
              options={STUDY_DESIGN_OPTIONS_NEW}
            />
            <CheckboxGroup
              control={form.control}
              name="study_condition_assignment"
              label="Condition assignment"
              options={STUDY_CONDITION_ASSIGNMENT_OPTIONS_NEW}
            />
            <CheckboxGroup
              control={form.control}
              name="study_randomization"
              label="Randomization"
              options={STUDY_RANDOMIZATION_OPTIONS_NEW}
            />
            <InputField
              control={form.control}
              name="study_n"
              label="Minimum sample size"
              description="This is the total sample size across all conditions in a study"
              type="number"
              className="rounded-lg bg-white w-60"
            />
          </div>

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-lg">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLocks((prev) => ({ ...prev, studies: !prev.studies }))
              }}
            >
              {locks.studies ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
