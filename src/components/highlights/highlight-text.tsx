import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type HighlightTextProps = {
  title?: string
  description?: string
}

export const HighlightText = (props: HighlightTextProps) => {
  const { title, description } = props

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
