import Image from "next/image"

import { Badge } from "@/components/ui/badge"

import willem from "@/assets/images/willem.png"
import bastian from "@/assets/images/bastian.jpeg"
import robbie from "@/assets/images/robbie.jpg"

import { LinkIcon } from "lucide-react"
import Link from "next/link"

const Contributors = () => {
  return (
    <main className="container prose my-12 md:my-16 text-center">
      <h1>Contributors</h1>
      <div className="grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="max-w-60 space-y-2">
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

        <div className="max-w-60 space-y-2">
          <Image
            className="mb-5 rounded-lg"
            src={robbie}
            alt={"dr. Robbie van Aert"}
          />
          <span className="block font-semibold">dr. Robbie van Aert</span>
          <span className="block">
            Assistant Professor at Tilburg University{" "}
          </span>
          <Link
            className="block"
            href="https://robbievanaert.com"
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
