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
import { Checkbox } from "@/components/ui/checkbox"

import {
  OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS,
  OUTCOME_SUBCATEGORY_INTENTION_OPTIONS,
  OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS,
  OUTCOME_MEASUREMENT_TYPE_OPTIONS,
} from "@/constants/constants-filters"

// Base schema fields for outcome categories
const outcomeCategoriesFields = {
  outcome_subcategory_behavior: z.string().array(),
  outcome_subcategory_intention: z.string().array(),
  outcome_subcategory_attitude: z.string().array(),
}

// Shared refinement logic for outcome categories
const addOutcomeCategoriesRefinement = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema.superRefine((values, ctx) => {
    const typedValues = values as {
      outcome_subcategory_behavior: string[]
      outcome_subcategory_intention: string[]
      outcome_subcategory_attitude: string[]
    }
    if (
      typedValues.outcome_subcategory_behavior.length +
        typedValues.outcome_subcategory_intention.length +
        typedValues.outcome_subcategory_attitude.length ==
      0
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_behavior"],
      })
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_intention"],
      })
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory_attitude"],
      })
      ctx.addIssue({
        code: "custom",
        message: "Must select at least one outcome category.",
        path: ["outcome_subcategory"],
      })
    }
  })
}

// Shared validation schema for outcome category filters (without additional fields)
export const outcomeCategoriesSchema = addOutcomeCategoriesRefinement(
  z.object(outcomeCategoriesFields)
)

// Helper to create a schema with outcome categories and additional fields
export const createOutcomeCategoriesSchema = <T extends z.ZodRawShape>(
  additionalFields: T
) => {
  return addOutcomeCategoriesRefinement(
    z.object({ ...outcomeCategoriesFields, ...additionalFields })
  )
}

// Export the fields so they can be merged with other schemas
export { outcomeCategoriesFields, addOutcomeCategoriesRefinement }

type OutcomeMeasurementTypeProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const OutcomeMeasurementType = ({
  control,
}: OutcomeMeasurementTypeProps) => {
  return (
    <FormField
      control={control}
      name="outcome_measurement_type"
      render={() => (
        <FormItem>
          <FormLabel className="text-base">Measurement type</FormLabel>
          {OUTCOME_MEASUREMENT_TYPE_OPTIONS.map((option) => (
            <FormField
              key={option.value}
              control={control}
              name="outcome_measurement_type"
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
      )}
    />
  )
}

type OutcomeCategoriesProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const OutcomeCategories = ({ control }: OutcomeCategoriesProps) => {
  return (
    <>
      <div className="space-y-1">
        <FormLabel className="text-base">Outcome categories</FormLabel>
        <FormDescription>
          Choose between behaviors (actual consumption and food choices),
          intentions (plans to change diet), or attitudes/beliefs (moral views
          and feelings about meat).
        </FormDescription>
      </div>
      <div className="space-y-4">
        <FormField
          control={control}
          name="outcome_subcategory_behavior"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Behaviors</FormLabel>
              <MultiSelect onValuesChange={field.onChange} values={field.value}>
                <FormControl>
                  <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                    <MultiSelectValue placeholder="Select behaviors..." />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent className="w-fit">
                  <MultiSelectGroup>
                    {OUTCOME_SUBCATEGORY_BEHAVIOR_OPTIONS.map((option) => (
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
          name="outcome_subcategory_intention"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Intentions</FormLabel>
              <MultiSelect onValuesChange={field.onChange} values={field.value}>
                <FormControl>
                  <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                    <MultiSelectValue placeholder="Select intentions..." />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {OUTCOME_SUBCATEGORY_INTENTION_OPTIONS.map((option) => (
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
          name="outcome_subcategory_attitude"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Attitudes/beliefs</FormLabel>
              <MultiSelect onValuesChange={field.onChange} values={field.value}>
                <FormControl>
                  <MultiSelectTrigger className="w-full bg-white hover:bg-white">
                    <MultiSelectValue placeholder="Select attitudes/beliefs..." />
                  </MultiSelectTrigger>
                </FormControl>
                <MultiSelectContent>
                  <MultiSelectGroup>
                    {OUTCOME_SUBCATEGORY_ATTITUDE_OPTIONS.map((option) => (
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
      </div>
      <FormField
        name="outcome_subcategory"
        render={() => (
          <FormItem>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
