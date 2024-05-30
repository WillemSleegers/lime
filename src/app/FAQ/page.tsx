import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const FAQ = () => {
  return (
    <main className="m-auto max-w-3xl px-3 py-9">
      <h1 className="text-center text-4xl font-bold tracking-tight">FAQ</h1>
      <Accordion type="single" collapsible className="w-full">
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">General</h2>
        <AccordionItem value="q-1">
          <AccordionTrigger>
            What is the Meata-Analysis Project?
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-5">
              In short, it is a live meta-analysis of psychological intervention
              studies to reduce animal product consumption. You can find out
              more about this project on the{" "}
              <Link className="underline" href="/about/">
                About
              </Link>{" "}
              page.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q-2">
          <AccordionTrigger>Who is the target audience?</AccordionTrigger>
          <AccordionContent>
            <p className="leading-5">
              We mainly target researchers and/or activists familiar with
              scientific research. While we try to make it easy to find out
              which interventions are most effective, some background knowledge
              of statistics and meta-analyses in particular is recommended.
            </p>
          </AccordionContent>
        </AccordionItem>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
          Meta-analysis
        </h2>
        <AccordionItem value="q-4">
          <AccordionTrigger>
            What is the probability of superiority?
          </AccordionTrigger>
          <AccordionContent>
            <p className="leading-5">
              In the context of this project, the probability of superiority is
              the probability that a random person from the intervention groups
              will have a lower animal product consumption than a random person
              from the control groups.{" "}
            </p>
            <p className="leading-5">
              If the probability is 50%, this means there is no difference
              between the control groups and intervention groups. In other
              words, there interventions are not effective in reducing animal
              product consumption.
            </p>
            <p className="leading-5">
              If the probability is higher than 50%, the interventions are
              effective. The higher the number, the more effective the
              interventions are.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  )
}

export default FAQ
