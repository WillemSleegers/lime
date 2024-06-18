"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Lime } from "./lime"

export function MainNav() {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`flex flex-col items-stretch justify-between gap-3 border-b p-3 sm:flex-row sm:items-center`}
    >
      <div className="flex justify-between">
        <div className="flex flex-row gap-3 p-1">
          <Link href="/" className="text-xl font-semibold leading-normal">
            LIME
          </Link>
          <Lime />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="flex sm:hidden"
          onClick={() => setOpen(!open)}
        >
          <Menu />
          <span className="sr-only">Toggle</span>
        </Button>
      </div>

      <nav
        className={`m-auto gap-3 sm:m-0 sm:flex ${open ? "flex" : "hidden"}`}
      >
        <Link
          className="font-normal text-gray-500 hover:text-gray-800"
          href="/about"
        >
          About
        </Link>
        <Link
          className="font-normal text-gray-500 hover:text-gray-800"
          href="/data"
        >
          Data
        </Link>
        <Link
          className="whitespace-nowrap font-normal text-gray-500 hover:text-gray-800"
          href="/meta-analysis"
        >
          Meta-analysis
        </Link>
        <Link
          className="font-normal text-gray-500 hover:text-gray-800"
          href="/FAQ"
        >
          FAQ
        </Link>
        <Link
          className="font-normal text-gray-500 hover:text-gray-800"
          href="/contact"
        >
          Contact
        </Link>
        <Link
          className="font-normal text-gray-500 hover:text-gray-800"
          href="/contributors"
        >
          Contributors
        </Link>
      </nav>
    </div>
  )
}
