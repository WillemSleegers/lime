import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type ComboboxProps = {
  id: string
  options: {
    value: string
    label: string
  }[]
}

export const Combobox = (props: ComboboxProps) => {
  const { id, options } = props

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            Outcomes
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput id={id} placeholder="Search outcomes..." />
            <CommandEmpty>No outcomes found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={(currentValue) => {
                    if (value.includes(currentValue)) {
                      setValue((oldValues) => {
                        return oldValues.filter((v) => v !== currentValue)
                      })
                    } else {
                      setValue((value) => [...value, currentValue])
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <p>{value.join(", ")}</p>
    </div>
  )
}
