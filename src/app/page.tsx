import Link from "next/link"

import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Counter } from "@/components/counter"
import { Button } from "@/components/ui/button"
import { PaperCarousel } from "@/components/paper-carousel"

import counts from "@/assets/data/counts.json"

export default function Home() {
  return (
    <div className="space-y-14 md:space-y-28">
      {/* Hero */}
      <section className="md:mt-18 m-auto mt-3 max-w-2xl space-y-8 p-3 text-center md:mt-12 lg:mt-24">
        <Badge variant="destructive">Currently in beta</Badge>
        <h1 className="text-balance text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Library of Interventions for Meat Elimination
        </h1>
        <p className="mx-auto mt-5 max-w-screen-md text-center text-lg text-muted-foreground md:text-xl">
          A library of intervention studies to reduce the consumption of animal
          products.
        </p>
        <div className="grid grid-cols-2 gap-x-12 gap-y-6 md:grid-cols-4">
          <div className="space-y-2 text-right md:text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1000} target={counts.papers} />
            </h2>
            <p className="text-xl text-muted-foreground">Papers</p>
          </div>
          <div className="space-y-2 text-left md:text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1250} target={counts.studies} />
            </h2>
            <p className="text-xl text-muted-foreground">Studies</p>
          </div>
          <div className="space-y-2 text-right md:text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1500} target={counts.effects} />
            </h2>
            <p className="text-xl text-muted-foreground">Effects</p>
          </div>
          <div className="space-y-2 text-left md:text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              <Counter duration={1750} target={counts.observations} />
            </h2>
            <p className="text-xl text-muted-foreground">Observations</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section>
        <div className="mx-auto max-w-4xl p-6">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="text-primary">About </span>
            LIME
          </h2>

          <p className="text-lg text-muted-foreground">
            LIME is a continuously growing collection of experimental studies
            examining psychological interventions to reduce animal product
            consumption and improve attitudes towards animals. With LIME, you
            can explore individual studies, understand the current state of
            research, and evaluate which interventions have the strongest
            evidence behind them.
          </p>
          <Button className="mt-3 rounded-3xl" asChild variant="secondary">
            <Link href="/about/">Learn more</Link>
          </Button>
        </div>
      </section>

      {/* Data explorer */}
      <section className="text-center">
        <div className="mx-6">
          <h2 className="text-3xl font-bold md:text-4xl">
            <span className="text-primary">Explore</span> Studies
          </h2>
          <p className="mx-auto mb-8 mt-4 text-lg text-muted-foreground md:w-3/4">
            Browse our database of research papers testing interventions to
            reduce meat consumption. Filter, sort, and explore study details,
            methods, and outcomes.
          </p>
        </div>
        <PaperCarousel />
        <Button className="mt-6 rounded-3xl" asChild variant="secondary">
          <Link href="/data-explorer/">Begin exploring</Link>
        </Button>
      </section>

      {/* Meta-analysis */}
      <section className="mx-6 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          <span className="text-primary">Analyze</span> Data
        </h2>
        <p className="mx-auto mb-8 mt-4 text-lg text-muted-foreground md:w-3/4">
          Use our analysis tools to aggregate study results and find out how
          strong the evidence is.
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="mx-auto max-w-80">
            <h3 className="whitespace-nowrap text-xl font-semibold leading-none tracking-tight">
              Summary statistics
            </h3>
            <p className="text-muted-foreground">
              Get statistics on selected papers such as sample sizes and open
              science practices.
            </p>
          </div>
          <div className="mx-auto max-w-80">
            <h3 className="whitespace-nowrap text-xl font-semibold leading-none tracking-tight">
              Meta-analysis
            </h3>
            <p className="text-muted-foreground">
              Calculate meta-analytic effect sizes and see them translated into
              intuitive measures of effectiveness.
            </p>
          </div>
          <div className="mx-auto max-w-80">
            <h3 className="whitespace-nowrap text-xl font-semibold leading-none tracking-tight">
              Data visualization
            </h3>
            <p className="text-muted-foreground">
              Inspect interactive data visualizations showing effect size
              distributions and more.
            </p>
          </div>
        </div>

        <Button className="mt-6 rounded-3xl" variant="secondary" asChild>
          <Link href="/data-explorer/">Begin analyzing</Link>
        </Button>
      </section>

      <Footer />
    </div>
  )
}
