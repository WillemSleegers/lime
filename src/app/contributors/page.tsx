import Image from "next/image"

import { Badge } from "@/components/ui/badge"

import willem from "@/assets/images/willem.png"
import bastian from "@/assets/images/bastian.jpeg"

import { LinkIcon } from "lucide-react"
import Link from "next/link"

const Contributors = () => {
  return (
    <main className="prose container py-12">
      <h1 className="text-center">Contributors</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <div className="max-w-60 space-y-2 text-center">
          <Image
            className="mb-5 rounded-lg"
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
            <Badge variant={"secondary"}>
              Website <LinkIcon height={12} />
            </Badge>
          </Link>
        </div>

        <div className="max-w-60 space-y-2">
          <Image
            className="mb-5 rounded-lg"
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
            <Badge variant={"secondary"}>
              Website <LinkIcon height={12} />
            </Badge>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Contributors
