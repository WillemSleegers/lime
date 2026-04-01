export function countOption(
  subset: Record<string, unknown>[],
  field: string,
  value: string,
  match: "exact" | "substring",
): number {
  return subset.filter((d) => {
    const val = String(d[field] ?? "")
    if (!val) return false
    return match === "exact" ? val === value : val.includes(value)
  }).length
}
