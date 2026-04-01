import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Count } from "@/components/ui/count"

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  count?: number
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  className?: string
}

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  count,
  placeholder,
  type = "text",
  className,
}: InputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className={`bg-card ${className || ""}`}
            value={field.value ?? ""}
            onChange={(e) => {
              const value = type === "number" ? e.target.valueAsNumber : e.target.value
              field.onChange(value)
            }}
          />
          {description && (
            <FieldDescription>
              {description}{count !== undefined && <> <Count n={count} /></>}
            </FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
