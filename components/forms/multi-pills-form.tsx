"use client"

import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { FieldValues } from "react-hook-form"

type MultiPillsFormProps = {
  field: FieldValues
  options: { label: string; value: string }[]
}

export function MultiPillsForm({ field, options }: MultiPillsFormProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const pressed = field.value.includes(option.value)
        return (
          <Toggle
            key={"toggle-" + option.value}
            aria-label={`${option.label} toggle`}
            size="sm"
            variant="pill"
            pressed={pressed}
            onClick={() => {
              if (pressed) {
                field.onChange(
                  field.value.filter((value: string) => value != option.value),
                )
              } else {
                field.onChange([...field.value, option.value])
              }
            }}
          >
            {option.label}
          </Toggle>
        )
      })}
      <Button
        className="h-8 px-1 text-foreground"
        variant="link"
        onClick={(e) => {
          e.preventDefault()
          const all = [...field.value]
          options.map((option) => {
            if (!field.value.includes(option.value)) {
              all.push(option.value)
            }
          })
          field.onChange(all)
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
