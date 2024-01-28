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
    <Card className="min-w-[175px]">
      <CardHeader>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
