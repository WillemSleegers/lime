import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BarChartIcon, FilterIcon } from "lucide-react"

export const Highlights = () => {
  return (
    <div className="flex gap-3 justify-center">
      <Card>
        <CardHeader>
          <CardTitle>254 effects</CardTitle>
          <CardDescription>From 102 studies</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>18 outcomes</CardTitle>
          <CardDescription>
            The most common outcome is meat consumption
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>14 interventions</CardTitle>
          <CardDescription>
            The most common intervention target is animal welfare
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
