import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import type { Metadata } from "next"

import { MainNav } from "@/components/navigation/main-nav"
import { ThemeProvider } from "@/components/theme-provider"

import { cn } from "@/lib/utils"

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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "flex flex-col min-h-svh")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
