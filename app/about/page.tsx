import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

const About = () => {
  return (
    <main className="prose max-w-2xl mx-auto py-12">
      <h1 className="text-center">About</h1>
      <Alert variant="destructive" className="bg-destructive/10">
        <AlertDescription>
          LIME is currently in beta and you are viewing a prototype of the
          website. We are still in the process of building the database and
          website. Any feedback is welcome; see the Contacts section for ways to
          reach us.
        </AlertDescription>
      </Alert>
      <p>
        <strong>LIME</strong> stands for Library of Interventions for Meat
        Elimination. In short, LIME is a continuously growing collection of all
        experimental studies that tested the effectiveness of a psychological
        intervention in reducing animal product consumption, improving attitudes
        towards animals, or changing related outcomes. This website was designed
        to make this literature more accessible to researchers, advocates, and
        policy makers.
      </p>
      <p>
        At the core of LIME is a machine-readable, continuously growing database
        of intervention studies. For each study, we extracted information on the
        intervention mechanism (e.g., presenting facts, menu design) and content
        (e.g., animal welfare, the environment), the outcome measure (e.g.,
        sales data, food diary), the participant sample (e.g., sample size,
        country), and much more.
      </p>
      <p>
        This database can be accessed with the{" "}
        <Link href={"/data-explorer/"}>Data Explorer tool</Link>. You can
        explore the data with a customizable table that allows you to
      </p>
      <ul>
        <li>Select which of the many variables you want to inspect</li>
        <li>
          Include or exclude specific studies based on different criteria (e.g.,
          only studies from a specific country)
        </li>
        <li>Download your customized database</li>
      </ul>
      <p>
        The <Link href={"/meta-analysis/"}>Meta-analysis tool</Link> allows you
        to synthesize the evidence across many studies. It allows you to:
      </p>
      <ul>
        <li>
          Specify which types of studies should be included in the analysis with
          the help of various filters
        </li>
        <li>Estimate the average effect size across the included studies</li>
        <li>Test for publication bias</li>
      </ul>
    </main>
  )
}

export default About
