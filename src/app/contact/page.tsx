import { Mail, MailPlus, MailQuestion, MailWarning } from "lucide-react"
import Link from "next/link"

const Contact = () => {
  return (
    <main className="prose container py-12">
      <h1 className="text-center">Contact</h1>
      <p>
        The best way to contact us is via e-mail. Click on one of the options
        below to let us know about a study we should add to our database, a
        question you have, a bug you found, or something else.
      </p>
      <div className="not-prose grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        <Link href="mailto:contact.project.lime@gmail.com?subject=Study to add to the LIME project">
          <div className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground">
            <MailPlus />
            <span>Add study</span>
          </div>
        </Link>
        <Link href="mailto:contact.project.lime@gmail.com?subject=Question about the LIME project">
          <div className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground">
            <MailQuestion />
            <span>Question</span>
          </div>
        </Link>
        <Link href="mailto:contact.project.lime@gmail.com?subject=Bug report for the LIME project">
          <div className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground">
            <MailWarning />
            <span>Bug</span>
          </div>
        </Link>
        <Link href="mailto:contact.project.lime@gmail.com">
          <div className="flex flex-col items-center justify-between rounded-md border-2 border-primary bg-transparent p-4 hover:bg-accent hover:text-accent-foreground">
            <Mail />
            <span>Other</span>
          </div>
        </Link>
      </div>
    </main>
  )
}

export default Contact
