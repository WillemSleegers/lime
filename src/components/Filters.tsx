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
import { getOutcomeCategories } from "@/lib/json-functions"
import { Checkbox } from "./ui/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronRightCircleIcon,
  ChevronRightIcon,
  ChevronRightSquareIcon,
  SlidersHorizontalIcon,
} from "lucide-react"

const formSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

const items = getOutcomeCategories().map((e) => {
  return { id: e.toLowerCase(), label: e }
})

export const Filters = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: items.map((e) => e.label),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <Collapsible>
        <CollapsibleTrigger className="mb-3">
          <div className="space-y-0.5">
            <div className="flex flex-row items-center gap-1">
              <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
            </div>
            <p className="text-muted-foreground">
              Manage which effects you want to include in the meta-analysis.
            </p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4">
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
                                    ? field.onChange([...field.value, item.id])
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
            <Button type="submit">Update</Button>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </Form>
  )
}
