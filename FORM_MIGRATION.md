# Form Migration Guide: Transitioning to Field Components

## Overview

shadcn/ui is deprecating the old `Form*` components (FormField, FormItem, FormControl, etc.) in favor of the new `Field` component pattern. This document outlines how to migrate our forms to the modern approach.

## Current State (Old Pattern - Being Deprecated)

```tsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"

<FormField
  control={control}
  name="field_name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>Helper text</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

**Problems with this approach:**
- `FormField`, `FormItem`, `FormControl` are deprecated
- Extra wrapper components that aren't needed
- Less flexible for modern layouts

---

## New Pattern (Field Components)

### Basic Structure

```tsx
import { Controller } from "react-hook-form"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"

<Controller
  control={control}
  name="field_name"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
      <Input
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
      />
      <FieldDescription>Helper text</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Key Changes

| Old Component | New Component | Notes |
|--------------|---------------|-------|
| `FormField` | `Controller` | From react-hook-form directly |
| `FormItem` | `Field` | New shadcn component |
| `FormLabel` | `FieldLabel` | New shadcn component |
| `FormDescription` | `FieldDescription` | New shadcn component |
| `FormMessage` | `FieldError` | New shadcn component |
| `FormControl` | *removed* | No longer needed |

### Important Concepts

**1. Controller from react-hook-form**
- Direct import: `import { Controller } from "react-hook-form"`
- Provides `field` and `fieldState` in render prop
- `field` = value, onChange, onBlur, name, ref
- `fieldState` = error, invalid, isDirty, isTouched

**2. Field orientation**
- `orientation="vertical"` (default) - Label above input
- `orientation="horizontal"` - Label beside input (great for checkboxes)
- `orientation="responsive"` - Adapts based on screen size

**3. Validation state**
- `data-invalid={fieldState.invalid}` on Field component
- `aria-invalid={fieldState.invalid}` on input for accessibility
- `FieldError` conditionally rendered when invalid

---

## Example: Checkbox with Description (Horizontal Layout)

```tsx
<Controller
  control={control}
  name="paper_type"
  render={({ field, fieldState }) => (
    <div className="space-y-3">
      <div className="font-medium">Publication type</div>

      {OPTIONS.map((option) => {
        // Parse label: "Main text (description)"
        const match = option.label.match(/^([^(]+)\s*\(([^)]+)\)$/)
        const mainText = match ? match[1].trim() : option.label
        const description = match ? match[2].trim() : null

        return (
          <Field
            key={option.value}
            orientation="horizontal"
            data-invalid={fieldState.invalid}
          >
            <Checkbox
              id={`field-${option.value}`}
              checked={field.value?.includes(option.value)}
              onCheckedChange={(checked) => {
                const newValue = checked
                  ? [...field.value, option.value]
                  : field.value.filter((v: string) => v !== option.value)
                field.onChange(newValue)
              }}
            />
            <FieldContent>
              <FieldLabel htmlFor={`field-${option.value}`}>
                {mainText}
              </FieldLabel>
              {description && (
                <FieldDescription>{description}</FieldDescription>
              )}
            </FieldContent>
          </Field>
        )
      })}

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </div>
  )}
/>
```

**Result:**
```
☑ Peer reviewed paper
  journal articles, conference papers

☑ Preprint
  early drafts, not yet peer-reviewed
```

---

## Migration Checklist

### Files that need updating:

#### Paper Fields
- [ ] `/components/filter-fields/paper-fields.tsx`
  - [ ] `PaperType` - Convert to Controller + Field (checkboxes)
  - [ ] `PaperOpenAccess` - Convert to Controller + Field (checkboxes)
  - [ ] `PaperYear` - Keep as is or convert (slider)

#### Study Fields
- [ ] `/components/filter-fields/study-fields.tsx`
  - [ ] All checkbox fields with descriptions

#### Outcome Fields
- [ ] `/components/filter-fields/outcome-fields.tsx`
  - [ ] Outcome category checkboxes
  - [ ] Measurement type checkboxes

#### Intervention Fields
- [ ] `/components/filter-fields/intervention-fields.tsx`
  - [ ] Content/mechanism/medium filters

#### Main Filter Form
- [ ] `/components/meta-analysis/filters.tsx`
  - [ ] Update imports
  - [ ] Verify form submission still works

### Testing Checklist

After migration:
- [ ] Form validation still works
- [ ] Error messages display correctly
- [ ] Default values load properly
- [ ] Form submission works
- [ ] Visual alignment is correct
- [ ] Accessibility (keyboard navigation, screen readers)

---

## Benefits of New Approach

1. **Cleaner markup** - Fewer wrapper components
2. **Better alignment** - Field component handles layout automatically
3. **More accessible** - Proper htmlFor/id linking, aria-invalid
4. **Future-proof** - Following shadcn's recommended pattern
5. **Flexible layouts** - Horizontal, vertical, responsive orientations
6. **Library agnostic** - Field components work with any form library

---

## Common Patterns

### Single Input Field
```tsx
<Controller
  control={control}
  name="title"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      <FieldDescription>Your publication title</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Select Dropdown
```tsx
<Controller
  control={control}
  name="status"
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Status</FieldLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger id={field.name}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Checkbox Group (Multiple Values)
```tsx
<Controller
  control={control}
  name="tags"
  render={({ field, fieldState }) => (
    <div className="space-y-3">
      <div className="font-medium">Tags</div>
      {tagOptions.map(tag => (
        <Field key={tag.value} orientation="horizontal">
          <Checkbox
            id={`tag-${tag.value}`}
            checked={field.value?.includes(tag.value)}
            onCheckedChange={(checked) => {
              const newValue = checked
                ? [...field.value, tag.value]
                : field.value.filter(v => v !== tag.value)
              field.onChange(newValue)
            }}
          />
          <FieldLabel htmlFor={`tag-${tag.value}`}>{tag.label}</FieldLabel>
        </Field>
      ))}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </div>
  )}
/>
```

---

## Notes

- We're keeping React Hook Form (not switching to TanStack Form)
- We're only updating the UI layer (Form* → Field)
- Form validation with Zod remains the same
- Form submission logic remains the same
