import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type TreeProps = {
  data: any
}

export const Tree = ({ data }: TreeProps) => {
  return (
    <Accordion type="single" className="w-fit" collapsible>
      {data.map((datum: any) => {
        return (
          <AccordionItem
            key={datum.id}
            className="border-b-0"
            value={`id-${datum.id}`}
          >
            <AccordionTrigger className="flex justify-start gap-3">
              {datum.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-x-3">
                <span className="text-base font-bold">Title</span>
                <span className="text-base">{datum.title}</span>
              </div>
              {datum.children &&
                datum.children.map((child: any) => {
                  return (
                    <Accordion
                      type="single"
                      className="w-fit"
                      collapsible
                      key={child.id}
                    >
                      <AccordionItem
                        className="border-b-0"
                        key={child.id}
                        value={`id-${child.id}`}
                      >
                        <AccordionTrigger className="flex justify-start gap-3">
                          {child.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-x-3">
                            <span className="text-base font-bold">
                              Sample size
                            </span>
                            <span className="text-base">20</span>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )
                })}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
