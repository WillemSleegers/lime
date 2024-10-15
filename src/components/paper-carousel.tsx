"use client"

import { useEffect, useState } from "react"
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { shuffle } from "@/lib/utils"
import papers from "@/assets/data/papers.json"

export const PaperCarousel = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [shuffledPapers, setShuffledPapers] = useState<typeof papers>([])

  useEffect(() => {
    setShuffledPapers(shuffle(papers))
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent(current + 1)
      }
    }, 3000)
  }, [api, current])

  return (
    <Carousel setApi={setApi} className="w-full">
      <CarouselContent>
        {shuffledPapers.map((paper, index) => (
          <CarouselItem className="basis-1/2 lg:basis-1/4" key={index}>
            <div className="flex aspect-video flex-col gap-3 rounded-md bg-muted p-6">
              <span className="line-clamp-3 text-ellipsis text-base font-semibold">
                {paper.paper_title}
              </span>
              <span className="line-clamp-2 text-sm">
                {paper.paper_authors}
              </span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
