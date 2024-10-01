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

export default function Home() {
  return (
    <div className="space-y-24">
      <section className="m-auto my-12 max-w-3xl space-y-8 p-3 text-center">
        <Badge variant="destructive">Currently in beta</Badge>
        <h1 className="text-4xl font-bold leading-none text-gray-900 md:text-5xl lg:text-6xl">
          Library of Interventions for Meat Elimination
        </h1>
        <p className="text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl">
          A library of intervention studies to reduce the consumption of animal
          products.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/about/"
            className={buttonVariants({ variant: "outline" })}
          >
            Learn More
          </Link>
        </div>
      </section>
      <section className="my-12 bg-muted p-3">
        <div className="m-auto my-6 grid w-full grid-cols-1 gap-6 text-center sm:grid-cols-2 md:max-w-xl lg:max-w-4xl lg:grid-cols-4">
          <div>
            <div className="whitespace-nowrap text-2xl font-medium">Papers</div>
            <div className="text-5xl font-semibold text-primary">
              <Counter duration={1000} target={counts.papers} />
            </div>
          </div>
          <div className="text-left">
            <div className="font-regular text-left text-4xl tracking-tighter">
              <Counter duration={1250} target={counts.studies} />
            </div>
            <div className="whitespace-nowrap text-base tracking-tight text-muted-foreground">
              Studies
            </div>
          </div>
          <div>
            <div className="whitespace-nowrap text-2xl font-semibold">
              Effects
            </div>
            <div className="text-5xl font-semibold text-primary">
              <Counter duration={1500} target={counts.effects} />
            </div>
          </div>
          <div>
            <div className="whitespace-nowrap text-2xl font-semibold">
              Observations
            </div>
            <div className="text-5xl font-semibold text-primary">
              <Counter duration={1750} target={counts.observations} />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container grid max-w-5xl grid-cols-1 items-center gap-12 rounded-lg px-8 py-8 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="flex flex-col gap-4">
              <div>
                <Badge variant="outline">Feature</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter lg:text-5xl">
                  Data Explorer
                </h2>
                <p className="max-w-xl text-left text-lg leading-relaxed tracking-tight text-muted-foreground">
                  Explore a database of studies that tested interventions aimed
                  at reducing meat consumption and related outcomes.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:pl-6">
              <div className="flex flex-row items-start gap-3">
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Regularly updated</p>
                  <span className="text-sm text-muted-foreground">
                    Browse through a regularly updated library of papers.
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-start gap-3">
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Comprehensive</p>
                  <span className="text-sm text-muted-foreground">
                    Inspect many pieces of information about each paper.
                  </span>
                </div>
              </div>
              <div className="flex flex-row items-start gap-3">
                <Check className="mt-2 h-4 w-4 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Open</p>
                  <span className="text-sm text-muted-foreground">
                    The data is freely available for use in other projects.
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/about/"
              className={buttonVariants({ variant: "default" })}
            >
              Start exploring
            </Link>
          </div>
          <div className="m-auto aspect-square max-w-xl rounded-md bg-muted">
            <Image src={imageLibrary} alt="file cabinet" />
          </div>
        </div>
      </section>
      <section className="flex flex-wrap-reverse items-center justify-center gap-3">
        <div className="w-[500px] space-y-6">
          <h1 className="text-2xl font-semibold">Explore the database</h1>
          <p>
            A comprehensive database of studies that tested interventions aimed
            at reducing meat consumption and related outcomes.
          </p>
          <ul className="list-inside list-disc">
            <li>Regularly updated</li>
            <li>Openly accessible</li>
            <li>Lots of information per paper</li>
          </ul>
          <Link
            href="/about/"
            className={buttonVariants({ variant: "outline" })}
          >
            Learn More
          </Link>
        </div>
        <div className="w-80">
          <Image src={imageLibrary} alt="file cabinet" />
        </div>
      </section>
      <section>
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
