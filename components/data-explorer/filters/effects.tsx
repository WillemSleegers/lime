"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FilteredData } from "@/lib/data-explorer-utils"
import { InputField } from "@/components/form/input-field"
import { SliderField } from "@/components/form/slider-field"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

import { Effects } from "@/lib/types"
import { usePersistedForm } from "@/hooks/use-persisted-form"
import {
  effectSampleSizeAtLeast,
  effectSizeInRange,
} from "@/lib/filter-predicates"

const STORAGE_KEY = "lime-data-explorer-effects"

const formSchemaEffects = z.object({
  effect_size: z.number().array(),
  sample_size: z.coerce
    .number()
    .min(1, { message: "Must be a positive number." }) as z.ZodNumber,
})

type FilterEffectsProps = {
  data: Effects
  filteredData: FilteredData
  setFilteredData: Dispatch<SetStateAction<FilteredData>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterEffects = (props: FilterEffectsProps) => {
  const {
    data,
    setFilteredData,
    filterOpen,
    setFilterOpen,
  } = props

  const effectSizes = data.map((datum) => datum.effect_size).filter((v): v is number => v !== null)
  const effect_size_min = Math.min(...effectSizes)
  const effect_size_max = Math.max(...effectSizes)

  const defaults = {
    effect_size: [effect_size_min, effect_size_max],
    sample_size: 1,
  }

  const form = useForm<z.infer<typeof formSchemaEffects>>({
    resolver: zodResolver(formSchemaEffects),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: defaults,
  })

  usePersistedForm(form, STORAGE_KEY, defaults)

  async function onSubmit(values: z.infer<typeof formSchemaEffects>) {
    const sample_size = Number(values.sample_size)
    const subset = data.filter(
      (datum) =>
        effectSizeInRange(datum, values.effect_size) &&
        effectSampleSizeAtLeast(datum, sample_size),
    )

    setFilteredData((prev) => ({ ...prev, effects: subset }))
  }

  return (
    <FilterCollapsible
      title="Filter"
      open={filterOpen}
      onOpenChange={setFilterOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SliderField
              control={form.control}
              name="effect_size"
              label="Effect size"
              min={effect_size_min}
              max={effect_size_max}
              step={0.1}
              minStepsBetweenThumbs={0.1}
            />
            <InputField
              control={form.control}
              name="sample_size"
              label="Minimum sample size"
              description="Minimum per control or intervention condition"
              type="number"
              className="rounded-lg"
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
