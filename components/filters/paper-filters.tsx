import * as z from "zod"
import { Control } from "react-hook-form"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"

import {
  PAPER_TYPE_OPTIONS,
  PAPER_OPEN_ACCESS_OPTIONS,
} from "@/constants/constants-filters"

// Base schema fields for paper filters
export const paperFiltersFields = {
  paper_year: z.number().array(),
  paper_type: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  paper_open_access: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

// Shared validation schema for paper filters
export const paperFiltersSchema = z.object(paperFiltersFields)

type PaperYearProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  minYear: number
  maxYear: number
}

export const PaperYear = ({ control, minYear, maxYear }: PaperYearProps) => {
  return (
    <FormField
      control={control}
      name="paper_year"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Publication year</FormLabel>
          <FormDescription>
            From {field.value[0]} to {field.value[1]}
          </FormDescription>
          <FormControl>
            <Slider
              className="w-[200px]"
              value={field.value}
              minStepsBetweenThumbs={1}
              max={maxYear}
              min={minYear}
              step={1}
              onValueChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type PaperTypeProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const PaperType = ({ control }: PaperTypeProps) => {
  return (
    <FormField
      control={control}
      name="paper_type"
      render={() => (
        <FormItem>
          <FormLabel>Publication type</FormLabel>
          {PAPER_TYPE_OPTIONS.map((option) => (
            <FormField
              key={option.value}
              control={control}
              name="paper_type"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== option.value
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
  )
}

type PaperOpenAccessProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const PaperOpenAccess = ({ control }: PaperOpenAccessProps) => {
  return (
    <FormField
      control={control}
      name="paper_open_access"
      render={() => (
        <FormItem>
          <FormLabel>Access type</FormLabel>
          {PAPER_OPEN_ACCESS_OPTIONS.map((option) => (
            <FormField
              key={option.value}
              control={control}
              name="paper_open_access"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, option.value])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== option.value
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
  )
}
