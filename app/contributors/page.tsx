import Image from "next/image"

import { Badge } from "@/components/ui/badge"

import willem from "@/assets/images/willem.png"
import bastian from "@/assets/images/bastian.png"

import { LinkIcon } from "lucide-react"
import Link from "next/link"

const Contributors = () => {
  return (
    <main className="page-width page-container text-center space-y-10">
      <div className="space-y-6">
        <h1 className="text-page-title mb-12">Contributors</h1>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="max-w-60 space-y-2">
            <Image
              className="mb-5 rounded-lg"
              src={willem}
              alt={"Dr. Willem Sleegers"}
            />
            <span className="block font-semibold">Dr. Willem Sleegers</span>
            <span className="block">
              Senior Behavioral Scientist at Rethink Priorities{" "}
            </span>
            <Link
              className="block"
              href="https://willemsleegers.com"
              target="_blank"
            >
              <Badge variant={"secondary"}>
                Website <LinkIcon height={12} />
              </Badge>
            </Link>
          </div>

          <div className="max-w-60 space-y-2">
            <Image
              className="mb-5 rounded-lg"
              src={bastian}
              alt={"Dr. Bastian Jaeger"}
            />
            <span className="block font-semibold">Dr. Bastian Jaeger</span>
            <span className="block">
              Assistant Professor at Tilburg University
            </span>
            <Link
              className="block"
              href="https://bastianjaeger.wordpress.com"
              target="_blank"
            >
              <Badge variant={"secondary"}>
                Website <LinkIcon height={12} />
              </Badge>
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-3xl">Collaborators</h2>
        <div className="space-y-2">
          <span className="block font-semibold">Dr. Robbie van Aert</span>
          <span className="block">
            Assistant Professor at Tilburg University{" "}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-3xl">Research Assistants</h2>
        <div className="space-y-2">
          <span className="block font-semibold">Isil Ayca Akkuş</span>
          <span className="block font-semibold">Louise Wong</span>
        </div>
      </div>
    </main>
  )
}

export default Contributors
