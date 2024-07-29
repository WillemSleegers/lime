"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Lime } from "./lime"

const items = [
  {
    title: "About",
    href: "/about/",
  },
  {
    title: "Databank",
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
      className={`flex flex-col items-stretch justify-between gap-3 border-b p-3 md:flex-row md:items-center`}
    >
      <div className="flex justify-between">
        <div className="flex flex-row items-center gap-3 p-1">
          <Link href="/" className="text-2xl font-semibold leading-normal">
            LIME
          </Link>
          <Lime />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="flex md:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu />
          <span className="sr-only">Toggle</span>
        </Button>
      </div>

      <nav className={`m-auto md:m-0 md:flex ${open ? "flex" : "hidden"}`}>
        {items.map((e) => (
          <Link
            className="rounded-lg px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 hover:text-black"
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
