import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartPercentage } from "../charts/chart-percentage"

type HighlightPercentageProps = {
  title: string
  description?: string
  percentage: number
}

export const HighlightPercentage = (props: HighlightPercentageProps) => {
  const { title, description, percentage } = props

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-28">
        <ChartPercentage percentage={percentage} />
      </CardContent>
    </Card>
  )
}
