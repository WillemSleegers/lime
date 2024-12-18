import papers from "@/assets/data/prepared-papers.json"
import { cn } from "@/lib/utils"

export const Bubbles = () => {
  return (
    <div className="flex flex-wrap items-center justify-center">
      {papers.map((paper) => {
        return (
          <div
            key={paper.paper}
            className={cn(
              paper.sample_n > 100 ? "h-40 w-40" : "h-20 w-20",

              "flex-0 m-1 content-center items-center justify-center overflow-hidden rounded-full bg-primary text-center align-middle transition-transform hover:scale-110",
            )}
          >
            {paper.paper_label}
          </div>
        )
      })}
    </div>
  )
}
