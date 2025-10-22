# Reusable Form Components - Complete

## Overview

We've created three reusable form components that follow shadcn's modern Field component pattern using React Hook Form's `Controller` instead of the deprecated `FormField` components.

---

## Components Created

### 1. CheckboxGroup
**File:** `/components/form/checkbox-group.tsx`

A reusable component for checkbox groups with optional descriptions.

**Features:**
- ✅ Multiple checkbox selection
- ✅ Horizontal layout with label and description
- ✅ Uses `FieldSet`, `FieldLegend`, `FieldGroup`, and `Field` components
- ✅ Type-safe with TypeScript generics
- ✅ Validation state and error display

**Usage:**
```tsx
<CheckboxGroup
  control={form.control}
  name="paper_type"
  label="Publication type"
  options={[
    {
      value: "peer reviewed paper",
      label: "Peer reviewed paper",
      description: "Journal articles and conference papers"
    },
    {
      value: "preprint",
      label: "Preprint",
      description: "Publications that are not yet peer-reviewed"
    },
  ]}
/>
```

**Props:**
```typescript
type CheckboxGroupProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  options: Array<{
    value: string
    label: string
    description?: string
  }>
  description?: string  // Optional group-level description
}
```

---

### 2. SliderField
**File:** `/components/form/slider-field.tsx`

A reusable component for single or range sliders.

**Features:**
- ✅ Single value or range (array) support
- ✅ Automatic value display ("From X to Y" for ranges)
- ✅ Type-safe with TypeScript generics
- ✅ Validation state and error display
- ✅ Configurable min, max, step

**Usage:**
```tsx
<SliderField
  control={form.control}
  name="paper_year"
  label="Publication year"
  min={2000}
  max={2024}
  minStepsBetweenThumbs={1}
  className="w-[200px]"
/>
```

**Props:**
```typescript
type SliderFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  min: number
  max: number
  step?: number
  minStepsBetweenThumbs?: number
  className?: string
}
```

---

### 3. InputField
**File:** `/components/form/input-field.tsx`

A reusable component for text, number, email, and other input types.

**Features:**
- ✅ Supports multiple input types (text, email, password, number, tel, url)
- ✅ Type-safe with TypeScript generics
- ✅ Validation state and error display
- ✅ Optional description and placeholder

**Usage:**
```tsx
<InputField
  control={form.control}
  name="sample_size"
  label="Minimum sample size"
  description="Minimum per control or intervention condition"
  type="number"
  placeholder="Enter number"
/>
```

**Props:**
```typescript
type InputFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  className?: string
}
```

---

## Migration Summary

### Before (Old Pattern with FormField):
```tsx
<FormField
  control={form.control}
  name="sample_size"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-base">
        Minimum sample size
      </FormLabel>
      <FormDescription>
        Minimum per control or intervention condition
      </FormDescription>
      <FormControl>
        <Input
          className="rounded-lg bg-white"
          type="number"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```
**Lines:** 18 lines

### After (New Pattern with InputField):
```tsx
<InputField
  control={form.control}
  name="sample_size"
  label="Minimum sample size"
  description="Minimum per control or intervention condition"
  type="number"
  className="rounded-lg bg-white"
/>
```
**Lines:** 7 lines (61% reduction)

---

## Key Benefits

### 1. Code Reduction
- **CheckboxGroup:** Reduces 40+ lines to 5-7 lines per usage
- **SliderField:** Reduces 25 lines to 8 lines per usage
- **InputField:** Reduces 18 lines to 7 lines per usage

### 2. Consistency
- All components follow the same pattern
- Uses `Controller` + `Field` (shadcn's recommended approach)
- Consistent validation and error handling

### 3. Type Safety
- Generic components work with any form schema
- TypeScript enforces correct field names
- Full type inference for field values

### 4. Maintainability
- Single source of truth for each field type
- Easy to update styling/behavior in one place
- Clear separation of concerns

### 5. Modern Pattern
- Uses `Controller` from react-hook-form (not deprecated `FormField`)
- Uses `Field` components (not deprecated `Form*` components)
- Follows shadcn/ui's latest recommendations

---

## Usage in Meta-Analysis Page

The meta-analysis filter page (`/components/meta-analysis/filters.tsx`) now uses all three components:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Papers</CardTitle>
    <CardDescription>Filter by publication characteristics</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6 items-start">
      {/* Slider */}
      <SliderField
        control={form.control}
        name="paper_year"
        label="Publication year"
        min={Math.min(...data.map((datum) => datum.paper_year))}
        max={Math.max(...data.map((datum) => datum.paper_year))}
        minStepsBetweenThumbs={1}
        className="w-[200px]"
      />

      {/* Checkbox Groups */}
      <CheckboxGroup
        control={form.control}
        name="paper_type"
        label="Publication type"
        options={PAPER_TYPE_OPTIONS_NEW}
      />

      <CheckboxGroup
        control={form.control}
        name="paper_open_access"
        label="Access type"
        options={PAPER_OPEN_ACCESS_OPTIONS_NEW}
      />
    </div>
  </CardContent>
</Card>

<Card>
  <CardHeader>
    <CardTitle>Samples</CardTitle>
    <CardDescription>Filter by sample characteristics</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
      {/* Input Field */}
      <InputField
        control={form.control}
        name="sample_size"
        label="Minimum sample size"
        description="Minimum per control or intervention condition"
        type="number"
        className="rounded-lg bg-white"
      />
    </div>
  </CardContent>
</Card>
```

---

## Constants Updates

Added new constant formats with separate `label` and `description` fields:

**File:** `/constants/constants-filters.ts`

```typescript
export const PAPER_TYPE_OPTIONS_NEW = [
  {
    value: "peer reviewed paper",
    label: "Peer reviewed paper",
    description: "Journal articles and conference papers",
  },
  {
    value: "preprint",
    label: "Preprint",
    description: "Publications that are not yet peer-reviewed",
  },
  // ...
]
```

This replaces the old format:
```typescript
{
  value: "preprint",
  label: "Preprint (early drafts, not yet peer-reviewed)",
}
```

---

## Next Steps

These reusable components can be applied to:

1. **Study Fields** - Preregistration, data availability, design, etc.
2. **Outcome Fields** - Measurement types, categories
3. **Intervention Fields** - Content, mechanism, medium
4. **Data Explorer** - All filter components can be migrated

Simply update the constants to the new format and replace old FormField usage with the appropriate reusable component.

---

## Files Modified

### Created:
1. ✅ `/components/form/checkbox-group.tsx`
2. ✅ `/components/form/slider-field.tsx`
3. ✅ `/components/form/input-field.tsx`

### Updated:
1. ✅ `/constants/constants-filters.ts` - Added `*_NEW` constants
2. ✅ `/components/meta-analysis/filters.tsx` - Using all three components
3. ✅ `/components/filter-fields/paper-fields.tsx` - Legacy wrappers for backward compatibility

### Documentation:
1. ✅ `/FORM_MIGRATION.md` - Migration guide
2. ✅ `/MIGRATION_COMPLETE.md` - Paper fields migration summary
3. ✅ `/FORM_COMPONENTS_SUMMARY.md` - This file
