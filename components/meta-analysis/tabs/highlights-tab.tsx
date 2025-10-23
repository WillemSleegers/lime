import { Highlights } from "@/components/meta-analysis/highlights"
import { Data } from "@/lib/types"

type HighlightsTabProps = {
  data?: Data
}

export const HighlightsTab = ({ data }: HighlightsTabProps) => {
  return (
    <div className="space-y-8">
      <p className="text-description">
        Review summary statistics and breakdowns of your filtered selection.
        Check that your filters have produced a reasonable set of studies before
        running the meta-analysis.
      </p>
      <Highlights data={data} />
    </div>
  )
}
