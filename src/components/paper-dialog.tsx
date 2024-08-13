import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import papers from "@/assets/data/papers.json"
import Link from "next/link"
import { badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LinkIcon } from "lucide-react"

type PaperDialogProps = {
  trigger: string
  title: string
}

export const PaperDialog = ({ trigger, title }: PaperDialogProps) => {
  const paper_title = papers.find(
    (paper) => paper.paper_label == title,
  )?.paper_title

  const paper_authors = papers.find(
    (paper) => paper.paper_label == title,
  )?.paper_authors

  const paper_source = papers.find(
    (paper) => paper.paper_label == title,
  )?.paper_source

  const paper_link = papers.find(
    (paper) => paper.paper_label == title,
  )?.paper_link

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <span className="underline-offset-2 hover:underline">{trigger}</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
