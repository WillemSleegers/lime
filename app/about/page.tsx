import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

const About = () => {
  return (
    <main className="page-width page-container space-y-6">
      <h1 className="text-page-title text-center">About</h1>
      <Alert variant="destructive" className="bg-destructive/10">
        <AlertDescription>
          <p>
            LIME is currently in beta and you are viewing a prototype of the
            website. We are still in the process of building the database and
            website. Any feedback is welcome and can be given{" "}
            <Link href="/contact" className="font-medium">
              here
            </Link>
            .
          </p>
        </AlertDescription>
      </Alert>
      <p className="text-description">
        <strong>LIME</strong> stands for Library of Interventions for Meat
        Elimination. In short, LIME is a continuously growing collection of
        experimental studies that tested the effectiveness of a psychological
        intervention in reducing animal product consumption. This website aims
        to make this literature more accessible to researchers, advocates, and
        policy makers.
      </p>
      <p className="text-description">
        At the core of LIME is a machine-readable, continuously growing database
        of intervention studies. For each study, we extracted information on the
        intervention mechanism (e.g., presenting facts, menu design) and content
        (e.g., animal welfare, the environment), the outcome measure (e.g.,
        sales data, food diary), the participant sample (e.g., sample size,
        country), and much more.
      </p>
      <p className="text-description">
        This database can be accessed with the{" "}
        <Link
          href={"/data-explorer/"}
          className="font-medium text-primary hover:underline"
        >
          Data Explorer tool
        </Link>
        . You can explore the data with a customizable table that allows you to
      </p>
      <ul className="text-description space-y-2 list-disc pl-6">
        <li>
          Include or exclude specific studies based on different criteria (e.g.,
          only studies with randomized conditions or behavioral outcomes)
        </li>
        <li>Download the data</li>
      </ul>
      <p className="text-description">
        The{" "}
        <Link
          href={"/meta-analysis/"}
          className="font-medium text-primary hover:underline"
        >
          Meta-analysis tool
        </Link>{" "}
        allows you to synthesize the evidence across many studies. It allows you
        to:
      </p>
      <ul className="text-description space-y-2 list-disc pl-6">
        <li>
          Specify which types of studies should be included in the analysis with
          the help of various filters
        </li>
        <li>Estimate the average effect sizes across the included studies</li>
        <li>Test for publication bias</li>
      </ul>
    </main>
  )
}

export default About
