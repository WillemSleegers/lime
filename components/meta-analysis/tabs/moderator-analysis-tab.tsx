import { WebR } from "webr"
import { ModeratorAnalysis } from "@/components/meta-analysis/moderator-analysis"
import { Data, Status } from "@/lib/types"

type ModeratorAnalysisTabProps = {
  data?: Data
  webR: { current: WebR | null }
  status: Status
}

export const ModeratorAnalysisTab = ({ data, webR, status }: ModeratorAnalysisTabProps) => {
  if (!data) return null

  return (
    <ModeratorAnalysis data={data} webR={webR} status={status} />
  )
}
