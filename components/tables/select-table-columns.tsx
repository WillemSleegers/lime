"use client"

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
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CommandSeparator } from "cmdk"

type SelectTableColumnsProps = {
  data: {
    value: string
    label: string
    columns: {
      value: string
      label: string
    }[]
  }[]
  selectedColumns: string[]
  setSelectedColumns: Function
}

export const SelectTableColumns = ({
  data,
  selectedColumns,
  setSelectedColumns,
}: SelectTableColumnsProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Select columns...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search columns..." />
          <CommandEmpty>No column found.</CommandEmpty>
          <CommandGroup className="max-h-80 overflow-y-auto">
            {data.map((datum) => {
              return (
                <div key={datum.value}>
                  <CommandSeparator className="px-2 py-1.5 text-sm font-semibold">
                    {datum.label}
                  </CommandSeparator>
                  {datum.columns.map((column) => (
                    <CommandItem
                      key={column.value}
                      value={column.value}
                      onSelect={(currentValue) => {
                        selectedColumns.includes(currentValue)
                          ? setSelectedColumns(
                              selectedColumns.filter((v) => v != currentValue),
                            )
                          : setSelectedColumns([
                              ...selectedColumns,
                              currentValue,
                            ])
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedColumns.includes(column.value)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {column.label}
                    </CommandItem>
                  ))}
                </div>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
