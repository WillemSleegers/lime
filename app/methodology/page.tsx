import fs from "fs"
import path from "path"
import Link from "next/link"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import type { Components } from "react-markdown"

import { ConditionStructures } from "@/components/condition-structures"

import counts from "@/assets/data/counts.json"

type Heading = { level: number; text: string; slug: string }

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function toText(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(toText).join("")
  return ""
}

/**
 * The first `# ` line is the page title, the `_..._` line below it the date,
 * and everything up to the first section heading is the intro. Section
 * headings start at `# ` again, so they are rendered one level down (h2-h5).
 */
function parseMethodology(content: string) {
  const lines = content.split("\n")
  const title = lines[0].replace(/^#\s+/, "").trim()

  const rest = lines.slice(1)
  const bodyStart = rest.findIndex((line) => /^#\s/.test(line))
  const intro = rest.slice(0, bodyStart).join("\n").trim()

  // The reference list is rendered separately, in a smaller font.
  const [main, referenceSection = ""] = rest
    .slice(bodyStart)
    .join("\n")
    .split(/^# References$/m)
  const body = main.trim()
  const references = referenceSection
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const dateMatch = /^_(.+)_$/m.exec(intro)
  const date = dateMatch ? dateMatch[1] : null
  const description = intro.replace(/^_.+_$/m, "").trim()

  const headings: Heading[] = []
  for (const line of body.split("\n")) {
    const match = /^(#{1,3})\s+(.+)$/.exec(line)
    if (match) {
      const text = match[2].trim()
      headings.push({ level: match[1].length, text, slug: slugify(text) })
    }
  }

  if (references.length > 0) {
    headings.push({ level: 1, text: "References", slug: "references" })
  }

  return { title, date, description, body, references, headings }
}

type MarkdownNode = {
  children?: { type?: string; tagName?: string }[]
}

const BLOCK_TAGS = ["database-counts", "condition-structures"]

// Screening totals from the project tracking sheet. The number of papers that
// have been screened is derived from the papers actually in the database, so
// the arithmetic in section 1.3 always adds up as the database grows.
const PAPERS_RETRIEVED = 1084
const PAPERS_EXCLUDED = 876
const PAPERS_SCREENED = PAPERS_EXCLUDED + counts.papers
const PAPERS_PENDING = PAPERS_RETRIEVED - PAPERS_SCREENED

function isBlockTag(node?: MarkdownNode) {
  const children = node?.children ?? []
  return (
    children.length === 1 &&
    children[0].type === "element" &&
    BLOCK_TAGS.includes(children[0].tagName ?? "")
  )
}

const components = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h2
      id={slugify(toText(children))}
      className="text-section-title mt-12 mb-4 scroll-mt-24 first:mt-0"
    >
      {children}
    </h2>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h3
      id={slugify(toText(children))}
      className="text-subsection-title mt-8 mb-3 scroll-mt-24"
    >
      {children}
    </h3>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h4
      id={slugify(toText(children))}
      className="text-feature-title mt-6 mb-2 scroll-mt-24"
    >
      {children}
    </h4>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h5 className="mt-5 mb-1 text-base font-semibold text-primary">{children}</h5>
  ),
  // The custom tags below render block-level elements, but markdown wraps a
  // line of raw HTML in a paragraph. Unwrap those to avoid nesting a <div>
  // inside a <p>, which is invalid HTML and breaks hydration.
  p: ({ node, children }: { node?: MarkdownNode; children?: React.ReactNode }) =>
    isBlockTag(node) ? (
      <>{children}</>
    ) : (
      <p className="text-description mt-4">{children}</p>
    ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="text-description mt-1 list-disc space-y-1 pl-6">{children}</ul>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (!href) return <span>{children}</span>
    if (href.startsWith("/")) {
      return (
        <Link href={href} className="font-medium text-primary hover:underline">
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary hover:underline"
      >
        {children}
      </a>
    )
  },
  "papers-screened": () => <>{PAPERS_SCREENED.toLocaleString("en-US")}</>,
  "papers-pending": () => <>{PAPERS_PENDING.toLocaleString("en-US")}</>,
  "database-counts": () => <DatabaseCounts />,
  "condition-structures": () => <ConditionStructures />,
} as unknown as Components

function DatabaseCounts() {
  const stats = [
    { label: "Papers", value: counts.papers },
    { label: "Studies", value: counts.studies },
    { label: "Effect sizes", value: counts.effects },
    { label: "Data points", value: counts.observations },
  ]

  return (
    <div className="my-6 grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-4 md:p-6">
      {stats.map((stat) => (
        <div key={stat.label} className="space-y-1 text-center">
          <p className="text-stat-number">{stat.value.toLocaleString("en-US")}</p>
          <p className="text-stat-label">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

const referenceComponents = {
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="pl-6 -indent-6">{children}</p>
  ),
} as unknown as Components

function References({ references }: { references: string[] }) {
  return (
    <section className="mt-12">
      <h2 id="references" className="text-section-title mb-4 scroll-mt-24">
        References
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {references.map((reference) => (
          <Markdown key={reference} components={referenceComponents}>
            {reference}
          </Markdown>
        ))}
      </div>
    </section>
  )
}

function TableOfContents({ headings }: { headings: Heading[] }) {
  return (
    <nav aria-label="On this page" className="space-y-2 text-sm">
      <p className="font-semibold">On this page</p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            className={
              heading.level === 1
                ? "pt-2 font-medium"
                : heading.level === 2
                  ? "pl-3"
                  : "pl-6 text-muted-foreground"
            }
          >
            <a href={`#${heading.slug}`} className="hover:text-primary">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const Methodology = () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), "app/methodology/methodology.md"),
    "utf-8"
  )
  const { title, date, description, body, references, headings } =
    parseMethodology(content)

  return (
    <main className="page-container mx-auto w-full max-w-6xl space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-page-title">{title}</h1>
        <p className="text-description-lg mx-auto max-w-2xl">{description}</p>
        {date && <p className="text-sm text-muted-foreground">{date}</p>}
      </div>

      <div className="gap-12 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="hidden lg:block">
          <div className="sticky top-8 max-h-[calc(100svh-4rem)] overflow-y-auto">
            <TableOfContents headings={headings} />
          </div>
        </div>
        <article className="max-w-3xl">
          <Markdown rehypePlugins={[rehypeRaw]} components={components}>
            {body}
          </Markdown>
          {references.length > 0 && <References references={references} />}
        </article>
      </div>
    </main>
  )
}

export default Methodology
