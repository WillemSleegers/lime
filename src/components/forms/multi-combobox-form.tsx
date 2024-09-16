"use client"

import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "../ui/badge"

type MultiComboboxFormProps = {
  form: any
  data: {
    label: string
    value: string
    checked: boolean
  }[]
}

export function MultiComboboxForm({ form, data }: MultiComboboxFormProps) {
  return (
    <FormField
      control={form.control}
      name="behaviors"
      render={() => (
        <FormItem>
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[200px] justify-between font-normal"
                  >
                    Behaviors
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search behaviors..." />
                  <CommandList>
                    <CommandEmpty>No behavior found.</CommandEmpty>
                    <CommandGroup>
                      {data.map((datum) => (
                        <CommandItem
                          value={datum.label}
                          key={datum.value}
                          onSelect={() => {
                            datum.checked = !datum.checked
                            form.setValue(
                              "behaviors",
                              data.filter((d) => d.checked).map((d) => d.value),
                            )
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              datum.checked ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {datum.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
            <div className="flex flex-wrap gap-3">
              {data.map((datum) => {
                if (datum.checked)
                  return (
                    <Badge key={datum.value} className="mr-3 mt-2">
                      {datum.label}
                    </Badge>
                  )
              })}
            </div>
          </div>
        </FormItem>
      )}
    />
  )
}
