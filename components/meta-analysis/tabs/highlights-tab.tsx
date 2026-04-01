import { Highlights } from "@/components/meta-analysis/highlights"
import { Button } from "@/components/ui/button"
import { Data } from "@/lib/types"

type HighlightsTabProps = {
  data?: Data
  onContinue: () => void
  onBack: () => void
}

export const HighlightsTab = ({ data, onContinue, onBack }: HighlightsTabProps) => {
  return (
    <div className="space-y-8">
      <Highlights data={data} />
      <div className="flex items-center gap-3">
        <Button onClick={onBack} variant="outline" className="h-auto">
          Back
        </Button>
        <Button onClick={onContinue} disabled={!data} className="h-auto">
          Next
        </Button>
      </div>
    </div>
  )
}
