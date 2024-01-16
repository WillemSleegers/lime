import Link from "next/link"

import { cn } from "@/lib/utils"
import Image from "next/image"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-xl font-medium transition-colors hover:text-primary"
      >
        The Meata-Analysis Project
        <Image
          className="inline-block ms-2"
          alt="meata-analysis logo"
          src="/green-leaf-icon.svg"
          width={30}
          height={30}
        />
      </Link>
      <Link
        href="/about/"
        className="text-base font-normal text-muted-foreground transition-colors hover:text-primary"
      >
        About
      </Link>
      <Link
        href="/contributors/"
        className="text-base font-normal text-muted-foreground transition-colors hover:text-primary"
      >
        Contributors
      </Link>
      <Link
        href="/news/"
        className="text-base font-normal text-muted-foreground transition-colors hover:text-primary"
      >
        Changelog
      </Link>
    </nav>
  )
}
