"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

type Heading = { level: number; text: string; slug: string }

// A heading counts as "current" once it has scrolled past this distance from
// the top of the viewport (just below the sticky header and the scroll margin
// of the headings).
const OFFSET = 120

export function MethodologyToc({ headings }: { headings: Heading[] }) {
  const [activeSlug, setActiveSlug] = useState(headings[0]?.slug)

  // Track the last heading that has scrolled past the offset. At the very
  // bottom of the page, the last heading wins, so short final sections
  // (References) can still be reached.
  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2

      let current = headings[0]?.slug
      for (const heading of headings) {
        const element = document.getElementById(heading.slug)
        if (element && element.getBoundingClientRect().top <= OFFSET) {
          current = heading.slug
        }
      }
      setActiveSlug(atBottom ? headings[headings.length - 1]?.slug : current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [headings])

  return (
    <nav
      aria-label="On this page"
      className="space-y-3 text-sm text-muted-foreground"
    >
      <p className="font-semibold">On this page</p>
      <ul className="space-y-1.5 border-l pl-4">
        {headings.map((heading) => {
          const active = heading.slug === activeSlug
          return (
            <li
              key={heading.slug}
              className={
                heading.level === 1
                  ? "pt-3 font-medium first:pt-0"
                  : heading.level === 2
                    ? "leading-snug"
                    : "pl-3 text-[0.8125rem] leading-snug"
              }
            >
              <a
                href={`#${heading.slug}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "relative block hover:text-primary",
                  active &&
                    "font-medium text-foreground before:absolute before:inset-y-0 before:w-0.5 before:bg-primary",
                  active &&
                    (heading.level === 3
                      ? "before:-left-[29px]"
                      : "before:-left-[17px]")
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
