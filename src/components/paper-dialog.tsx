import Link from "next/link"

import { LinkIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { badgeVariants } from "@/components/ui/badge"

import { cn } from "@/lib/utils"

import papers from "@/assets/data/papers.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"

import { Row } from "@tanstack/react-table"

type PaperDialogProps = {
  row: Row<any>
}

export const PaperDialog = ({ row }: PaperDialogProps) => {
  const paper_label = row.getValue("paper_label") as string
  const paper = papers.find((p) => p.paper_label == paper_label)?.paper

  const paper_title = papers.find((p) => p.paper == paper)?.paper_title

  const paper_authors = papers.find((p) => p.paper == paper)?.paper_authors

  const paper_link = papers.find((p) => p.paper == paper)?.paper_link

  const intervention_description = interventions.filter((p) => p.paper == paper)

  const outcome_description = outcomes.filter((p) => p.paper == paper)

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <span className="whitespace-nowrap underline-offset-2 hover:underline">
          {paper_label}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{paper_label}</DialogTitle>
          <DialogDescription>
            <span className="block border-b text-xl font-semibold text-foreground">
              Paper
            </span>

            <span className="mb-1 mt-2 block text-base font-semibold text-black">
              Title
            </span>
            <span className="block">{paper_title}</span>

            <span className="mb-1 mt-2 block text-base font-semibold text-black">
              Authors
            </span>
            <span className="block">{paper_authors}</span>

            {paper_link && (
              <Link
                href={paper_link}
                target="_blank"
                className={cn(badgeVariants({ variant: "outline" }), "mt-3")}
              >
                Link <LinkIcon className="ms-1" width={14} />
              </Link>
            )}

            {intervention_description && (
              <>
                <span className="mt-3 block border-b text-xl font-semibold text-foreground">
                  Intervention(s)
                </span>
                {intervention_description.map((e, i) => (
                  <span key={e.paper + "-" + i} className="mt-3 block">
                    {e.intervention_description}
                  </span>
                ))}
              </>
            )}

            {outcome_description && (
              <>
                <span className="mt-3 block border-b text-xl font-semibold text-foreground">
                  Outcome(s)
                </span>
                {outcome_description.map((e, i) => (
                  <span key={e.paper + "-" + i} className="mt-3 block">
                    {e.outcome_description}
                  </span>
                ))}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
