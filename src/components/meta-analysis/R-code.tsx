import SyntaxHighlighter from "react-syntax-highlighter"
import { xcode } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { CheckIcon, CopyIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { code } from "@/lib/r-functions"
import { useState } from "react"
import Link from "next/link"

export const RCode = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-2xl">
          Show R Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-scroll overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>R Code</DialogTitle>
          <DialogDescription className="prose">
            This is the R code we use to run the meta-analysis and related
            analyses. You can also check out the{" "}
            <Link href="https://github.com/WillemSleegers/lime" target="_blank">
              GitHub repository
            </Link>{" "}
            for the entire codebase.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm overflow-x-auto">
          <SyntaxHighlighter
            language="r"
            style={xcode}
            customStyle={{
              width: "100%",
              backgroundColor: "#f4f4f5",
              borderRadius: "0.5rem",
              overflowX: "scroll",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex gap-2 w-25 rounded-2xl"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
