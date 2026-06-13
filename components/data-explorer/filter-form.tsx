"use client"

import { Dispatch, ReactNode, SetStateAction } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FilterCollapsible } from "@/components/data-explorer/filter-collapsible"

type FilterFormProps<T extends FieldValues> = {
  form: UseFormReturn<T>
  filterOpen: boolean
  setFilterOpen: Dispatch<SetStateAction<boolean>>
  onSubmit: (values: T) => void | Promise<void>
  children: ReactNode
}

export const FilterForm = <T extends FieldValues>({
  form,
  filterOpen,
  setFilterOpen,
  onSubmit,
  children,
}: FilterFormProps<T>) => (
  <FilterCollapsible title="Filter" open={filterOpen} onOpenChange={setFilterOpen}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">
        {children}
        <div className="flex gap-2 justify-between">
          <Button type="submit" className="h-auto">
            Update table
          </Button>
        </div>
      </form>
    </Form>
  </FilterCollapsible>
)
