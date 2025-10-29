import { useState } from "react"
import type { Data } from "@/lib/types"
import {
  applyLocksToData,
  type FilteredData,
  type Locks,
} from "@/lib/data-explorer-utils"

export function useDataExplorerState(
  initialData: FilteredData,
  fullData: Data
) {
  const [filteredData, setFilteredData] = useState<FilteredData>(initialData)
  const [locks, setLocks] = useState<Locks>({
    papers: false,
    studies: false,
    samples: false,
    interventions: false,
    outcomes: false,
    effects: false,
  })

  // React Compiler will automatically memoize this computation
  const displayData = applyLocksToData(fullData, filteredData, locks)

  return { displayData, filteredData, setFilteredData, locks, setLocks }
}
