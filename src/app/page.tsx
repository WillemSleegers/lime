import { cn } from "@/lib/utils"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import fileCabinet from "../assets/images/file-cabinet.jpg"
import boxplots from "../assets/images/boxplots.jpg"
import { Counter } from "@/components/counter"

import data from "../assets/data/prepared-effects.json"

export default function Home() {
  const effects = data.length
  const papers = [...new Set(data.map((column) => column["paper"]))].length

  return (
    <main className="pb-16">
      <section className="p-3">
        <div className="py-12 text-center lg:py-16">
          <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Library of Interventions for Meat Elimination
          </h1>
          <p className="text-lg font-normal text-gray-500 lg:text-xl">
            A library of social psychological intervention studies to reduce the
            consumption of animal products.
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
      <section className="py-3">
        <div className="flex flex-wrap justify-center gap-12 bg-gray-100 p-6">
          <div>
            <div className="text-xl font-semibold">Number of papers</div>
            <div className="text-xl text-gray-500">
              <Counter initialValue={0} targetValue={papers} />
            </div>
          </div>
          <div>
            <div className="text-xl font-semibold">Number of effects</div>
            <div className="text-xl text-gray-500">
              <Counter initialValue={0} targetValue={effects} />
            </div>
          </div>
        </div>
      </section>
      <section className="my-6 flex flex-wrap-reverse items-center justify-center gap-3">
        <div className="w-[500px] p-6">
          <h1 className="text-xl font-semibold">Explore the database</h1>
          <p>
            A comprehensive database of studies that tested interventions aimed
            at reducing meat consumption and related outcomes.
          </p>
          <ul className="list-inside list-disc">
            <li>Regularly updated</li>
            <li>
              Studies are coded on many dimensions (e.g., intervention type)
            </li>
            <li>Openly accessible</li>
          </ul>
          <Link
            href="/about/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-3 rounded bg-green-700 hover:bg-green-800",
            )}
          >
            Learn More
          </Link>
        </div>
        <div className="w-80 bg-green-500">
          <Image src={fileCabinet} alt="file cabinet" />
        </div>
      </section>
      <section className="my-6 flex flex-wrap-reverse items-center justify-center gap-3 bg-gray-100">
        <div className="w-80 bg-green-500">
          <Image src={boxplots} alt="boxplots" />
        </div>
        <div className="w-[500px] p-6">
          <h1 className="text-xl font-semibold">Analyze the literature</h1>
          <p>
            The analysis tool enables users to explore, analyze, and visualize
            study results.
          </p>
          <ul className="list-inside list-disc">
            <li>Meta-analytic estimates of intervention effectiveness</li>
            <li>Customizable: focus on specific interventions or outcomes</li>
            <li>Explore trends in the literature</li>
          </ul>
          <Link
            href="/about/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "mt-3 rounded bg-green-700 hover:bg-green-800",
            )}
          >
            Learn More
          </Link>
        </div>
      </section>
    </main>
  )
}
