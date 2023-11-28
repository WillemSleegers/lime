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
import { getData, getOutcomeCategories } from "@/lib/json-functions"
import { Checkbox } from "./ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
import { WebR } from "webr"
import { jsonToDataframe, runMetaAnalysis } from "@/lib/r-functions"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"

const formSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
  minimumCellSize: z.coerce.number().min(1).max(1000),
})

const items = getOutcomeCategories().map((e) => {
  return { id: e.toLowerCase(), label: e }
})

type FiltersProps = {
  setData: Function
  setEffect: Function
  setStatus: Function
  webR: WebR
}

export const Filters = (props: FiltersProps) => {
  const { setData, setEffect, setStatus, webR } = props

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: items.map((e) => e.label),
      minimumCellSize: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let data

    data = getData({
      outcomes: values.items,
    })

    data = data.filter(
      (e) =>
        e.control_n > values.minimumCellSize &&
        e.treatment_n > values.minimumCellSize
    )

    setData(data)

    setStatus("Running meta-analysis...")
    await jsonToDataframe(webR, data, "data")
    const results = await runMetaAnalysis(webR)
    setEffect({ value: results[0], lower: results[1], upper: results[2] })

    setStatus("Ready")
  }

  return (
    <Collapsible
      className=" bg-gray-100 rounded-lg p-3"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger>
        <div className="flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="mt-3 flex gap-6">
              <FormField
                control={form.control}
                name="items"
                render={() => (
                  <FormItem>
                    <div>
                      <FormLabel className="text-base">Outcomes</FormLabel>
                      <FormDescription>
                        Select the outcomes you want to include in the
                        meta-analysis.
                      </FormDescription>
                    </div>
                    {items.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="items"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
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
                name="minimumCellSize"
                render={({ field }) => (
                  <FormItem className="w-80">
                    <FormLabel>Minimum cell size</FormLabel>
                    <FormControl>
                      <Input placeholder="1" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the minimum cell size in either the control or
                      intervention condition.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Update</Button>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  )
}
