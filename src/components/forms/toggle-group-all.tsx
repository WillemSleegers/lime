"use client"

import { FieldValues } from "react-hook-form"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"

type ToggleGroupAllProps = {
  field: FieldValues
  options: { label: string; value: string }[]
}

export function ToggleGroupAll({ field, options }: ToggleGroupAllProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <ToggleGroup
        className="flex flex-wrap justify-start gap-2"
        type="multiple"
        value={field.value}
      >
        {options.map((option) => {
          return (
            <ToggleGroupItem
              key={option.value}
              value={option.value}
              aria-label={`Toggle ${option.value}`}
              variant={"pill"}
              size="sm"
              onClick={() => {
                if (field.value.includes(option.value)) {
                  field.onChange(
                    field.value.filter((value: string) => {
                      return value !== option.value
                    }),
                  )
                } else {
                  field.onChange([...field.value, option.value])
                }
              }}
            >
              {option.label}
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
      <Button
        className="h-8 px-1 text-foreground"
        variant="link"
        onClick={(e) => {
          e.preventDefault()
          // Go over all options and add them to the array if they're not in yet
          // We can't just set the field to be the same as the options because
          // the field might have more possible values than the options provided
          const values = [...field.value]
          options.map((option) => {
            if (!field.value.includes(option.value)) {
              values.push(option.value)
            }
          })
          field.onChange(values)
        }}
      >
        Select all
      </Button>
      <Button
        className="h-8 px-1 text-foreground"
        variant="link"
        onClick={(e) => {
          e.preventDefault()
          field.onChange(
            field.value.filter(
              (value: string) => !options.map((e) => e.value).includes(value),
            ),
          )
        }}
      >
        Deselect all
      </Button>
    </div>
  )
}
