import { Dispatch, SetStateAction } from "react"

import { Filters } from "@/components/meta-analysis/filters"
import { Status, Data } from "@/lib/types"

type InclusionCriteriaTabProps = {
  status: Status
  setData: Dispatch<SetStateAction<Data | undefined>>
  onFiltersApplied: () => void
}

export const InclusionCriteriaTab = ({
  status,
  setData,
  onFiltersApplied,
}: InclusionCriteriaTabProps) => {
  return (
    <Filters status={status} setData={setData} onFiltersApplied={onFiltersApplied} />
  )
}
