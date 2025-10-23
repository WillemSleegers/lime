"use client"

import { useState } from "react"
import Link from "next/link"

import { Lime } from "@/components/icons/lime"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const items = [
  {
    title: "About",
    href: "/about/",
  },
  {
    title: "Data explorer",
    href: "/data-explorer/",
  },
  {
    title: "Meta-analysis",
    href: "/meta-analysis/",
  },
  {
    title: "FAQ",
    href: "/FAQ/",
  },
  {
    title: "Contributors",
    href: "/contributors/",
  },
  {
    title: "Contact",
    href: "/contact/",
  },
]

export function MainNav() {
  const [open, setOpen] = useState(false)

  return (
    <div className="mx-auto w-full flex max-w-6xl flex-col items-stretch justify-center gap-6 p-3 md:flex-row md:items-center">
      <div className=" flex h-10 items-center justify-between">
        <Link
          href="/"
          className="flex flex-row items-center gap-3 text-2xl leading-normal font-semibold"
        >
          <Lime />
          LIME
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            className="flex"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(!open)}
          >
          <div className="flex flex-col items-center justify-center">
            <span
              className={`bg-foreground block h-0.5 w-5 rounded-sm transition-all duration-300 ease-out ${
                open ? "translate-y-1 rotate-45" : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`bg-foreground my-0.5 block h-0.5 w-5 rounded-sm transition-all duration-300 ease-out ${
                open ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`bg-foreground block h-0.5 w-5 rounded-sm transition-all duration-300 ease-out ${
                open ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
              }`}
            ></span>
            <span className="sr-only">Toggle</span>
          </div>
        </Button>
        </div>
      </div>

      <nav
        className={`flex-wrap justify-center gap-4 space-x-1 md:flex ${
          open ? "flex" : "hidden"
        }`}
      >
        {items.map((e) => (
          <Link
            className="text-muted-foreground hover:text-foreground transition-colors"
            href={e.href}
            key={e.title}
          >
            {e.title}
          </Link>
        ))}
      </nav>

      <div className="ml-auto hidden md:block">
        <ThemeToggle />
      </div>
    </div>
  )
}
