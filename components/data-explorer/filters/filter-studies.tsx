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
import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import {
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT,
  STUDY_DESIGN,
  STUDY_RANDOMIZATION,
} from "@/constants/constants-filters"

import { Studies } from "@/lib/types"

const formSchemaStudies = z.object({
  study_n: z.coerce
    .number()
    .min(1, { message: "Must be a positive number." }) as z.ZodNumber,
  study_pregistered: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_data_available: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_condition_assignment: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_design: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_randomization: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterStudiesProps = {
  data: Studies
  setData: Dispatch<SetStateAction<Studies>>
  lock: boolean
  setLock: Dispatch<SetStateAction<boolean>>
  setShouldHandleLocks: Dispatch<SetStateAction<boolean>>
}

export const FilterStudies = (props: FilterStudiesProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

  const form = useForm<z.infer<typeof formSchemaStudies>>({
    resolver: zodResolver(formSchemaStudies),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      study_n: 1,
      study_pregistered: STUDY_PREREGISTERED_OPTIONS,
      study_data_available: STUDY_DATA_AVAILABLE_OPTIONS,
      study_condition_assignment: STUDY_CONDITION_ASSIGNMENT,
      study_design: STUDY_DESIGN,
      study_randomization: STUDY_RANDOMIZATION,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaStudies>) {
    let subset = data

    subset = subset.filter((datum) => {
      return datum.study_n > values.study_n
    })

    subset = subset.filter((datum) => {
      return values.study_pregistered.some((value) =>
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

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="study_n"
              render={({ field }) => (
                <FormItem className="w-60">
                  <FormLabel>Minimum sample size</FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-2xl bg-white"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the total sample size across all conditions in a
                    study
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_pregistered"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Preregistered</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {STUDY_PREREGISTERED_OPTIONS.map((option) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          variant="pill"
                          size="sm"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_data_available"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Data available</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {STUDY_DATA_AVAILABLE_OPTIONS.map((option) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          variant="pill"
                          size="sm"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_design"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Study design</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {STUDY_DESIGN.map((option) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          variant="pill"
                          size="sm"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_condition_assignment"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Condition assignment</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {STUDY_CONDITION_ASSIGNMENT.map((option) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          variant="pill"
                          size="sm"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_randomization"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Randomization</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {STUDY_RANDOMIZATION.map((option) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          variant="pill"
                          size="sm"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="error"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-full text-white">
              Update table
            </Button>
            <Toggle
              onClick={() => {
                setLock((prev: boolean) => !prev)
                setShouldHandleLocks(true)
              }}
            >
              {lock ? <LockKeyholeIcon /> : <LockKeyholeOpenIcon />}
            </Toggle>
          </div>
        </form>
      </Form>
    </FilterCollapsible>
  )
}
