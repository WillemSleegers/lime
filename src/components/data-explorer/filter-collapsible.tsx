import { ReactNode, useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type FilterCollapsibleProps = {
  title: string
  children: ReactNode
}

export const FilterCollapsible = (props: FilterCollapsibleProps) => {
  const { title, children } = props
  const [open, setOpen] = useState(false)

  return (
    <Collapsible
      className="rounded-2xl border bg-muted px-[2px] py-[5px]"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="flex flex-row items-center gap-1 px-3 py-2 focus:rounded focus:outline focus:outline-2 focus:outline-primary">
        <h2 className="font-semibold tracking-tight">{title}</h2>
        <ChevronRight
          className={cn("transition", open ? "rotate-90" : "rotate-0")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="CollapsibleContent">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
