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
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const FilterCollapsible = (props: FilterCollapsibleProps) => {
  const { title, children, open: controlledOpen, onOpenChange } = props
  const [internalOpen, setInternalOpen] = useState(false)
  
  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <Collapsible
      className="rounded-2xl border bg-muted px-[2px] py-[5px]"
      open={open}
      onOpenChange={setOpen}
    >
      <CollapsibleTrigger className="ms-0.5 flex flex-row items-center gap-1 px-3 py-2 focus:rounded-2xl focus:outline-2 focus:outline-primary">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <ChevronRight
          className={cn("transition", open ? "rotate-90" : "rotate-0")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}
