import { Dispatch, SetStateAction } from "react"
import { WebR } from "webr"
import { ModeratorAnalysis } from "@/components/meta-analysis/moderator-analysis"
import { Data, ModeratorResult, Status } from "@/lib/types"

type ModeratorAnalysisTabProps = {
  data?: Data
  webR: { current: WebR | null }
  status: Status
  result: ModeratorResult | undefined
  setResult: Dispatch<SetStateAction<ModeratorResult | undefined>>
}

export const ModeratorAnalysisTab = ({ data, webR, status, result, setResult }: ModeratorAnalysisTabProps) => {
  if (!data) return null

  return (
    <ModeratorAnalysis data={data} webR={webR} status={status} result={result} setResult={setResult} />
  )
}
