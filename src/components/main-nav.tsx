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
      <div>
        <Link
          href="/"
          className="whitespace-nowrap text-xl font-medium transition-colors hover:text-primary"
        >
          The Meata-Analysis Project
          <Image
            className="ms-2 hidden sm:inline-block"
            alt="meata-analysis logo"
            src="/green-leaf-icon.svg"
            width={30}
            height={30}
          />
        </Link>
        <span className="ml-3 whitespace-nowrap rounded bg-red-700 px-3 py-2 text-base font-medium text-white">
          Beta
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/about/"
          className="text-base font-medium transition-colors hover:text-primary"
        >
          About
        </Link>
        <Link
          href="/meta-analysis/"
          className="whitespace-nowrap rounded bg-green-700 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-green-800"
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
          href="/FAQ/"
          className="text-base font-medium transition-colors hover:text-primary"
        >
          FAQ
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
