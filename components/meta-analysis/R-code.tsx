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
        <Button variant="outline" className="h-auto rounded-lg w-fit px-6 py-3">
          R Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:max-w-4xl max-h-[80vh] overflow-y-auto">
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
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="flex gap-2 w-25 rounded-lg"
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
