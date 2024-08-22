import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const FAQ = () => {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="mb-6 text-center text-4xl font-bold">FAQ</h1>
      <Accordion type="single" collapsible className="w-full">
        <h2 className="text-2xl font-semibold tracking-tight">General</h2>
        <AccordionItem value="general-1">
          <AccordionTrigger>What is LIME?</AccordionTrigger>
          <AccordionContent>
            <p className="leading-5">
              In short, it is a library of psychological intervention studies
              aimed at reducing animal product consumption and for improving
              attitudes towards animals. We are collecting information on all
              studies on this topic to make it available via this website. You
              can explore the studies with the{" "}
              <Link
                className="font-medium underline underline-offset-4"
                href="/data/"
              >
                Data Explorer tool
              </Link>{" "}
              or conduct custom analyses with the{" "}
              <Link
                className="font-medium underline underline-offset-4"
                href="/meta-analysis/"
              >
                Meta-analysis tool
              </Link>
              . You can find out more about this project on the{" "}
              <Link
                className="font-medium underline underline-offset-4"
                href="/about/"
              >
                About
              </Link>{" "}
              page.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="general-2">
          <AccordionTrigger>Who is the target audience?</AccordionTrigger>
          <AccordionContent>
            <p className="leading-5">
              LIME was primarily built for researchers and activists or policy
              makers who are somewhat familiar with scientific research. In many
              ways, the website is designed to make scientific results more
              accessible for non-scientists. It facilitates the exploration and
              analysis of scientific studies, especially for people who do not
              regularly search for and read scientific publications. However,
              some background knowledge in statistics and scientific research is
              recommended, especially when using the meta-analysis tool.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="general-3">
          <AccordionTrigger>Who built LIME?</AccordionTrigger>
          <AccordionContent>
            <p className="leading-5">
              LIME was mainly created by dr. Willem Sleegers and dr. Bastian
              Jaeger. You can find out more about who collaborated on LIME on
              the{" "}
              <Link
                className="font-medium underline underline-offset-4"
                href="/data/"
              >
                Contributors
              </Link>{" "}
              page.
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
