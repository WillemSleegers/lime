import papers from "@/assets/data/papers.json"
import { cn } from "@/lib/utils"

export const Bubbles = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="grid gap-4">
        {papers
          .filter((paper) => Math.round(Math.random()))
          .map((paper) => {
            let width = "w-10"
            let height = "h-10"
            const size = Math.random() * 100
            if (size) {
              if (size > 75) {
                width = "w-44"
                height = "h-44"
              } else if (size > 50) {
                width = "w-40"
                height = "h-40"
              } else if (size > 25) {
                width = "w-36"
                height = "h-36"
              } else {
                width = "w-32"
                height = "h-32"
              }
            }

            return (
              <div key={paper.paper} className={cn(height, "bg-primary")}>
                <div className="h-auto max-w-full bg-primary">
                  {paper.paper_label}
                </div>
              </div>
            )
          })}
      </div>
      <div className="grid gap-4">
        {papers
          .filter((paper) => Math.round(Math.random()))
          .map((paper) => {
            let width = "w-10"
            let height = "h-10"
            const size = Math.random() * 100
            if (size) {
              if (size > 75) {
                width = "w-44"
                height = "h-44"
              } else if (size > 50) {
                width = "w-40"
                height = "h-40"
              } else if (size > 25) {
                width = "w-36"
                height = "h-36"
              } else {
                width = "w-32"
                height = "h-32"
              }
            }

            return (
              <div key={paper.paper} className={cn(height, "bg-primary")}>
                <div className="h-auto max-w-full bg-primary">
                  {paper.paper_label}
                </div>
              </div>
            )
          })}
      </div>
      <div className="grid gap-4">
        {papers
          .filter((paper) => Math.round(Math.random()))
          .map((paper) => {
            let width = "w-10"
            let height = "h-10"
            const size = Math.random() * 100
            if (size) {
              if (size > 75) {
                width = "w-44"
                height = "h-44"
              } else if (size > 50) {
                width = "w-40"
                height = "h-40"
              } else if (size > 25) {
                width = "w-36"
                height = "h-36"
              } else {
                width = "w-32"
                height = "h-32"
              }
            }

            return (
              <div key={paper.paper} className={cn(height, "bg-primary")}>
                <div className="h-auto max-w-full bg-primary">
                  {paper.paper_label}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
