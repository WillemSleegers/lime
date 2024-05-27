import "./globals.css"
import type { Metadata } from "next"
import Link from "next/link"
import { Inter } from "next/font/google"
import { MainNav } from "@/components/main-nav"
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Meata-Analysis Project",
  description:
    "Meta-analysis of social psychological interventions studies directed at reducing the consumption of animal products.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex-col md:flex">
          <div className="border-b">
            <div className="flex items-center p-4">
              <MainNav>
                <div>
                  <Link
                    href="/"
                    className="whitespace-nowrap text-xl font-medium transition-colors hover:text-primary"
                  >
                    The Meata-Analysis Project
                    <Image
                      className="ms-2 hidden sm:inline-block"
                      alt="meata-analysis logo"
                      src="/green-leaf-icon.svg"
                      width={30}
                      height={30}
                    />
                  </Link>
                  <span className="ml-3 whitespace-nowrap rounded bg-red-700 px-3 py-2 text-base font-medium text-white">
                    Beta
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/about/"
                    className="text-base font-medium transition-colors hover:text-primary"
                  >
                    About
                  </Link>
                  <Link
                    href="/meta-analysis/"
                    className="whitespace-nowrap rounded bg-green-700 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-green-800"
                  >
                    Meta-analysis
                  </Link>
                  <Link
                    href="/data/"
                    className="text-base font-medium transition-colors hover:text-primary"
                  >
                    Data
                  </Link>
                  <Link
                    href="/FAQ/"
                    className="text-base font-medium transition-colors hover:text-primary"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/contributors/"
                    className="text-base font-medium transition-colors hover:text-primary"
                  >
                    Contributors
                  </Link>

                  <Link
                    href="/changelog/"
                    className="text-base font-medium transition-colors hover:text-primary"
                  >
                    Changelog
                  </Link>
                </div>
              </MainNav>
            </div>
          </div>
        </div>

        <div>{children}</div>
      </body>
    </html>
  )
}
