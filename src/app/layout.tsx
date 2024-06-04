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
            <MainNav />
          </div>
        </div>

        <div>{children}</div>
      </body>
    </html>
  )
}
