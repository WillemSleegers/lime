"use client"

import { useEffect, useRef } from "react"
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
  key: string,
  defaults: T
): void {
  // Load persisted values exactly once. Gated by a ref so a fresh `defaults`
  // object on a later re-render doesn't clobber in-progress user input.
  const loaded = useRef(false)
  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    form.reset(loadFormValues(key, defaults))
  }, [form, key, defaults])

  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        localStorage.setItem(key, JSON.stringify(values))
      } catch {}
    })
    return () => subscription.unsubscribe()
  }, [form, key])
}
