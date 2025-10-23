import { Dispatch, SetStateAction } from "react"

import { Filters } from "@/components/meta-analysis/filters"
import { Status, Data } from "@/lib/types"

type InclusionCriteriaTabProps = {
  status: Status
  setData: Dispatch<SetStateAction<Data | undefined>>
}

export const InclusionCriteriaTab = ({
  status,
  setData,
}: InclusionCriteriaTabProps) => {
  return (
    <div className="space-y-8">
      <p className="text-description">
        Select which studies to include in your meta-analysis by filtering on
        publication, study design, outcome, intervention, and sample
        characteristics. Start with the default settings or adjust filters to
        focus on specific types of effects.
      </p>
      <Filters status={status} setData={setData} />
    </div>
  )
}
