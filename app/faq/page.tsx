import fs from "fs"
import path from "path"
import Link from "next/link"
import Markdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import type { Components } from "react-markdown"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  PrismaFlowChart,
  type PrismaData,
} from "@/components/prisma-flow-chart"

const prismaData: PrismaData = {
  identified_databases: null,
  identified_other: null,
  screened: null,
  excluded_screening: null,
  assessed: null,
  excluded_eligibility: null,
  excluded_eligibility_reasons: [],
  included: 104,
}

const markdownComponents: Components = {
  ul: ({ children }) => (
    <ul className="list-disc pl-6 space-y-1">{children}</ul>
  ),
  a: ({ href, children }) => {
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
}

function parseFaq(content: string) {
  const lines = content.split("\n")
  let title = ""
  const sections: { title: string; items: { question: string; answer: string }[] }[] = []
  let section: { title: string; items: { question: string; answer: string }[] } | null = null
  let question: string | null = null
  let answerLines: string[] = []

  const flushItem = () => {
    if (question !== null && section) {
      section.items.push({ question, answer: answerLines.join("\n").trim() })
    }
    question = null
    answerLines = []
  }

  const flushSection = () => {
    flushItem()
    if (section) sections.push(section)
    section = null
  }

  for (const line of lines) {
    if (line.startsWith("# ")) {
      title = line.slice(2).trim()
    } else if (line.startsWith("## ")) {
      flushSection()
      section = { title: line.slice(3).trim(), items: [] }
    } else if (line.startsWith("### ")) {
      flushItem()
      question = line.slice(4).trim()
    } else if (question !== null) {
      answerLines.push(line)
    }
  }
  flushSection()

  return { title, sections }
}

const FAQ = () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), "app/faq/faq.md"),
    "utf-8"
  )
  const { title, sections } = parseFaq(content)

  return (
    <main className="page-width page-container space-y-8">
      <h1 className="text-page-title text-center">{title}</h1>
      <div className="space-y-8">
        {sections.map((section, si) => (
          <div key={si} className="space-y-4">
            <h2 className="text-section-title">{section.title}</h2>
            <Accordion type="single" collapsible>
              {section.items.map((item, ii) => (
                <AccordionItem key={ii} value={`${si}-${ii}`}>
                  <AccordionTrigger className="text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 text-base">
                    <Markdown
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        ...markdownComponents,
                        "prisma-flow-chart": () => <PrismaFlowChart data={prismaData} />,
                      } as unknown as Components}
                    >
                      {item.answer}
                    </Markdown>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </main>
  )
}

export default FAQ
