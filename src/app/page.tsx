import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

import data from "../assets/data/prepared-effects.json"

export default function Home() {
  const effects = data.length
  const papers = [...new Set(data.map((column) => column["paper"]))].length

  return (
    <main>
      <section className="p-3">
        <div className="py-12 text-center lg:py-16">
          <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            The Meata-Analysis Project
          </h1>
          <p className="text-lg font-normal text-gray-500 lg:text-xl">
            A live meta-analysis of intervention studies to reduce animal
            product consumption and improve animal attitudes.
          </p>
          <div className="my-8 flex flex-row justify-center gap-4 md:gap-6 lg:gap-8">
            <Link
              href="/about/"
              className={cn(buttonVariants({ variant: "outline" }), "rounded")}
            >
              Learn More
            </Link>
            <Link
              href="/meta-analysis"
              className={cn(
                buttonVariants(),
                "bg-green-700 hover:bg-green-800",
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
      <section className="p-3">
        <div className="flex flex-wrap justify-center gap-12 bg-gray-100 p-6">
          <div>
            <div className="text-xl font-semibold">Number of papers</div>
            <div className="text-xl text-gray-500">{papers}</div>
          </div>
          <div>
            <div className="text-xl font-semibold">Number of effects</div>
            <div className="text-xl text-gray-500">{effects}</div>
          </div>
        </div>
      </section>
    </main>
  )
}
