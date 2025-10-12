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

import {
  STUDY_PREREGISTERED_OPTIONS,
  STUDY_DATA_AVAILABLE_OPTIONS,
  STUDY_DESIGN_OPTIONS,
  STUDY_CONDITION_ASSIGNMENT_OPTIONS,
  STUDY_RANDOMIZATION_OPTIONS,
} from "@/constants/constants-filters"

// Base schema fields for study filters
export const studyPreregistrationField = {
  study_preregistered: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
}

export const studyFiltersFields = {
  ...studyPreregistrationField,
  study_data_available: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_design: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_condition_assignment: z
    .string()
    .array()
    .nonempty({ message: "Must select at least one option." }),
  study_randomization: z
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

type StudyDataAvailableProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const StudyDataAvailable = ({ control }: StudyDataAvailableProps) => {
  return (
    <FormItem>
      <FormLabel>Data availability</FormLabel>
      {STUDY_DATA_AVAILABLE_OPTIONS.map((option) => (
        <FormField
          key={option.value}
          control={control}
          name="study_data_available"
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

type StudyDesignProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const StudyDesign = ({ control }: StudyDesignProps) => {
  return (
    <FormItem>
      <FormLabel>Study design</FormLabel>
      {STUDY_DESIGN_OPTIONS.map((option) => (
        <FormField
          key={option.value}
          control={control}
          name="study_design"
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

type StudyConditionAssignmentProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const StudyConditionAssignment = ({
  control,
}: StudyConditionAssignmentProps) => {
  return (
    <FormItem>
      <FormLabel>Assignment method</FormLabel>
      {STUDY_CONDITION_ASSIGNMENT_OPTIONS.map((option) => (
        <FormField
          key={option.value}
          control={control}
          name="study_condition_assignment"
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

type StudyRandomizationProps = {
  /**
   * React-hook-form Control object. Using `any` here is necessary for reusable
   * components that work with forms of different shapes. The actual field names
   * are validated at runtime by react-hook-form.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
}

export const StudyRandomization = ({ control }: StudyRandomizationProps) => {
  return (
    <FormItem>
      <FormLabel>Randomization</FormLabel>
      {STUDY_RANDOMIZATION_OPTIONS.map((option) => (
        <FormField
          key={option.value}
          control={control}
          name="study_randomization"
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
