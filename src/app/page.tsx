import Link from "next/link"
import Image from "next/image"

import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Counter } from "@/components/counter"
import { Button } from "@/components/ui/button"
import { PaperCarousel } from "@/components/paper-carousel"

import counts from "@/assets/data/counts.json"
import imageLibrary from "@/assets/images/library.png"

export default function Home() {
  return (
    <div className="space-y-28">
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
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

      {/* Image */}
      <section>
        <div className="m-auto aspect-square max-w-80">
          <Image src={imageLibrary} alt="file cabinet" />
        </div>
      </section>

      {/* About */}
      <section>
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col-reverse gap-8 px-6 md:flex-row md:gap-12">
            <div className="bg-green-0 flex flex-col justify-between">
              <div className="pb-6">
                <h2 className="text-3xl font-bold md:text-4xl">
                  <span className="text-primary">About </span>
                  LIME
                </h2>
                <p className="text-lg text-muted-foreground">
                  LIME is a continuously growing collection of experimental
                  studies that tested the effectiveness of a psychological
                  intervention on reducing animal product consumption, improving
                  attitudes towards animals, or changing related outcomes.
                </p>
                <Button
                  className="mt-3 rounded-3xl"
                  asChild
                  variant="secondary"
                >
                  <Link href="/about/">Learn more</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data explorer */}
      <section className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          <span className="text-primary">Explore</span> Studies
        </h2>
        <p className="mx-auto mb-8 mt-4 text-xl text-muted-foreground md:w-3/4">
          Explore a database of studies that tested interventions aimed at
          reducing meat consumption and related outcomes.
        </p>
        <PaperCarousel />
        <Button className="mt-6 rounded-3xl" asChild>
          <Link href="/data-explorer/">Begin exploring</Link>
        </Button>
      </section>

      {/* Meta-analysis */}
      <section className="text-center">
        <h2 className="text-3xl font-bold md:text-4xl">
          <span className="text-primary">Analyze</span> Data
        </h2>
        <p className="mx-auto mb-8 mt-4 text-xl text-muted-foreground md:w-3/4">
          Use our analysis tools to aggregate study results and find out how
          strong the evidence is.
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-3 text-card-foreground">
            <h3 className="whitespace-nowrap py-3 text-2xl font-semibold leading-none tracking-tight">
              Meta-analysis
            </h3>
            <div>
              Use meta-analytic techniques to aggregate data from multiple
              studies.
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Customization
              </h3>
            </div>
            <div className="p-6 pt-0">
              Use filters to select studies of interest based on a wide variety
              of attributes.
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Visualization
              </h3>
            </div>
            <div className="p-6 pt-0">
              Use our data visualization tools to get a better grasp of the
              results.
            </div>
          </div>
        </div>

        <Button className="mt-6 rounded-3xl" asChild>
          <Link href="/data-explorer/">Begin analyzing</Link>
        </Button>
      </section>

      {/* Sponsors */}
      <section id="sponsors" className="container pt-24 sm:py-32">
        <h2 className="text-md mb-8 text-center font-bold text-primary lg:text-xl">
          Sponsors
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-1 text-muted-foreground/60">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-radar"
              >
                <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"></path>
                <path d="M4 6h.01"></path>
                <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"></path>
                <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"></path>
                <path d="M12 18h.01"></path>
                <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"></path>
                <circle cx="12" cy="12" r="2"></circle>
                <path d="m13.41 10.59 5.66-5.66"></path>
              </svg>
            </span>
            <h3 className="text-xl font-bold">Sponsor 1</h3>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground/60">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-radar"
              >
                <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"></path>
                <path d="M4 6h.01"></path>
                <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"></path>
                <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"></path>
                <path d="M12 18h.01"></path>
                <path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"></path>
                <circle cx="12" cy="12" r="2"></circle>
                <path d="m13.41 10.59 5.66-5.66"></path>
              </svg>
            </span>
            <h3 className="text-xl font-bold">Sponsor 2</h3>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
