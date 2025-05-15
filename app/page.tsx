import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Counter } from "@/components/counter"
import { Button } from "@/components/ui/button"
import { PaperCarousel } from "@/components/paper-carousel"

import counts from "@/assets/data/counts.json"

export default function Home() {
  return (
    <div className="mt-6 mb-12 md:mb-18 space-y-12 md:mt-18 md:space-y-24 lg:mt-24">
      {/* Hero */}
      <section className="mx-auto max-w-xl space-y-8 p-4 text-center sm:max-w-2xl md:space-y-12">
        <Badge variant="destructive">Currently in beta</Badge>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Library of Interventions for Meat Elimination
          </h1>
          <p className="text-muted-foreground mx-auto text-center text-lg md:text-xl">
            A library of intervention studies to reduce the consumption of
            animal products.
          </p>
        </div>
        <div className="mx-auto flex max-w-xs flex-wrap justify-center gap-6 text-center sm:max-w-lg sm:justify-between">
          <div className="flex flex-col gap-y-2">
            <span className="w-20 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1000} target={counts.papers} />
            </span>
            <span className="text-muted-foreground text-base sm:text-lg md:text-xl">
              Papers
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="w-25 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1250} target={counts.studies} />
            </span>
            <span className="text-muted-foreground text-base sm:text-lg md:text-xl">
              Studies
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="w-30 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1500} target={counts.effects} />
            </span>
            <span className="text-muted-foreground text-base sm:text-lg md:text-xl">
              Effects
            </span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="w-35 text-2xl font-bold sm:text-3xl md:text-4xl">
              <Counter duration={1750} target={counts.observations} />
            </span>
            <span className="text-muted-foreground text-base sm:text-lg md:text-xl">
              Observations
            </span>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-4xl p-4 space-y-2 sm:space-y-3 md:space-y-4">
        <h2 className="text-3xl font-bold md:text-4xl">
          <span className="text-primary">About </span>
          LIME
        </h2>

        <p className="text-muted-foreground text-base md:text-lg">
          LIME is a continuously growing collection of experimental studies
          examining psychological interventions to reduce animal product
          consumption and improve attitudes towards animals. With LIME, you can
          explore individual studies, understand the current state of research,
          and evaluate which interventions have the strongest evidence behind
          them.
        </p>
        <Button className="rounded-3xl" asChild variant="secondary">
          <Link href="/about/">Learn more</Link>
        </Button>
      </section>

      {/* Data explorer */}
      <section className="text-center max-w-6xl mx-auto space-y-2 sm:space-y-3 md:space-y-4">
        <div className="px-4 space-y-2 sm:space-y-3 md:space-y-4">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="text-primary">Explore</span> Studies
          </h2>
          <p className="text-muted-foreground mx-auto text-base md:w-3/4 md:text-lg">
            Browse our database of research papers testing interventions to
            reduce meat consumption. Filter, sort, and explore study details,
            methods, and outcomes.
          </p>
        </div>
        <PaperCarousel />
        <Button className="rounded-3xl" asChild variant="secondary">
          <Link href="/data-explorer/">Begin exploring</Link>
        </Button>
      </section>

      {/* Meta-analysis */}
      <section className="p-4 text-center space-y-2 sm:space-y-3 md:space-y-4">
        <h2 className="text-3xl font-bold md:text-4xl">
          <span className="text-primary">Analyze</span> Data
        </h2>
        <p className="text-muted-foreground mx-auto text-base md:w-3/4 md:text-lg">
          Use our analysis tools to aggregate study results and find out how
          strong the evidence is.
        </p>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto max-w-80">
            <h3 className="text-xl leading-none font-semibold tracking-tight whitespace-nowrap">
              Summary statistics
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Get statistics on selected papers such as sample sizes and open
              science practices.
            </p>
          </div>
          <div className="mx-auto max-w-80">
            <h3 className="text-xl leading-none font-semibold tracking-tight whitespace-nowrap">
              Meta-analysis
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Calculate meta-analytic effect sizes and see them translated into
              intuitive measures of effectiveness.
            </p>
          </div>
          <div className="mx-auto max-w-80">
            <h3 className="text-xl leading-none font-semibold tracking-tight whitespace-nowrap">
              Data visualization
            </h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Inspect interactive data visualizations showing effect size
              distributions and more.
            </p>
          </div>
        </div>

        <Button className="mt-6 rounded-3xl" variant="secondary" asChild>
          <Link href="/data-explorer/">Begin analyzing</Link>
        </Button>
      </section>
    </div>
  )
}
