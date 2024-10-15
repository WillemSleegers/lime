import Link from "next/link"
import Image from "next/image"
import { Check } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { Counter } from "@/components/counter"

import imageLibrary from "@/assets/images/library.png"
import imagePlot from "@/assets/images/forest-plot.png"

import counts from "@/assets/data/counts.json"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/footer"
import { PaperCarousel } from "@/components/paper-carousel"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="space-y-40">
      {/* Hero */}
      <section className="prose m-auto mt-24 max-w-3xl space-y-8 p-3 text-center">
        <Badge variant="destructive">Currently in beta</Badge>
        <h1 className="text-4xl font-bold leading-none md:text-5xl lg:text-6xl">
          Library of Interventions for Meat Elimination
        </h1>
        <p className="text-lg md:text-xl">
          A library of intervention studies to reduce the consumption of animal
          products.
        </p>
        <Link
          href="/about/"
          className={cn(
            buttonVariants({ variant: "default" }),
            "not-prose border-none",
          )}
        >
          Learn More
        </Link>
      </section>
      {/* Statistics */}
      <section className="bg-muted py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1000} target={counts.papers} />
            </h2>
            <p className="text-xl text-muted-foreground">Papers</p>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1250} target={counts.studies} />
            </h2>
            <p className="text-xl text-muted-foreground">Studies</p>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1500} target={counts.effects} />
            </h2>
            <p className="text-xl text-muted-foreground">Effects</p>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1750} target={counts.observations} />
            </h2>
            <p className="text-xl text-muted-foreground">Observations</p>
          </div>
        </div>
      </section>
      {/* Data explorer tool */}
      <section className="prose mx-auto grid max-w-4xl gap-12 p-3 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="my-0 text-3xl md:text-4xl lg:text-5xl">
            Data Explorer
          </h2>
          <p className="max-w-xl text-left text-lg text-muted-foreground">
            Explore a database of studies that tested interventions aimed at
            reducing meat consumption and related outcomes.
          </p>
          <div>
            <div className="flex flex-row items-start gap-3">
              <Check className="mt-2 h-4 w-4 stroke-[4px] text-primary" />
              <div className="flex flex-col gap-1">
                <span>Regularly updated</span>
                <span className="text-sm text-muted-foreground">
                  Browse through a regularly updated library of papers.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-start gap-3">
              <Check className="mt-2 h-4 w-4 stroke-[4px] text-primary" />
              <div className="flex flex-col gap-1">
                <span>Comprehensive</span>
                <span className="text-sm text-muted-foreground">
                  Inspect many pieces of information about each paper.
                </span>
              </div>
            </div>
            <div className="flex flex-row items-start gap-3">
              <Check className="mt-2 h-4 w-4 stroke-[4px] text-primary" />
              <div className="flex flex-col gap-1">
                <span>Open</span>
                <span className="text-sm text-muted-foreground">
                  The data is freely available for use in other projects.
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/about/"
            className={cn(buttonVariants({ variant: "default" }), "not-prose")}
          >
            Start exploring
          </Link>
        </div>
        <div className="m-auto aspect-square max-w-sm rounded-md bg-muted">
          <Image src={imageLibrary} alt="file cabinet" />
        </div>
      </section>
      {/* Paper carousel */}
      <section className="space-y-12">
        <div className="max-4-xl prose mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl">
            Browse through and analyze dozens of papers
          </h2>
        </div>
        <PaperCarousel />
      </section>

      <section className="my-12 flex flex-wrap-reverse items-center justify-center gap-6 py-12">
        <div className="w-80">
          <Image src={imagePlot} alt="boxplots" />
        </div>
        <div className="w-[500px] space-y-6">
          <h1 className="text-2xl font-semibold">Analyze the literature</h1>
          <p>
            The analysis tool enables users to explore, analyze, and visualize
            study results.
          </p>
          <ul className="ms-4 list-outside list-disc">
            <li>Meta-analytic estimates of intervention effectiveness</li>
            <li>Customizable: focus on specific interventions or outcomes</li>
            <li>Explore trends in the literature</li>
          </ul>
          <Link
            href="/about/"
            className={buttonVariants({ variant: "outline" })}
          >
            Learn More
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
