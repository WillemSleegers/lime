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

import {
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  STUDY_RANDOMIZATION_OPTIONS,
} from "@/constants/constants-filters"

import { Studies } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"

const formSchemaStudies = z.object({
  study_n: z.coerce
    .number()
    .min(1, { message: "Must be a positive number." }) as z.ZodNumber,
  study_preregistered: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_data_available: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_design: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_condition_assignment: z
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
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterStudies = (props: FilterStudiesProps) => {
  const {
    data,
    setData,
    lock,
    setLock,
    setShouldHandleLocks,
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

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible
      title="Filter"
      open={filterOpen}
      onOpenChange={setFilterOpen}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex gap-8 flex-wrap items-baseline">
            <FormField
              control={form.control}
              name="study_n"
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
              name="study_preregistered"
              render={() => (
                <FormItem>
                  <div className="space-y-1">
                    <FormLabel>Study preregistration</FormLabel>
                  </div>
                  {STUDY_PREREGISTERED_OPTIONS.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name="study_preregistered"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_data_available"
              render={() => (
                <FormItem>
                  <div className="space-y-1">
                    <FormLabel>Data availability</FormLabel>
                  </div>
                  {STUDY_DATA_AVAILABLE_OPTIONS.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name="study_data_available"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_design"
              render={() => (
                <FormItem>
                  <div className="space-y-1">
                    <FormLabel>Study design</FormLabel>
                  </div>
                  {STUDY_DESIGN_OPTIONS.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name="study_design"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_condition_assignment"
              render={() => (
                <FormItem>
                  <div className="space-y-1">
                    <FormLabel>Assignment method</FormLabel>
                  </div>
                  {STUDY_CONDITION_ASSIGNMENT_OPTIONS.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name="study_condition_assignment"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="study_randomization"
              render={() => (
                <FormItem>
                  <div className="space-y-1">
                    <FormLabel>Randomization</FormLabel>
                  </div>
                  {STUDY_RANDOMIZATION_OPTIONS.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name="study_randomization"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.value}
                            className="flex flex-row items-center gap-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.value,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
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
            <Button type="submit" className="h-auto rounded-lg text-white">
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
