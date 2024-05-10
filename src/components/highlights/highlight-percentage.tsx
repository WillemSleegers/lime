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
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="m-auto h-20 w-20">
          <ChartPercentage percentage={percentage} />
        </div>
      </CardContent>
    </Card>
  )
}
