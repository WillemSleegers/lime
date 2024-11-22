import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { MainNav } from "@/components/main-nav"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LIME",
  description: "Library of Interventions for Meat Elimination",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MainNav />
        {children}
      </body>
    </html>
  )
}
