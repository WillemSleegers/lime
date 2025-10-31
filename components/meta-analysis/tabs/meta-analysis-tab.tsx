import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { CollapsibleEstimate } from "@/components/meta-analysis/estimate"
import { Spinner } from "@/components/ui/spinner"
import { CollapsiblePublicationBias } from "@/components/meta-analysis/publication-bias"
import { ForestPlot } from "@/components/meta-analysis/forest-plot"
import { RCode } from "@/components/meta-analysis/R-code"
import DotPlotExample from "@/components/meta-analysis/dot-plot"

import { exportToCSV } from "@/lib/csv-utils"
import codebook from "@/assets/data/codebook.json"
import { Data, Egger, Estimate } from "@/lib/types"

const handleDownload = (fileName: string, data?: Record<string, unknown>[]) => {
  if (!data) return
  exportToCSV(data, fileName)
}

type MetaAnalysisTabProps = {
  data?: Data
  estimate?: Estimate
  egger?: Egger
  error?: string
}

export const MetaAnalysisTab = ({
  data,
  estimate,
  egger,
  error,
}: MetaAnalysisTabProps) => {
  // Show error state if there was an error
  if (error) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="text-center space-y-2">
              <p className="font-medium text-destructive">Meta-analysis failed</p>
              <p className="text-sm text-muted-foreground max-w-lg">
                {error}
              </p>
              <p className="text-sm text-muted-foreground">
                Please try adjusting your filters or contact support if the problem persists.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading state until results are ready
  if (!estimate || !egger || !data) {
    return (
      <div className="space-y-8">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <Spinner className="size-8" />
            <div className="text-center space-y-2">
              <p className="font-medium">Running meta-analysis...</p>
              <p className="text-sm text-muted-foreground">
                This may take a few moments while we analyze your selected studies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show results once ready
  return (
    <div className="space-y-8">
      <CollapsibleEstimate estimate={estimate} />
      <CollapsiblePublicationBias estimate={estimate} egger={egger} data={data} />
      <DotPlotExample data={data} />
      <ForestPlot data={data} />
      <div className="flex justify-center gap-3">
        <RCode />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-32" variant="outline">
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              disabled={data == undefined}
              onClick={() => handleDownload("lime-data.csv", data)}
            >
              Data
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownload("codebook.csv", codebook)}
            >
              Codebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
