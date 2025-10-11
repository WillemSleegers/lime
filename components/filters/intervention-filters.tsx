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
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

import {
  INTERVENTION_CONTENT_OPTIONS,
  INTERVENTION_MECHANISM_OPTIONS,
  INTERVENTION_MEDIUM_OPTIONS,
} from "@/constants/constants-filters"

// Base schema fields for intervention filters
export const interventionFiltersFields = {
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
}

// Shared validation schema for intervention filters
export const interventionFiltersSchema = z.object(interventionFiltersFields)

type InterventionFiltersProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const InterventionFilters = ({ control }: InterventionFiltersProps) => {
  return (
    <>
      <FormField
        control={control}
        name="intervention_content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Intervention content</FormLabel>
            <FormDescription>
              Topics or arguments used to persuade people (e.g., animal welfare,
              health, environment)
            </FormDescription>
            <MultiSelect onValuesChange={field.onChange} values={field.value}>
              <FormControl>
                <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                  <MultiSelectValue placeholder="Select intervention content..." />
                </MultiSelectTrigger>
              </FormControl>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {INTERVENTION_CONTENT_OPTIONS.map((option) => (
                    <MultiSelectItem key={option} value={option}>
                      {option}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="intervention_mechanism"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Intervention mechanism</FormLabel>
            <FormDescription>
              Persuasion strategies used by researchers (facts, emotions, social
              pressure, etc.)
            </FormDescription>
            <MultiSelect onValuesChange={field.onChange} values={field.value}>
              <FormControl>
                <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                  <MultiSelectValue placeholder="Select intervention mechanism..." />
                </MultiSelectTrigger>
              </FormControl>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {INTERVENTION_MECHANISM_OPTIONS.map((option) => (
                    <MultiSelectItem key={option} value={option}>
                      {option}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="intervention_medium"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Intervention medium</FormLabel>
            <MultiSelect onValuesChange={field.onChange} values={field.value}>
              <FormControl>
                <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                  <MultiSelectValue placeholder="Select intervention medium..." />
                </MultiSelectTrigger>
              </FormControl>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {INTERVENTION_MEDIUM_OPTIONS.map((option) => (
                    <MultiSelectItem key={option} value={option}>
                      {option}
                    </MultiSelectItem>
                  ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
