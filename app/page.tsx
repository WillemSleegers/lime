import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Counter } from "@/components/counter"
import { Button } from "@/components/ui/button"
import { PaperCarousel } from "@/components/paper-carousel"

import counts from "@/assets/data/counts.json"

export default function Home() {
  return (
    <div className="mt-8 mb-16 md:mb-24 space-y-16 md:mt-24 md:space-y-20 lg:mt-32">
      {/* Hero */}
      <section className="mx-auto max-w-4xl space-y-10 p-4 text-center md:space-y-12">
        <Badge variant="destructive">Currently in beta</Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Library of Interventions for Meat Elimination
          </h1>
          <p className="text-muted-foreground mx-auto text-center text-lg md:text-xl leading-relaxed">
            A library of intervention studies to reduce the consumption of
            animal products.
          </p>
        </div>
        <div className="mx-auto flex max-w-xs flex-wrap justify-center gap-6 text-center sm:max-w-lg sm:justify-between">
          <div className="flex flex-col gap-y-2">
            <span className="w-20 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1000} target={counts.papers} />
            </span>
            <span className="text-muted-foreground text-lg md:text-xl">
              Papers
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="w-25 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1250} target={counts.studies} />
            </span>
            <span className="text-muted-foreground text-lg md:text-xl">
              Studies
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="w-30 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1500} target={counts.effects} />
            </span>
            <span className="text-muted-foreground text-lg md:text-xl">
              Effects
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="w-35 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1750} target={counts.observations} />
            </span>
            <span className="text-muted-foreground text-lg md:text-xl">
              Observations
            </span>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-4xl p-4 space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="text-primary">About </span>
            LIME
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            LIME is a continuously growing collection of experimental studies
            examining psychological interventions to reduce animal product
            consumption and improve attitudes towards animals. With LIME, you
            can explore individual studies, understand the current state of
            research, and evaluate which interventions have the strongest
            evidence behind them.
          </p>
        </div>
        <Button className="rounded-lg" asChild>
          <Link href="/about/">Learn more</Link>
        </Button>
      </section>

      {/* Data explorer */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="p-4 space-y-4">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="text-primary">Explore</span> Studies
          </h2>
          <p className="text-muted-foreground mx-auto text-lg">
            Browse our database of research papers testing interventions to
            reduce meat consumption. Filter, sort, and explore study details,
            methods, and outcomes.
          </p>
        </div>
        <PaperCarousel />
        <Button className="rounded-lg" asChild>
          <Link href="/data-explorer/">Begin exploring</Link>
        </Button>
      </section>

      {/* Meta-analysis */}
      <section className="mx-auto max-w-4xl p-4 text-center space-y-6">
        <h2 className="text-3xl font-bold md:text-4xl">
          <span className="text-primary">Analyze</span> Data
        </h2>
        <p className="text-muted-foreground mx-auto text-lg">
          Use our analysis tools to aggregate study results and find out how
          strong the evidence is.
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto max-w-80 space-y-2">
            <h3 className="text-xl leading-none font-semibold tracking-tight">
              Summary statistics
            </h3>
            <p className="text-muted-foreground text-base">
              Get statistics on selected papers such as sample sizes and open
              science practices.
            </p>
          </div>
          <div className="mx-auto max-w-80 space-y-2">
            <h3 className="text-xl leading-none font-semibold tracking-tight">
              Meta-analysis
            </h3>
            <p className="text-muted-foreground text-base">
              Calculate meta-analytic effect sizes and see them translated into
              several alternatives to help you better understand the
              effectiveness of interventions.
            </p>
          </div>
          <div className="mx-auto max-w-80 space-y-2">
            <h3 className="text-xl leading-none font-semibold tracking-tight">
              Data visualization
            </h3>
            <p className="text-muted-foreground text-base">
              Inspect data visualizations of effect sizes and other descriptives
              about intervention studies included in the database.
            </p>
          </div>
        </div>

        <Button className="rounded-lg" asChild>
          <Link href="/meta-analysis/">Run a meta-analysis</Link>
        </Button>
      </section>
    </div>
  )
}
