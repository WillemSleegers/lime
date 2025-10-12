import { useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

type CellBadgesProps = {
  value: string
}

export const CellBadges = ({ value }: CellBadgesProps) => {
  const [showMore, setShowMore] = useState(false)

  const content = value.split("; ")

  const badges = content.map((e, i) => {
    if (showMore) {
      return (
        <Badge
          key={e}
          className="text-sm font-normal whitespace-nowrap bg-muted text-foreground"
        >
          {e}
        </Badge>
      )
    } else {
      if (i < 3) {
        return (
          <Badge
            key={e}
            className="text-sm font-normal whitespace-nowrap bg-muted text-foreground"
          >
            {e}
          </Badge>
        )
      }
    }
  })
  return (
    <div>
      <div className={cn("flex gap-1", showMore ? "flex-wrap" : "flex-nowrap")}>
        {badges}{" "}
        {badges.length > 3 && (
          <Button
            onClick={() => setShowMore((prev) => !prev)}
            className="rounded-2xl h-[26px] w-auto px-2 bg-muted text-foreground outline outline-muted hover:bg-foreground/10"
            size="sm"
          >
            {showMore ? <MinusIcon size={14} /> : <PlusIcon size={14} />}
          </Button>
        )}
      </div>
    </div>
  )
}
