"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Slider } from "@/components/ui/slider"

import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
} from "@/constants/constants-filters"

import { LockKeyholeIcon, LockKeyholeOpenIcon } from "lucide-react"
import { Dispatch, SetStateAction } from "react"
import { Papers } from "@/lib/types"
import { Toggle } from "@/components/ui/toggle"

const formSchemaPapers = z.object({
  paper_year: z.number().array(),
  paper_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  paper_open_access: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
})

type FilterPapersProps = {
  data: Papers
  setData: Dispatch<SetStateAction<Papers>>
  lock: boolean
  setLock: Dispatch<SetStateAction<boolean>>
  setShouldHandleLocks: Dispatch<SetStateAction<boolean>>
}

export const FilterPapers = (props: FilterPapersProps) => {
  const { data, setData, lock, setLock, setShouldHandleLocks } = props

  const form = useForm<z.infer<typeof formSchemaPapers>>({
    resolver: zodResolver(formSchemaPapers),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      paper_year: [
        Math.min(...data.map((datum) => datum.paper_year)),
        Math.max(...data.map((datum) => datum.paper_year)),
      ],
      paper_type: PAPER_TYPE_OPTIONS,
      paper_open_access: PAPER_OPEN_ACCESS_OPTIONS,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchemaPapers>) {
    let subset = data

    subset = subset.filter(
      (datum) =>
        datum.paper_year >= values.paper_year[0] &&
        datum.paper_year <= values.paper_year[1]
    )

    subset = subset.filter((datum) => {
      return values.paper_type.some((paper_type) =>
        datum.paper_type.includes(paper_type)
      )
    })

    subset = subset.filter((datum) => {
      return values.paper_open_access.some((open_acess) =>
        datum.paper_open_access.includes(open_acess)
      )
    })

    setData(subset)
    setShouldHandleLocks(true)
  }

  return (
    <FilterCollapsible title="Filter">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <FormField
              control={form.control}
              name="paper_year"
              render={({ field }) => (
                <FormItem className="w-60 flex flex-col gap-3">
                  <FormLabel>Publication year</FormLabel>
                  <FormControl>
                    <Slider
                      className="my-2"
                      value={field.value}
                      minStepsBetweenThumbs={1}
                      max={Math.max(...data.map((datum) => datum.paper_year))}
                      min={Math.min(...data.map((datum) => datum.paper_year))}
                      step={1}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    From {field.value[0]} to {field.value[1]}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paper_type"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Paper type</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {PAPER_TYPE_OPTIONS.map((option) => (
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
              name="paper_open_access"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Open access</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {PAPER_OPEN_ACCESS_OPTIONS.map((option) => (
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
