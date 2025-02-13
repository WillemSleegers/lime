import { CopyrightIcon } from "lucide-react"

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="flex gap-3 text-muted-foreground mb-12 md:mb-18 mx-auto"
    >
      <CopyrightIcon strokeWidth={1.5} /> LIME 2025
    </footer>
  )
}
