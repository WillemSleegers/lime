import { Mail, MailPlus, MailQuestion, MailWarning } from "lucide-react"
import Link from "next/link"

const Contact = () => {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="text-center text-4xl font-bold">Contact</h1>
      <p className="my-6">
        The best way to contact us is via e-mail. Click on one of the options
        below to let us know about a study we should add to our database, a
        question you have, a bug you found, or something else.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <Link
          href="mailto:contact.project.lime@gmail.com?subject=Study to add to the LIME project"
          className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground"
        >
          <MailPlus />
          Add study
        </Link>
        <Link
          href="mailto:contact.project.lime@gmail.com?subject=Question about the LIME project"
          className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground"
        >
          <MailQuestion />
          Question
        </Link>
        <Link
          href="mailto:contact.project.lime@gmail.com?subject=Bug report for the LIME project"
          className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground"
        >
          <MailWarning />
          Bug
        </Link>
        <Link
          href="mailto:contact.project.lime@gmail.com"
          className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground"
        >
          <Mail />
          Other
        </Link>
      </div>
    </main>
  )
}

export default Contact
