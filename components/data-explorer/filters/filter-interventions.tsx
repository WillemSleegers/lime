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
}

export const FilterInterventions = (props: FilterInterventionsProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

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
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <FormField
              control={form.control}
              name="intervention_content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormDescription>
                    Content categories of the appeals used in the interventions
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="flex flex-wrap gap-x-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {INTERVENTION_CONTENT_OPTIONS.map((option) => (
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
                          field.onChange(INTERVENTION_CONTENT_OPTIONS)
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
            <FormField
              control={form.control}
              name="intervention_mechanism"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mechanism</FormLabel>
                  <FormDescription>
                    The psychological mechanisms targeted by the interventions
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      className="flex flex-wrap gap-x-2"
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {INTERVENTION_MECHANISM_OPTIONS.map((option) => (
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
                          field.onChange(INTERVENTION_MECHANISM_OPTIONS)
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
            <FormField
              control={form.control}
              name="intervention_medium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medium</FormLabel>
                  <FormDescription>
                    The medium in which the interventions are adminstered
                  </FormDescription>
                  <FormControl className="justify-start">
                    <ToggleGroup
                      type="multiple"
                      className="flex flex-wrap gap-x-2"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {INTERVENTION_MEDIUM_OPTIONS.map((option) => (
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
                          field.onChange(INTERVENTION_MEDIUM_OPTIONS)
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
