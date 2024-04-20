import Link from "next/link"

import { cn } from "@/lib/utils"
import Image from "next/image"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-3 ",
        className,
      )}
      {...props}
    >
      <Link
        href="/"
        className="whitespace-nowrap text-xl font-medium transition-colors hover:text-primary"
      >
        The Meata-Analysis Project
        <Image
          className="ms-2 inline-block"
          alt="meata-analysis logo"
          src="/green-leaf-icon.svg"
          width={30}
          height={30}
        />
      </Link>
      <div className="space-x-4 lg:space-x-6">
        <Link
          href="/about/"
          className="text-base font-medium transition-colors hover:text-primary"
        >
          About
        </Link>
        <Link
          href="/meta-analysis/"
          className="rounded bg-green-700 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-green-800"
        >
          Meta-analysis
        </Link>
        <Link
          href="/data/"
          className="text-base font-medium transition-colors hover:text-primary"
        >
          Data
        </Link>
        <Link
          href="/contributors/"
          className="text-base font-medium transition-colors hover:text-primary"
        >
          Contributors
        </Link>

        <Link
          href="/changelog/"
          className="text-base font-medium transition-colors hover:text-primary"
        >
          Changelog
        </Link>
      </div>
    </nav>
  )
}
