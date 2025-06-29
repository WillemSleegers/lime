import { effectColumns } from "@/components/tables/columns-effects"
import { DataTable } from "@/components/tables/meta-analysis/data-table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

type EffectsProps = {
  data: any
}

export const Effects = (props: EffectsProps) => {
  const { data } = props

  const [open, setOpen] = useState(true)

  return (
    <Collapsible className="p-3" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger>
        <div className="m-1 flex flex-row items-center gap-1">
          <h2 className="text-2xl font-bold tracking-tight">Table</h2>
          <ChevronRight
            className={cn("transition", open ? "rotate-90" : "rotate-0")}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent my-3">
        <DataTable columns={effectColumns} data={data} />
      </CollapsibleContent>
    </Collapsible>
  )
}
