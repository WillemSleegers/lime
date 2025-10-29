import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

type CheckboxOption = {
  value: string
  label: string
  description?: string
}

type CheckboxGroupProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  options: CheckboxOption[]
  description?: string
}

export function CheckboxGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  description,
}: CheckboxGroupProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldSet data-invalid={fieldState.invalid}>
          <FieldLegend variant="label">{label}</FieldLegend>
          {description && <FieldDescription>{description}</FieldDescription>}
          <FieldGroup data-slot="checkbox-group">
            {options.map((option) => (
              <Field
                key={option.value}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={`${name}-${option.value}`}
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={field.value?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...(field.value || []), option.value]
                      : (field.value || []).filter(
                          (v: string) => v !== option.value
                        )
                    field.onChange(newValue)
                  }}
                />
                <FieldContent>
                  <FieldLabel
                    htmlFor={`${name}-${option.value}`}
                    className="font-normal"
                  >
                    {option.label}
                  </FieldLabel>
                  {option.description && (
                    <FieldDescription>{option.description}</FieldDescription>
                  )}
                </FieldContent>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  )
}
