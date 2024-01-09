import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

type FilterInputProps = {
  form: any
  name: string
  label: string
  description: string
  type: string
  placeholder: string
}

export function FilterInput(props: FilterInputProps) {
  const { form, name, label, description, type, placeholder } = props

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-80">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} type={type} {...field} />
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
