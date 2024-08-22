import Link from "next/link"

const About = () => {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="mb-6 text-center text-4xl font-bold">About</h1>
      <p className="italic">
        LIME is currently in beta and you are viewing a prototype of the
        website. We are still in the process of building the database and
        website. Any feedback is welcome and can be given{" "}
        <Link
          className="font-medium underline underline-offset-4"
          href="/contact/"
        >
          here
        </Link>
        .
      </p>
      <p>
        <strong>LIME</strong> stands for <strong>L</strong>ibrary of{" "}
        <strong>I</strong>nterventions for <strong>M</strong>eat{" "}
        <strong>E</strong>limination. In short, LIME is a continuously growing
        collection of all experimental studies that tested the effectiveness of
        a psychological intervention in reducing animal product consumption,
        improving attitudes towards animals, or changing related outcomes. This
        website was designed to make this literature more accessible to
        researchers, advocates, and policy makers.
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
        <Link
          className="font-medium underline underline-offset-4"
          href={"/data/"}
        >
          Data Explorer tool
        </Link>
        . You can explore the data with a customizable table that allows you to
      </p>
      <ul className="list-outside list-disc ps-6">
        <li>Select which of the many variables you want to inspect</li>
        <li>
          Include or exclude specific studies based on different criteria (e.g.,
          only studies from a specific country)
        </li>
        <li>Download your customized database</li>
      </ul>
      <p>
        The{" "}
        <Link
          className="font-medium underline underline-offset-4"
          href={"/meta-analysis/"}
        >
          Meta-analysis tool
        </Link>{" "}
        allows you to synthesize the evidence across many studies. It allows you
        to:
      </p>
      <ul className="list-outside list-disc ps-6">
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
