import Link from "next/link"
import Image from "next/image"

import { buttonVariants } from "@/components/ui/button"
import { Counter } from "@/components/counter"

import imageLibrary from "@/assets/images/library.png"
import imagePlot from "@/assets/images/forest-plot.png"

import counts from "@/assets/data/counts.json"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div>
      <section className="m-auto my-12 max-w-3xl space-y-8 p-3 text-center">
        <Badge variant="destructive">Currently in beta</Badge>
        <h1 className="text-4xl font-bold leading-none text-gray-900 md:text-5xl lg:text-6xl">
          Library of Interventions for Meat Elimination
        </h1>
        <p className="text-lg font-normal text-muted-foreground lg:text-xl">
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
            <div className="whitespace-nowrap text-xl font-semibold">
              Number of papers
            </div>
            <div className="text-4xl font-semibold text-primary">
              <Counter duration={1000} target={counts.papers} />
            </div>
          </div>
          <div>
            <div className="whitespace-nowrap text-xl font-semibold">
              Number of studies
            </div>
            <div className="text-4xl font-semibold text-primary">
              <Counter duration={1250} target={counts.studies} />
            </div>
          </div>
          <div>
            <div className="whitespace-nowrap text-xl font-semibold">
              Number of effects
            </div>
            <div className="text-4xl font-semibold text-primary">
              <Counter duration={1500} target={counts.effects} />
            </div>
          </div>
          <div>
            <div className="whitespace-nowrap text-xl font-semibold">
              Number of observations
            </div>
            <div className="text-4xl font-semibold text-primary">
              <Counter duration={1750} target={counts.observations} />
            </div>
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
      <section className="my-12 flex flex-wrap-reverse items-center justify-center gap-6 bg-muted py-12">
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
    </div>
  )
}
