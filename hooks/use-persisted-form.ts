"use client"

import { useEffect } from "react"
import { FieldValues, UseFormReturn } from "react-hook-form"

export function loadFormValues<T>(key: string, defaults: T): T {
  try {
    const saved = localStorage.getItem(key)
    if (saved) return { ...defaults, ...JSON.parse(saved) }
  } catch {}
  return defaults
}

export function clearFormValues(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export function usePersistedForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string
): void {
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(key, JSON.stringify(values))
      } catch {}
    })
    return () => subscription.unsubscribe()
  }, [form, key])
}
