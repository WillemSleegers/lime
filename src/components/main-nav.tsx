"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu"
import { Button } from "./ui/button"
import { Menu } from "lucide-react"
import { useEffect, useLayoutEffect, useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible"

const breakpoint = 1100

export function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const [isLarge, setIsLarge] = useState(true)
  const [open, setOpen] = useState(true)

  const onResize = () => {
    setIsLarge(window.innerWidth > breakpoint)
  }

  useEffect(() => {
    isLarge ? setOpen(true) : setOpen(false)
  }, [isLarge])

  useLayoutEffect(() => {
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <Collapsible
      className={`flex w-full justify-between p-4 ${isLarge ? "flex-row" : "flex-col"}`}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex flex-row justify-between">
        <div className="flex gap-3">
          <Link
            href="/"
            className="whitespace-pre-wrap text-xl font-medium sm:whitespace-nowrap"
          >
            The Meata-Analysis Project
          </Link>
          <Image
            alt="meata-analysis logo"
            src="/green-leaf-icon.svg"
            height={0}
            width={0}
            style={{ width: "30px", height: "30px" }}
          />
        </div>
        <CollapsibleTrigger
          asChild
          className={`${isLarge ? "hidden" : "flex"}`}
        >
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <NavigationMenu>
          <NavigationMenuList className="flex flex-wrap lg:flex-row">
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/meta-analysis" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Meta-analysis
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/data" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Data
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/FAQ" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  FAQ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contributors" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contributors
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/changelog" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Changelog
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </CollapsibleContent>
    </Collapsible>
  )
}
