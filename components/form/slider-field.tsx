import { Controller, Control, FieldValues, Path } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"

type SliderFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  min: number
  max: number
  step?: number
  minStepsBetweenThumbs?: number
  className?: string
}

export function SliderField<T extends FieldValues>({
  control,
  name,
  label,
  min,
  max,
  step = 1,
  minStepsBetweenThumbs,
  className,
}: SliderFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        // For range sliders (array value), show "from X to Y"
        // Format numbers to 2 decimal places if they're floats
        const formatNumber = (num: number) => {
          return Number.isInteger(num) ? num : num.toFixed(2)
        }

        const displayValue = Array.isArray(field.value)
          ? `From ${formatNumber(field.value[0])} to ${formatNumber(field.value[1])}`
          : String(field.value)

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Slider
              id={name}
              value={field.value}
              onValueChange={field.onChange}
              min={min}
              max={max}
              step={step}
              minStepsBetweenThumbs={minStepsBetweenThumbs}
              className={`my-2 ${className || ""}`}
              aria-invalid={fieldState.invalid}
            />
            <FieldDescription>{displayValue}</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )
      }}
    />
  )
}
