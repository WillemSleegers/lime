import { Highlights } from "@/components/meta-analysis/highlights"
import { Button } from "@/components/ui/button"
import { Data } from "@/lib/types"

type HighlightsTabProps = {
  data?: Data
  onContinue: () => void
}

export const HighlightsTab = ({ data, onContinue }: HighlightsTabProps) => {
  return (
    <div className="space-y-8">
      <Highlights data={data} />
      <Button
        onClick={onContinue}
        disabled={!data}
        className="h-auto"
      >
        Next
      </Button>
    </div>
  )
}
