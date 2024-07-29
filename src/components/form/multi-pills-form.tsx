"use client"

import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { FieldValues } from "react-hook-form"

type MultiPillsFormProps = {
  field: FieldValues
  options: string[]
}

export function MultiPillsForm({ field, options }: MultiPillsFormProps) {
  return (
    <div className="flex flex-wrap gap-2 pb-4">
      {options.map((option) => {
        const pressed = field.value.includes(option)
        return (
          <Toggle
            key={"toggle-" + option}
            aria-label={`${option} toggle`}
            size="sm"
            variant="pill"
            pressed={pressed}
            onClick={() => {
              if (pressed) {
                field.onChange(
                  field.value.filter((value: string) => value != option),
                )
              } else {
                field.onChange([...field.value, option])
              }
            }}
          >
            {option}
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
            if (!field.value.includes(option)) {
              all.push(option)
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
            field.value.filter((option: string) => !options.includes(option)),
          )
        }}
      >
        Deselect all
      </Button>
    </div>
  )
}
