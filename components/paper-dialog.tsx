import Link from "next/link"
import { LinkIcon } from "lucide-react"
import { Row } from "@tanstack/react-table"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import data from "@/assets/data/data-nested.json"

type PaperDialogProps = {
  row: Row<any>
}

export const PaperDialog = ({ row }: PaperDialogProps) => {
  const paperData = data.find((datum) => datum.paper === row.original.paper)

  if (!paperData) return

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <span className="whitespace-nowrap underline-offset-2 hover:underline">
          {paperData.paper_label}
        </span>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-auto p-4"
        style={{ maxHeight: "95dvh" }}
      >
        <DialogHeader>
          <DialogTitle>{paperData.paper_label}</DialogTitle>
          <DialogDescription>
            General paper information, focusing on text-heavy information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="border-b flex items-center gap-2">
              <div className="text-lg font-semibold">Paper</div>
              {paperData.paper_link && (
                <Link href={paperData.paper_link} target="_blank">
                  <LinkIcon width={14} height={14} />
                </Link>
              )}
            </div>
            <div>
              <div className="text-base font-semibold">Title</div>
              <div className="text-sm text-muted-foreground">
                {paperData.paper_title}
              </div>
            </div>
            <div>
              <div className="text-base font-semibold">Authors</div>
              <div className="text-sm text-muted-foreground">
                {paperData.paper_authors}
              </div>
            </div>
          </div>

          {paperData.studies.map((studyData) => {
            return (
              <div key={studyData.study} className="space-y-2">
                <div className="border-b">
                  <div className="text-lg font-semibold">
                    Study {studyData.study}
                  </div>
                </div>

                <div>
                  <div className="text-base font-semibold">Sample size</div>
                  <div className="text-sm text-muted-foreground">
                    {studyData.study_n}
                  </div>
                </div>

                <div>
                  <div className="text-base font-semibold">Interventions</div>
                  <div className="text-sm text-muted-foreground">
                    <ul className="ms-6 list-outside list-disc">
                      {studyData.interventions.map((interventionData, i) => (
                        <li
                          className="text-sm text-muted-foreground"
                          key={paperData.paper + "-intervention-" + i}
                        >
                          {interventionData.intervention_description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="text-base font-semibold">Outcomes</div>
                  <div className="text-sm text-muted-foreground">
                    <ul className="ms-6 list-outside list-disc">
                      {studyData.outcomes.map((outcomeData, i) => (
                        <li
                          className="text-sm text-muted-foreground"
                          key={paperData.paper + "-outcome-" + i}
                        >
                          {outcomeData.outcome_description}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
