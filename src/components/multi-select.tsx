"use client"

import * as React from "react"
import { Check, ChevronDown, ChevronsDown, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

const topics = [
  {
    value: "livestock",
    label: "Livestock",
  },
  {
    value: "cows",
    label: "Cows",
  },
  {
    value: "chickens",
    label: "Chickens",
  },
  {
    value: "dogs",
    label: "Dogs",
  },
]

type MultiSelectProps = {
  label: string
  className?: string
}

export const MultiSelect = ({ label, className }: MultiSelectProps) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string[]>([])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className={cn("flex items-baseline gap-3", className)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between font-normal"
          >
            {label}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <div className="flex gap-1">
          {value.map((v) => {
            return <Badge key={v}>{v}</Badge>
          })}
        </div>
      </div>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Zoek onderwerpen..." />
          <CommandEmpty className="m-3 text-sm">
            Geen onderwerpen gevonden.
          </CommandEmpty>
          <CommandGroup>
            {topics.map((topic) => (
              <CommandItem
                key={topic.value}
                value={topic.value}
                onSelect={(currentValue) => {
                  setValue((prevValue) => {
                    if (value.includes(currentValue)) {
                      const clone = [...prevValue]
                      clone.splice(prevValue.indexOf(currentValue), 1)

                      return clone
                    } else {
                      return [...value, currentValue]
                    }
                  })
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(topic.value) ? "opacity-100" : "opacity-0",
                  )}
                />
                {topic.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
