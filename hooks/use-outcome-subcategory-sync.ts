"use client"

import { useEffect, useRef } from "react"
import { FieldValues, Path, UseFormReturn, useWatch } from "react-hook-form"
import { getOutcomeSubcategoryOptions } from "@/constants/constants-filters"

type OutcomeCategoryFields = {
  outcome_category: string[]
  outcome_subcategory: string[]
}

// Keeps outcome_subcategory in sync with outcome_category: checking a
// category selects all of its subcategories, unchecking one drops any of
// its subcategories that are no longer valid for what's left checked.
// Returns the subcategory options valid for the currently selected
// categories, deduplicated across categories that share a subcategory
// label (e.g. "meat consumption" as both an observed and a self-reported
// behavior).
export function useOutcomeSubcategorySync<T extends FieldValues & OutcomeCategoryFields>(
  form: UseFormReturn<T>
): string[] {
  const categoryField = "outcome_category" as Path<T>
  const subcategoryField = "outcome_subcategory" as Path<T>

  const selectedCategories = (useWatch({ control: form.control, name: categoryField }) as
    | string[]
    | undefined) ?? []
  const subcategoryOptions = getOutcomeSubcategoryOptions(selectedCategories)
  const selectedCategoriesKey = [...selectedCategories].sort().join(",")
  const previousCategoriesRef = useRef(selectedCategories)

  useEffect(() => {
    const previous = previousCategoriesRef.current
    const addedCategories = selectedCategories.filter((c) => !previous.includes(c))
    previousCategoriesRef.current = selectedCategories

    const valid = new Set(subcategoryOptions)
    const addedSubcategories = addedCategories.flatMap((c) => getOutcomeSubcategoryOptions([c]))
    const current = (form.getValues(subcategoryField) as string[] | undefined) ?? []

    const next = new Set(current.filter((v) => valid.has(v)))
    addedSubcategories.forEach((v) => next.add(v))

    const nextArray = [...next]
    const changed =
      nextArray.length !== current.length || nextArray.some((v) => !current.includes(v))
    if (changed) {
      form.setValue(subcategoryField, nextArray as T[keyof T])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoriesKey])

  return subcategoryOptions
}
