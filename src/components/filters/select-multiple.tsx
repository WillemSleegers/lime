import { Checkbox } from "../ui/checkbox"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form"

type FilterSelectMultipleProps = {
  form: any
  name: string
  label: string
  description: string
  items: {
    id: string
    label: string
  }[]
}

export function FilterSelectMultiple(props: FilterSelectMultipleProps) {
  const { form, name, label, description, items } = props

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <div>
            <FormLabel className="text-base">{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          {items.map((item) => (
            <FormField
              key={item.id}
              control={form.control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value: any) => value !== item.id
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{item.label}</FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
