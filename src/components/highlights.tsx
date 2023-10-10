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
    <div>
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
      <div className="flex flex-col gap-3 text-center my-5">
        <p className="text-base text-gray-500">
          The average effect is a Cohen's d of:
        </p>
        <p className="text-4xl font-semibold">0.21</p>
        <p className="text-base text-gray-500">95% CI [0.15, 0.24]</p>
      </div>
    </div>
  )
}
