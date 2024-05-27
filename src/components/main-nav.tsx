import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex w-full flex-col items-center justify-between gap-3 lg:flex-row ",
        className,
      )}
      {...props}
    ></nav>
  )
}
