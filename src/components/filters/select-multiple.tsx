import { Checkbox } from "../ui/checkbox"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form"

type FilterSelectMultipleProps = {
  form: any
  name: string
  groups: {
    label: string
    items: {
      id: string
      label: string
    }[]
  }[]
}

export function FilterSelectMultiple(props: FilterSelectMultipleProps) {
  const { form, name, groups } = props

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className="flex flex-col">
          <div className="flex gap-3">
            {groups.map((group) => (
              <div key={group.label}>
                <FormLabel className="text-base">{group.label}</FormLabel>
                <div className="">
                  {group.items.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={name}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(item.label)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        item.label,
                                      ])
                                    : field.onChange(
                                        field.value.filter(
                                          (value: any) => value !== item.label
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
