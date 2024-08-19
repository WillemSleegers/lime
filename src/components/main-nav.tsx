"use client"

import * as React from "react"
import Link from "next/link"

import { Button, buttonVariants } from "./ui/button"
import { useState } from "react"
import { Lime } from "./lime"
import { cn } from "@/lib/utils"

const items = [
  {
    title: "About",
    href: "/about/",
  },
  {
    title: "Data Explorer",
    href: "/data/",
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
    <div
      className={`flex flex-col items-stretch justify-between gap-3 p-3 align-middle md:flex-row md:items-center`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-row items-center gap-3 p-1">
          <Link href="/" className="text-2xl font-semibold leading-normal">
            LIME
          </Link>
          <Lime />
        </div>

        <Button
          className="flex md:hidden"
          variant="ghost"
          size="sm"
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-col items-center justify-center">
            <span
              className={`block h-0.5 w-5 rounded-sm bg-foreground transition-all duration-300 ease-out ${
                open ? "translate-y-1 rotate-45" : "-translate-y-0.5"
              }`}
            ></span>
            <span
              className={`my-0.5 block h-0.5 w-5 rounded-sm bg-foreground transition-all duration-300 ease-out ${
                open ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block h-0.5 w-5 rounded-sm bg-foreground transition-all duration-300 ease-out ${
                open ? "-translate-y-1 -rotate-45" : "translate-y-0.5"
              }`}
            ></span>
            <span className="sr-only">Toggle</span>
          </div>
        </Button>
      </div>

      <nav
        className={`m-auto flex-wrap justify-center md:m-0 md:flex ${open ? "flex" : "hidden"}`}
      >
        {items.map((e) => (
          <Link
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "whitespace-nowrap text-base",
            )}
            href={e.href}
            key={e.title}
          >
            {e.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
