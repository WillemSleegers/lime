import Image from "next/image"

import { Badge } from "@/components/ui/badge"

import willem from "@/assets/images/willem.png"
import bastian from "@/assets/images/bastian.jpeg"

import { LinkIcon } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

const Contributors = () => {
  return (
    <main className="m-auto max-w-3xl space-y-12 px-3 py-9">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Contributors
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="max-w-64 space-y-3">
          <Image
            className="rounded-lg"
            src={willem}
            alt={"dr. Willem Sleegers"}
          />
          <span className="block font-semibold">dr. Willem Sleegers</span>
          <span className="block">
            Senior Behavioral Scientist at Rethink Priorities{" "}
          </span>
          <Link
            className="block"
            href="https://willemsleegers.com"
            target="_blank"
          >
            <Badge>
              Website <LinkIcon height={12} />
            </Badge>
          </Link>
        </div>

        <div className="max-w-64 space-y-3">
          <Image
            className="rounded-lg"
            src={bastian}
            alt={"dr. Bastian Jaeger"}
          />
          <span className="block font-semibold">dr. Bastian Jaeger</span>
          <span className="block">
            Assistant Professor at Tilburg University
          </span>
          <Link
            className="block"
            href="https://bastianjaeger.wordpress.com"
            target="_blank"
          >
            <Badge>
              Website <LinkIcon height={12} />
            </Badge>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Contributors
