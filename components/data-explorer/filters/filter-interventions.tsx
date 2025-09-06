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
import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import {
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
} from "@/constants/constants-filters"

import { Interventions } from "@/lib/types"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

const formSchemaInterventions = z.object({
  intervention_content: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_mechanism: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  intervention_medium: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterInterventionsProps = {
  data: Interventions
  setData: Dispatch<SetStateAction<Interventions>>
  lock: boolean
  setLock: Dispatch<SetStateAction<boolean>>
  setShouldHandleLocks: Dispatch<SetStateAction<boolean>>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
}

export const FilterInterventions = (props: FilterInterventionsProps) => {
  const {
    data,
    setData,
    lock,
    setLock,
    setShouldHandleLocks,
    filterOpen,
    setFilterOpen,
  } = props

  const form = useForm<z.infer<typeof formSchemaInterventions>>({
    resolver: zodResolver(formSchemaInterventions),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      intervention_content: INTERVENTION_CONTENT_OPTIONS,
      intervention_mechanism: INTERVENTION_MECHANISM_OPTIONS,
      intervention_medium: INTERVENTION_MEDIUM_OPTIONS,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaInterventions>) {
    let subset = data

    subset = subset.filter((datum) => {
      return values.intervention_content.some((value) =>
        datum.intervention_content.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_mechanism.some((value) =>
        datum.intervention_mechanism.includes(value)
      )
    })

    subset = subset.filter((datum) => {
      return values.intervention_medium.some((value) =>
        datum.intervention_medium.includes(value)
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
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="intervention_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervention content</FormLabel>
                  <FormDescription>
                    Topics or arguments used to persuade people (e.g., animal
                    welfare, health, environment)
                  </FormDescription>
                  <MultiSelect
                    onValuesChange={field.onChange}
                    values={field.value}
                  >
                    <FormControl>
                      <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                        <MultiSelectValue placeholder="Select intervention content..." />
                      </MultiSelectTrigger>
                    </FormControl>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {INTERVENTION_CONTENT_OPTIONS.map((option) => {
                          return (
                            <MultiSelectItem key={option} value={option}>
                              {option}
                            </MultiSelectItem>
                          )
                        })}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intervention_mechanism"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervention mechanism</FormLabel>
                  <FormDescription>
                    Persuasion strategies used by researchers (facts, emotions,
                    social pressure, etc.)
                  </FormDescription>
                  <MultiSelect
                    onValuesChange={field.onChange}
                    values={field.value}
                  >
                    <FormControl>
                      <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                        <MultiSelectValue placeholder="Select intervention mechanism..." />
                      </MultiSelectTrigger>
                    </FormControl>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {INTERVENTION_MECHANISM_OPTIONS.map((option) => {
                          return (
                            <MultiSelectItem key={option} value={option}>
                              {option}
                            </MultiSelectItem>
                          )
                        })}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intervention_medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervention medium</FormLabel>
                  <FormDescription>
                    How the intervention was delivered to participants
                  </FormDescription>
                  <MultiSelect
                    onValuesChange={field.onChange}
                    values={field.value}
                  >
                    <FormControl>
                      <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                        <MultiSelectValue placeholder="Select intervention medium..." />
                      </MultiSelectTrigger>
                    </FormControl>
                    <MultiSelectContent>
                      <MultiSelectGroup>
                        {INTERVENTION_MEDIUM_OPTIONS.map((option) => {
                          return (
                            <MultiSelectItem key={option} value={option}>
                              {option}
                            </MultiSelectItem>
                          )
                        })}
                      </MultiSelectGroup>
                    </MultiSelectContent>
                  </MultiSelect>
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
