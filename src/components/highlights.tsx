import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type HighLightsProps = {
  effects: number
  papers: number
}

export const Highlights = (props: HighLightsProps) => {
  const { effects, papers } = props

  return (
    <div>
      <div className="flex gap-3 justify-center">
        <Card>
          <CardHeader>
            <CardTitle>
              {effects} {effects > 1 ? "effects" : "effect"}
            </CardTitle>
            <CardDescription>
              From {papers} {papers > 1 ? "papers" : "paper"}
            </CardDescription>
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
          The average effect is a Cohen&apos;s d of:
        </p>
        <p className="text-4xl font-semibold">0.21</p>
        <p className="text-base text-gray-500">95% CI [0.15, 0.24]</p>
      </div>
    </div>
  )
}
