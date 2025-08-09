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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Toggle } from "@/components/ui/toggle"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import {
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
} from "@/constants/constants-filters"

import { Outcomes } from "@/lib/types"

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
  const { data, setData, lock, setLock, setShouldHandleLocks, filterOpen, setFilterOpen } = props

  const form = useForm<z.infer<typeof formSchemaOutcomes>>({
    resolver: zodResolver(formSchemaOutcomes),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      outcome_subcategory_behavior: OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
      outcome_subcategory_intention: OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
      outcome_subcategory_attitude: OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
      outcome_measurement_type: OUTCOME_MEASUREMENT_TYPE_OPTIONS,
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
    <FilterCollapsible title="Filter" open={filterOpen} onOpenChange={setFilterOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-col gap-x-12 gap-y-3">
            <FormLabel>Outcome categories</FormLabel>
            <div className="space-y-3 px-3">
              <FormField
                control={form.control}
                name="outcome_subcategory_behavior"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Behaviors</FormLabel>
                    <FormControl className="justify-start">
                      <ToggleGroup
                        className="my-2 flex flex-wrap gap-x-2"
                        type="multiple"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS.map((option) => (
                          <ToggleGroupItem
                            key={option}
                            value={option}
                            variant="pill"
                            size="sm"
                          >
                            {option}
                          </ToggleGroupItem>
                        ))}
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto px-2"
                          onClick={() =>
                            field.onChange(OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS)
                          }
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto px-2"
                          onClick={() => field.onChange([])}
                        >
                          Deselect all
                        </Button>
                      </ToggleGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcome_subcategory_intention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intentions</FormLabel>
                    <FormControl className="justify-start">
                      <ToggleGroup
                        className="my-2 flex flex-wrap gap-x-2"
                        type="multiple"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {OUTCOME_SUBCATEGORY_INTENTION_OPTIONS.map((option) => (
                          <ToggleGroupItem
                            key={option}
                            value={option}
                            variant="pill"
                            size="sm"
                          >
                            {option}
                          </ToggleGroupItem>
                        ))}
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto px-2"
                          onClick={() =>
                            field.onChange(
                              OUTCOME_SUBCATEGORY_INTENTION_OPTIONS
                            )
                          }
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto px-2"
                          onClick={() => field.onChange([])}
                        >
                          Deselect all
                        </Button>
                      </ToggleGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outcome_subcategory_attitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attitudes/beliefs</FormLabel>
                    <FormControl className="justify-start">
                      <ToggleGroup
                        className="my-2 flex flex-wrap gap-x-2"
                        type="multiple"
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        {OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS.map((option) => (
                          <ToggleGroupItem
                            key={option}
                            value={option}
                            variant="pill"
                            size="sm"
                          >
                            {option}
                          </ToggleGroupItem>
                        ))}
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto px-2"
                          onClick={() =>
                            field.onChange(OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS)
                          }
                        >
                          Select all
                        </Button>
                        <Button
                          type="button"
                          variant="link"
                          className="text-foreground h-auto px-2"
                          onClick={() => field.onChange([])}
                        >
                          Deselect all
                        </Button>
                      </ToggleGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="outcome_subcategory"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outcome_measurement_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Measurement type</FormLabel>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="my-2 flex flex-wrap gap-x-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((option) => (
                        <ToggleGroupItem
                          key={option}
                          value={option}
                          variant="pill"
                          size="sm"
                        >
                          {option}
                        </ToggleGroupItem>
                      ))}
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto px-2"
                        onClick={() =>
                          field.onChange(OUTCOME_MEASUREMENT_TYPE_OPTIONS)
                        }
                      >
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="link"
                        className="text-foreground h-auto px-2"
                        onClick={() => field.onChange([])}
                      >
                        Deselect all
                      </Button>
                    </ToggleGroup>
                  </FormControl>
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
