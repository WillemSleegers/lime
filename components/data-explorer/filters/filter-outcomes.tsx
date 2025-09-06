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
import { Toggle } from "@/components/ui/toggle"
import { Checkbox } from "@/components/ui/checkbox"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

import {
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
} from "@/constants/constants-filters"

import { Outcomes } from "@/lib/types"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

const formSchemaOutcomes = z
  .object({
    outcome_subcategory_behavior: z.string().array(),
    outcome_subcategory_intention: z.string().array(),
    outcome_subcategory_attitude: z.string().array(),
    outcome_measurement_type: z
      .string()
      .array()
      .nonempty({ message: "Must select at least one option." }),
  })
  .superRefine((values, ctx) => {
    if (
      values.outcome_subcategory_behavior.length +
        values.outcome_subcategory_intention.length +
        values.outcome_subcategory_attitude.length ==
      0
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_behavior"],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_intention"],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_attitude"],
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory"],
      })
    }
  })

type FilterOutcomesProps = {
  data: Outcomes
  setData: Dispatch<SetStateAction<Outcomes>>
  lock: boolean
  setLock: Dispatch<SetStateAction<boolean>>
  setShouldHandleLocks: Dispatch<SetStateAction<boolean>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterOutcomes = (props: FilterOutcomesProps) => {
  const {
    data,
    setData,
    lock,
    setLock,
    setShouldHandleLocks,
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
          <div className="space-y-2">
            <div className="space-y-2">
              <FormLabel>Outcome categories</FormLabel>
              <FormDescription>
                Choose between behaviors (actual consumption and food choices),
                intentions (plans to change diet), or attitudes/beliefs (moral
                views and feelings about meat).
              </FormDescription>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="outcome_subcategory_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Behaviors</FormLabel>
                    <MultiSelect
                      onValuesChange={field.onChange}
                      values={field.value}
                    >
                      <FormControl>
                        <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                          <MultiSelectValue placeholder="Select behaviors..." />
                        </MultiSelectTrigger>
                      </FormControl>
                      <MultiSelectContent className="w-fit">
                        <MultiSelectGroup>
                          {OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS.map(
                            (option) => {
                              return (
                                <MultiSelectItem key={option} value={option}>
                                  {option}
                                </MultiSelectItem>
                              )
                            }
                          )}
                        </MultiSelectGroup>
                      </MultiSelectContent>
                    </MultiSelect>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcome_subcategory_intention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intentions</FormLabel>
                    <MultiSelect
                      onValuesChange={field.onChange}
                      values={field.value}
                    >
                      <FormControl>
                        <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                          <MultiSelectValue placeholder="Select intentions... " />
                        </MultiSelectTrigger>
                      </FormControl>
                      <MultiSelectContent>
                        <MultiSelectGroup>
                          {OUTCOME_SUBCATEGORY_INTENTION_OPTIONS.map(
                            (option) => {
                              return (
                                <MultiSelectItem key={option} value={option}>
                                  {option}
                                </MultiSelectItem>
                              )
                            }
                          )}
                        </MultiSelectGroup>
                      </MultiSelectContent>
                    </MultiSelect>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcome_subcategory_attitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attitudes/beliefs</FormLabel>
                    <MultiSelect
                      onValuesChange={field.onChange}
                      values={field.value}
                    >
                      <FormControl>
                        <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                          <MultiSelectValue placeholder="Select attitudes/beliefs... " />
                        </MultiSelectTrigger>
                      </FormControl>
                      <MultiSelectContent>
                        <MultiSelectGroup>
                          {OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS.map(
                            (option) => {
                              return (
                                <MultiSelectItem key={option} value={option}>
                                  {option}
                                </MultiSelectItem>
                              )
                            }
                          )}
                        </MultiSelectGroup>
                      </MultiSelectContent>
                    </MultiSelect>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="outcome_subcategory"
                render={() => (
                  <FormItem>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="outcome_measurement_type"
              render={() => (
                <FormItem>
                  <FormLabel>Measurement type</FormLabel>
                  {OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((option) => (
                    <FormField
                      key={option.value}
                      control={form.control}
                      name="outcome_measurement_type"
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
          </div>
          <div className="flex gap-2 justify-between">
            <Button type="submit" className="h-auto rounded-lg">
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
