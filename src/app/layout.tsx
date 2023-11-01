import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { MainNav } from "@/components/main-nav"

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
        <div className="hidden flex-col md:flex">
          <div className="border-b">
            <div className="flex h-16 items-center px-4">
              <MainNav className="mx-6" />
            </div>
          </div>
        </div>

        <div>{children}</div>
      </body>
    </html>
  )
}
