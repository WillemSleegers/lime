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

import data from "@/assets/data/data.json"
import papers from "@/assets/data/papers.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"

type PaperDialogProps = {
  row: Row<any>
}

export const PaperDialog = ({ row }: PaperDialogProps) => {
  const paperData = data.filter((datum) => datum.paper === row.original.paper)
  const studies = [...new Set(paperData.map((datum) => datum.study))]

  const paper = paperData[0].paper
  const paper_label = paperData[0].paper_label
  const paper_title = paperData[0].paper_title
  const paper_authors = paperData[0].paper_authors
  const paper_link = paperData[0].paper_link

  const intervention_description = interventions.filter((p) => p.paper == paper)

  const outcome_description = outcomes.filter((p) => p.paper == paper)

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <span className="whitespace-nowrap underline-offset-2 hover:underline">
          {paper_label}
        </span>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{paper_label}</DialogTitle>
          <DialogDescription>
            General paper information, focusing on text-heavy information.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b text-lg font-semibold">
              Paper{" "}
              {paper_link && (
                <Link href={paper_link} target="_blank">
                  <LinkIcon width={14} height={14} />
                </Link>
              )}
            </div>
            <div>
              <div className="font-semibold">Title</div>
              <div className="text-sm text-muted-foreground">{paper_title}</div>
            </div>
            <div>
              <div className="font-semibold">Authors</div>
              <div className="text-sm text-muted-foreground">
                {paper_authors}
              </div>
            </div>
          </div>

          {/* {studies.map((study) => {
            return (
              <div key={study}>
                <h1 className="font-semibold text-2xl">Study {study}</h1>
              </div>
            )
          })} */}

          {intervention_description && (
            <div className="space-y-2">
              <div className="border-b text-lg font-semibold">
                Intervention(s)
              </div>
              <ul className="ms-6 list-outside list-disc">
                {intervention_description.map((e, i) => (
                  <li
                    className="text-sm text-muted-foreground"
                    key={e.paper + "-intervention-" + i}
                  >
                    {e.intervention_description}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {outcome_description && (
            <div className="space-y-2">
              <div className="border-b text-lg font-semibold">Outcome(s)</div>
              <ul className="ms-6 list-outside list-disc">
                {outcome_description.map((paper, i) => (
                  <li
                    className="text-sm text-muted-foreground"
                    key={paper.paper + "-outcome-" + i}
                  >
                    {paper.outcome_description.charAt(0).toUpperCase() +
                      paper.outcome_description.slice(1)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
