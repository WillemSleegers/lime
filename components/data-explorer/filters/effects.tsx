"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Toggle } from "@/components/ui/toggle"
import { FilteredData, Locks } from "@/lib/data-explorer-utils"
import { InputField } from "@/components/form/input-field"
import { SliderField } from "@/components/form/slider-field"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

import { Effects } from "@/lib/types"

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
  locks: Locks
  setLocks: Dispatch<SetStateAction<Locks>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterEffects = (props: FilterEffectsProps) => {
  const {
    data,
    setFilteredData,
    locks,
    setLocks,
    filterOpen,
    setFilterOpen,
  } = props

  const effect_size_min = Math.min(...data.map((datum) => datum.effect_size))
  const effect_size_max = Math.max(...data.map((datum) => datum.effect_size))

  const form = useForm<z.infer<typeof formSchemaEffects>>({
    resolver: zodResolver(formSchemaEffects),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      effect_size: [effect_size_min, effect_size_max],
      sample_size: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaEffects>) {
    let subset = data

    subset = subset.filter(
      (datum) =>
        datum.effect_size >= values.effect_size[0] &&
        datum.effect_size <= values.effect_size[1]
    )

    const sample_size = Number(values.sample_size)

    subset = subset.filter(
      (datum) =>
        (datum.effect_intervention_n ?? 0) >= sample_size &&
        (datum.effect_control_n ?? 0) >= sample_size
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Toggle
              onClick={() => {
                setLocks((prev) => ({ ...prev, effects: !prev.effects }))
              }}
            >
              {locks.effects ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
