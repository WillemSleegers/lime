import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { MainNav } from "@/components/navigation/main-nav"

import "./globals.css"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"

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
      <body className={cn(inter.className, "flex flex-col min-h-svh")}>
        <MainNav />
        {children}
        <Footer />
      </body>
    </html>
  )
}
