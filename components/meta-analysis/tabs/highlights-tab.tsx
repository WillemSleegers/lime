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
        className="h-auto rounded-lg w-fit px-6 py-3"
      >
        Continue to analysis
      </Button>
    </div>
  )
}
