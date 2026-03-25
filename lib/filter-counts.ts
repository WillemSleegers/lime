/**
 * Counts effects in `subset` where `field` matches `value`.
 * Exact match is used for categorical fields; substring match for multi-value fields.
 */
export function countOption(
  subset: Record<string, unknown>[],
  field: string,
  value: string,
): number {
  return subset.filter((d) => {
    const val = String(d[field] ?? "")
    if (!val) return false
    if (
      field === "outcome_subcategory" ||
      field === "sample_country" ||
      field === "study_preregistered"
    )
      return val === value
    if (field === "outcome_measurement_type")
      return val.includes(value.toLowerCase())
    return val.includes(value)
  }).length
}
