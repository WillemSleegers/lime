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
      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="h-auto rounded-lg w-fit px-6 py-3"
        >
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={!data}
          className="h-auto rounded-lg w-fit px-6 py-3"
        >
          Continue to meta-analysis
        </Button>
      </div>
    </div>
  )
}
