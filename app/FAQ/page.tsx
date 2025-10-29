import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const FAQ = () => {
  return (
    <main className="page-width page-container space-y-8">
      <h1 className="text-page-title text-center">FAQ</h1>
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-section-title">General</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="general-1">
              <AccordionTrigger className="text-base">
                What is LIME?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  In short, it is a library of psychological intervention
                  studies aimed at reducing animal product consumption. We are
                  collecting information on all studies on this topic to make it
                  available via this website. You can explore the studies with
                  the
                  <Link
                    className="font-medium text-primary hover:underline"
                    href="/data-explorer/"
                  >
                    Data Explorer tool
                  </Link>{" "}
                  or conduct custom analyses with the{" "}
                  <Link
                    className="font-medium text-primary hover:underline"
                    href="/meta-analysis/"
                  >
                    Meta-analysis tool
                  </Link>
                  . You can find out more about this project on the{" "}
                  <Link
                    className="font-medium text-primary hover:underline"
                    href="/about/"
                  >
                    About
                  </Link>{" "}
                  page.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="general-2">
              <AccordionTrigger className="text-base">
                Who is the target audience?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  LIME is primarily designed for researchers and activists or
                  policy makers who are somewhat familiar with scientific
                  research. In many ways, the website is designed to make
                  scientific results more accessible for non-scientists. It
                  facilitates the exploration and analysis of scientific
                  studies, especially for people who do not regularly search for
                  and read scientific publications. However, some background
                  knowledge in statistics and scientific research is
                  recommended, especially when using the meta-analysis tool.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="general-3">
              <AccordionTrigger className="text-base">
                Who built LIME?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  LIME was mainly created by dr. Willem Sleegers and dr. Bastian
                  Jaeger. You can find out more about who collaborated on LIME
                  on the{" "}
                  <Link
                    className="font-medium text-primary hover:underline"
                    href="/contributors/"
                  >
                    Contributors
                  </Link>{" "}
                  page.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="general-4">
              <AccordionTrigger className="text-base">
                Who has funded LIME?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  We are happy to report that we have received a grant from the{" "}
                  <Link
                    className="font-medium text-primary hover:underline"
                    href="https://www.fsrfund.org"
                  >
                    Food System Research Fund
                  </Link>
                  . This grant provides us with the opportunity to spend more
                  time than before on building LIME. It will enable us to
                  significantly expand on the functionality of the website, as
                  well as expand the database with more effect sizes to
                  meta-analyze.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="space-y-4">
          <h2 className="text-section-title">The database</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="database-1">
              <AccordionTrigger className="text-base">
                What types of interventions are included?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  We include studies that tested whether an intervention, such
                  as letting participants read a text on factory farm
                  conditions, influences an outcome related to animal product
                  consumption. These interventions differed on various aspects.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Content: appeals to animal welfare, the environment and
                    sustainability, personal health, etc.
                  </li>
                  <li>
                    Mechanism: persuasion with facts and statistics, menu design
                    (nudges), social norms, etc.
                  </li>
                  <li>
                    Medium: flyers, 2D and 3D videos, in-person lectures,
                    classroom discussions, etc.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="database-2">
              <AccordionTrigger className="text-base">
                What types of outcomes are included?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  We include studies that measured various outcomes related to
                  animal product consumption. We distinguish between three
                  general types of measures:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Behavior: sales data from restaurants, food diaries, etc.
                  </li>
                  <li>
                    Intentions: intended future meat consumption, intentions to
                    adopt a vegetarian diet, etc.
                  </li>
                  <li>
                    Attitudes & beliefs: beliefs about the ethicality of meat
                    consumption, feelings of guilt when thinking about meat
                    consumption, etc.
                  </li>
                </ul>
                <p>
                  These outcomes were measured online, in research laboratories,
                  or in the field. In most cases, measures were taken
                  immediately after the intervention. Most measures focus on
                  meat consumption in general, although some studies also
                  examined specific categories of meat (e.g., red and processed
                  meat, factory farmed meat) or other animal products (e.g.,
                  milk, eggs).
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="database-3">
              <AccordionTrigger className="text-base">
                What types of studies are included?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  The database includes data from different types of
                  publications, including peer-reviewed articles published in
                  scientific journals, unpublished scientific papers and theses,
                  and reports by advocacy groups and other institutions. We
                  include studies that experimentally tested the effect of an
                  intervention on a relevant outcome. This includes
                  between-subject designs, which compare the scores of
                  participants who were exposed to the intervention to scores of
                  a control group of participants who were not exposed to an
                  intervention, and within-subject designs, which compare
                  participants’ scores before and after an intervention.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="database-4">
              <AccordionTrigger className="text-base">
                How were the studies coded?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  Every study was coded on various relevant dimensions related
                  to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>The paper: title, authors, publication year, etc.</li>
                  <li>
                    The study: sample size, study design, accessibility of data,
                    etc.
                  </li>

                  <li>
                    The intervention: medium, content, targeted mechanism, etc.
                  </li>
                  <li>
                    The outcomes: type, measure, time since intervention, etc.
                  </li>
                </ul>
                <p>
                  A description of each variable that was recorded can be found
                  in the codebook, which you can download on the Meta-Analysis
                  page.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="database-5">
              <AccordionTrigger className="text-base">
                Are all relevant studies included in the database?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  LIME is currently in beta. We are still in the process of
                  developing a fully functioning version of the website. We are
                  also continuously adding additional studies to the database.
                  On the landing page, you can see how many papers, studies, and
                  effect sizes are currently included.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="database-6">
              <AccordionTrigger className="text-base">
                Can I suggest a paper for the database?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  Eventually, we want to include all studies that fulfill our
                  inclusion criteria. If you know a study that has not been
                  included yet, you can let us know{" "}
                  <Link
                    className="font-medium text-primary hover:underline"
                    href="/contact"
                  >
                    here
                  </Link>
                  .
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="space-y-4">
          <h2 className="text-section-title">Data explorer</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="explorer-1">
              <AccordionTrigger className="text-base">
                What is the Data Explorer?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  The Data Explorer helps you browse through research papers
                  included in the database. We have organized information about
                  a paper into different levels as papers can be quite
                  complicated. They have paper-level information like the
                  authors and publication year, but they also can consist of
                  multiple studies, each possibly consisting of multiple
                  interventions and outcomes, producing multiple statistical
                  results. We&apos;ve organized all this information into
                  separate tabs so you can focus on the specific details you
                  need without being overwhelmed.
                </p>
                <p>
                  We&apos;ve also added several features to help you explore and
                  work with the data:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    You can decide which studies to include by using filters
                    (e.g., only studies with sales data, only studies with
                    environmental appeals)
                  </li>
                  <li>
                    You can sort the data based on information from a specific
                    column (e.g., sorting by publication year or effect size)
                  </li>
                  <li>
                    You can click on a link at the end of each row to see more
                    information in a pop-up window, which also includes a link
                    to the paper.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="explorer-2">
              <AccordionTrigger className="text-base">
                What are the different data levels and how do they relate?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  The Data Explorer has five tabs, each showing you different
                  information about the same research. Each tab represents a
                  different 'level' of information. We distinguish between the
                  following levels:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Papers:</strong> Basic publication info like titles,
                    authors, and publication year. You can also see which papers
                    are open access and follow links to the original source.
                  </li>
                  <li>
                    <strong>Studies:</strong> Individual studies within papers.
                    Shows sample sizes, study design details, whether the study
                    was preregistered, and more.
                  </li>
                  <li>
                    <strong>Interventions:</strong> The specific techniques
                    researchers tested, like showing animal welfare videos or
                    changing menu layouts. It also includes details about
                    intervention content and delivery methods.
                  </li>
                  <li>
                    <strong>Outcomes:</strong> How researchers measured the
                    effects of the interventions, such as food choices, surveyed
                    attitudes, or measured behavioral intentions.
                  </li>
                  <li>
                    <strong>Effects:</strong> The statistical results showing
                    how well the intervention worked (effect size) and each
                    effect&apos;s sample size.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="explorer-3">
              <AccordionTrigger className="text-base">
                How do I use filters and the lock feature?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  Each tab has its own set of filters to help you narrow down
                  what you&apos;re looking at. For example, you might filter
                  papers by publication year, or studies by sample size.
                </p>
                <p>
                  The lock feature is useful when you want to maintain your
                  focus across different levels. If you filter to show only
                  preregistered studies, you can lock that filter, then switch
                  to the Interventions tab to see only the techniques used in
                  preregistered studies.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="explorer-4">
              <AccordionTrigger className="text-base">
                Can I download the data?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  Yes. You can download any of the tables as CSV files to
                  analyze in Excel, R, or other tools. The &quot;All&quot;
                  option gives you a complete dataset with everything joined
                  together. This is useful if you want to run your own
                  statistical analyses, perhaps on a more fine-grained subset of
                  the data.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="space-y-4">
          <h2 className="text-section-title">Meta-analysis</h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="meta-1">
              <AccordionTrigger className="text-base">
                What is a meta-analysis?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  Generally speaking, the goal of a meta-analysis is to combine
                  the results of many studies on a specific question in a
                  quantitative way. For example, we may want to know if
                  informing people about the conditions on factory farms reduces
                  their meat consumption. Researchers run experiments to test
                  the effect of such interventions, but the effect size (i.e.,
                  by how much meat consumption was changed) may depend on the
                  specific populations that is studied, the specific wording of
                  the educational text, how soon after the intervention meat
                  consumption was measured, and many other factors. By averaging
                  the results from all these studies, we get a better
                  understanding of how effective the intervention is in general.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="meta-2">
              <AccordionTrigger className="text-base">
                How does the Meta-analysis tool work?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  The meta-analysis tool allows you to conduct customizable
                  meta-analyses on specific sets of studies. First, you can
                  select which studies should be included in the meta-analysis.
                  You can select based on the type of intervention that was
                  tested (e.g., only animal welfare appeals), the type of
                  outcome measure that was used (e.g., only sales data), the
                  country in which the study was conducted, and many other
                  indicators. The website then displays various results for the
                  selected set of studies:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    The meta-analytic effect size (Cohen’s d) across all
                    studies, including the 95% confidence interval, the 95%
                    prediction interval, and other effect size measures
                  </li>
                  <li>
                    The results of a test for publication bias (including a
                    funnel plot showing the relation between effect size and
                    standard error)
                  </li>
                  <li>
                    A dot plot and forest plot that visualize the effect sizes
                    of all included studies
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="meta-3">
              <AccordionTrigger className="text-base">
                How narrow or wide should my inclusion criteria be?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  Meta-analyses provide the average effect across many studies.
                  This average is more meaningful if we compare studies that are
                  more similar to each other. Averaging apples and oranges may
                  not be meaningful. Setting relatively narrow criteria help
                  reduce variation between studies, making it easier to compare
                  results and draw more meaningful conclusions. However, when
                  widening the inclusion criteria, more studies are included,
                  which increases the statistical power and precision of the
                  meta-analysis. By adjusting your inclusion criteria, you can
                  navigate this tradeoff. Ultimately, your inclusion criteria
                  depend on which question you want to address.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q-4">
              <AccordionTrigger className="text-base">
                How should I interpret the effect size estimates?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  Effect size measures such as Cohen&apos;s d can be used to
                  quantify differences between groups on some variable of
                  interest. For example, if an intervention leads to a larger
                  reduction in meat consumption relative to a control group,
                  this will be reflected in a larger effect size. This{" "}
                  <Link
                    target="_blank"
                    href="https://rpsychologist.com/cohend/"
                  >
                    website
                  </Link>{" "}
                  provides a visual explanation of how Cohen&apos;s d (and other
                  effect size measures that we include here) corresponds to
                  group differences of varying sizes.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="database-7">
              <AccordionTrigger className="text-base">
                If I implement the same intervention as one of the studies, will
                it have the same effect for me?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  There are many reasons why you should not be too confident
                  that an intervention will be equally effective, or even
                  effective at all, in a different context. The effectiveness of
                  an intervention is not only influenced by the type of
                  intervention that was tested, but also by many other factors.
                  The participants in the original study may have been more open
                  to change their consumption (e.g., university students). The
                  original study may have only assessed intentions to reduce
                  meat consumption, which could overstate the true effectiveness
                  because people don’t always follow up on their intentions.
                </p>
                <p>
                  Even when we replicate a study design under very similar
                  conditions, results often look{" "}
                  <Link
                    target="_blank"
                    href="https://www.science.org/doi/10.1126/science.aac4716"
                  >
                    different
                  </Link>
                  . Larger, statistically significant results are more likely to
                  be accepted for publication and some researchers engage in
                  <Link
                    target="_blank"
                    href="https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.01832/full"
                  >
                    {" "}
                    questionable research practices
                  </Link>{" "}
                  to distort their results so that they are more likely to be
                  published. It is very hard to detect whether any of these
                  issues apply in a specific study, but it means that the effect
                  sizes that we see in the literature may overstate how large
                  the true effect sizes really are.
                </p>
                <p>
                  To address these difficulties, you could use LIME to find
                  studies that have tested interventions that more closely match
                  the sample you have in mind or have applied the intervention
                  in a setting more similar to yours. You can also use LIME to
                  assess the meta-analytic estimates of interventions, which may
                  be more robust than those from a single study.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="database-8">
              <AccordionTrigger className="text-base">
                Are some study results more informative and how can I tell?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-base">
                <p>
                  It is difficult to judge how reliable and generalizable the
                  results of a specific study are. But, all else being equal,
                  there are three indicators that you could pay attention to.
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>Sample size</strong>: Studies with larger
                    participant samples will provide more reliable estimates of
                    group differences. For example, to be 90% certain that you
                    will find a statistically significant difference between two
                    groups for a realistic effect size (a Cohen&apos;s d of
                    0.25), you would already need 338 participants in each
                    condition (676 in total). Few studies are this large.
                    Smaller studies will yield noisier effect sizes.
                    Meta-analyses are meant to address this problem. By
                    averaging over many studies, the random variability of
                    single studies can cancel out, leading to more reliable
                    estimates of the true effect size.
                  </li>
                  <li>
                    <strong>Outcome measure</strong>: If you are interested in
                    reducing meat consumption, then you could only focus on
                    studies that measured consumption more directly. Many
                    studies assessed intentions to reduce meat consumption in
                    the future, but we know that people don&apos;t always
                    implement their intentions (the intention-behavior gap).
                    Participants may also say that they will eat less meat even
                    if they don&apos;t intend to, just because they think
                    it&apos;s the socially desirable thing to say or it&apos;s
                    what the researcher wants to hear.
                  </li>
                </ul>
                <p>
                  You can find these indicators using the Data explorer and you
                  can also use them as inclusion criteria for a meta-analysis.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </main>
  )
}

export default FAQ
