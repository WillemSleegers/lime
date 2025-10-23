import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CollapsibleEstimate } from "@/components/meta-analysis/estimate"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { CollapsiblePublicationBias } from "@/components/meta-analysis/publication-bias"
import { ForestPlot } from "@/components/meta-analysis/forest-plot"
import { RCode } from "@/components/meta-analysis/R-code"
import DotPlotExample from "@/components/meta-analysis/dot-plot"

import { exportToCSV } from "@/lib/csv-utils"
import codebook from "@/assets/data/codebook.json"
import { Data, Egger, Estimate, Status } from "@/lib/types"

const handleDownload = (fileName: string, data?: Record<string, unknown>[]) => {
  if (!data) return
  exportToCSV(data, fileName)
}

type MetaAnalysisTabProps = {
  data?: Data
  estimate?: Estimate
  egger?: Egger
  status: Status
  runAnalysis: () => Promise<void>
}

export const MetaAnalysisTab = ({
  data,
  estimate,
  egger,
  status,
  runAnalysis,
}: MetaAnalysisTabProps) => {
  return (
    <div className="space-y-8">
      {status !== "Ready" && !estimate && (
        <Card>
          <CardContent className="flex items-center gap-3 py-8">
            <Spinner className="size-5" />
            <span>Running meta-analysis...</span>
          </CardContent>
        </Card>
      )}
      <CollapsibleEstimate estimate={estimate} />
      <CollapsiblePublicationBias estimate={estimate} egger={egger} data={data} />
      <div>
        <DotPlotExample data={data} />
      </div>
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
