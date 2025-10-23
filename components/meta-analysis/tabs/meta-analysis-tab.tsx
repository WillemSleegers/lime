import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CollapsibleEstimate } from "@/components/meta-analysis/estimate"
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
      <div className="space-y-6">
        <p className="text-description">
          Run the meta-analysis to calculate pooled effect sizes and confidence
          intervals. Results include forest plots, publication bias tests, and
          downloadable data. The analysis uses robust variance estimation to
          account for dependencies between effects from the same study.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={runAnalysis}
            disabled={!data || status !== "Ready"}
            className="h-auto rounded-lg w-fit px-6 py-3"
          >
            {status !== "Ready" ? "Running..." : "Run meta-analysis"}
          </Button>
        </div>
      </div>
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
