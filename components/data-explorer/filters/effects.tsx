"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { FilteredData, Locks } from "@/lib/data-explorer-utils"
import { Slider } from "@/components/ui/slider"

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
        datum.effect_intervention_n >= sample_size &&
        datum.effect_control_n >= sample_size
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
          <div className="flex gap-6 flex-wrap items-baseline">
            <FormField
              control={form.control}
              name="effect_size"
              render={({ field }) => (
                <FormItem className="w-60 flex flex-col gap-3">
                  <FormLabel>Effect size</FormLabel>
                  <FormControl>
                    <Slider
                      className="my-2"
                      value={field.value}
                      minStepsBetweenThumbs={0.1}
                      min={effect_size_min}
                      max={effect_size_max}
                      step={0.1}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    From {field.value[0].toFixed(2)} to{" "}
                    {field.value[1].toFixed(2)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sample_size"
              render={({ field }) => (
                <FormItem className="w-60">
                  <FormLabel>Minimum sample size</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-lg bg-white"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="leading-5">
                    This is the minimum sample size in either the control or
                    intervention condition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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
