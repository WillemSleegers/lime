import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select"

type OptionItem = string | { value: string; label: string }

type GroupedOptions = Array<{
  group: string
  items: OptionItem[]
}>

type MultiSelectFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  placeholder?: string
  options: OptionItem[] | GroupedOptions
  searchPlaceholder?: string
  searchEmptyMessage?: string
  className?: string
}

// Type guard to check if options are grouped
function isGroupedOptions(
  options: OptionItem[] | GroupedOptions
): options is GroupedOptions {
  return (
    Array.isArray(options) &&
    options.length > 0 &&
    typeof options[0] === "object" &&
    "group" in options[0] &&
    "items" in options[0]
  )
}

export function MultiSelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Select...",
  options,
  searchPlaceholder,
  searchEmptyMessage = "No results found.",
  className,
}: MultiSelectFieldProps<T>) {
  // Normalize a single option to always have value/label structure
  const normalizeOption = (option: OptionItem) =>
    typeof option === "string" ? { value: option, label: option } : option

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <MultiSelect onValuesChange={field.onChange} values={field.value}>
            <MultiSelectTrigger
              id={name}
              className={`bg-card ${className || ""}`}
              aria-invalid={fieldState.invalid}
            >
              <MultiSelectValue placeholder={placeholder} />
            </MultiSelectTrigger>
            <MultiSelectContent
              search={
                searchPlaceholder
                  ? {
                      placeholder: searchPlaceholder,
                      emptyMessage: searchEmptyMessage,
                    }
                  : undefined
              }
            >
              {isGroupedOptions(options) ? (
                // Render grouped options
                <>
                  {options.map((group, groupIndex) => (
                    <div key={group.group}>
                      <MultiSelectGroup heading={group.group}>
                        {group.items.map((item) => {
                          const normalized = normalizeOption(item)
                          return (
                            <MultiSelectItem
                              key={normalized.value}
                              value={normalized.value}
                            >
                              {normalized.label}
                            </MultiSelectItem>
                          )
                        })}
                      </MultiSelectGroup>
                      {groupIndex < options.length - 1 && (
                        <MultiSelectSeparator />
                      )}
                    </div>
                  ))}
                </>
              ) : (
                // Render flat options
                <MultiSelectGroup>
                  {options.map((item) => {
                    const normalized = normalizeOption(item)
                    return (
                      <MultiSelectItem
                        key={normalized.value}
                        value={normalized.value}
                      >
                        {normalized.label}
                      </MultiSelectItem>
                    )
                  })}
                </MultiSelectGroup>
              )}
            </MultiSelectContent>
          </MultiSelect>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
