import * as z from "zod"
import { Control } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

import { STUDY_PREREGISTERED_OPTIONS } from "@/constants/constants-filters"

// Base schema field for study preregistration
export const studyPreregistrationField = {
  study_preregistered: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

type StudyPreregistrationProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const StudyPreregistration = ({ control }: StudyPreregistrationProps) => {
  return (
    <FormItem>
      <FormLabel>Study preregistration</FormLabel>
      {STUDY_PREREGISTERED_OPTIONS.map((option) => (
        <FormField
          key={option.value}
          control={control}
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
  )
}
