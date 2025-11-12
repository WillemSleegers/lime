import { useState } from "react"
import type { Data } from "@/lib/types"
import {
  applyFiltersToData,
  type FilteredData,
} from "@/lib/data-explorer-utils"

export function useDataExplorerState(
  initialData: FilteredData,
  fullData: Data
) {
  const [filteredData, setFilteredData] = useState<FilteredData>(initialData)

  // React Compiler will automatically memoize this computation
  const displayData = applyFiltersToData(fullData, filteredData)

  return { displayData, filteredData, setFilteredData }
}
