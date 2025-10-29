import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { pSup, u3, round } from "@/lib/utils"
import { Button } from "../ui/button"
import { PieChartProportion } from "./charts/pie-chart"

import { Estimate } from "@/lib/types"
import ChartEstimate from "./charts/estimate-chart"

type CollapsibleEstimateProps = {
  estimate: Estimate
}

export const CollapsibleEstimate = (props: CollapsibleEstimateProps) => {
  const { estimate } = props

  const lower = round(estimate.lower, 2)
  const value = round(estimate.value, 2)
  const upper = round(estimate.upper, 2)
  const piLower = round(estimate.piLower, 2)
  const piUpper = round(estimate.piUpper, 2)

  return (
    <div className="space-y-6">
      <h2 className="text-subsection-title">Effect</h2>
      <div className="space-y-12">
        <div className="mx-auto w-full space-y-12 text-center">
          <Card>
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="text-lg font-medium whitespace-nowrap">
                Cohen&apos;s <span className="italic">d</span> effect size:{" "}
              </div>
              <div className="text-3xl font-bold">{value}</div>
              <div className="text-muted-foreground text-sm">
                Our best guess of the average effect size based on all included
                studies
              </div>
            </CardContent>
          </Card>
          <ChartEstimate estimate={estimate} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="font-medium whitespace-nowrap">
                  95% Confidence Interval:{" "}
                </div>
                <div className="text-2xl font-bold">
                  {lower} - {upper}
                </div>
                <div className="text-muted-foreground text-sm">
                  This range shows our uncertainty about what the average effect
                  size is
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="font-medium whitespace-nowrap">
                  95% Prediction Interval:{" "}
                </div>
                <div className="text-2xl font-bold">
                  {piLower} - {piUpper}
                </div>
                <div className="text-muted-foreground text-sm">
                  This range shows our uncertainty about the effect size a new
                  study would likely find
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-center">
            Alternative Effect Sizes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                Probability of Superiority
              </h3>
              <PieChartProportion
                proportion={pSup(estimate.value)}
                start={0.5}
              />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold">Cohen&apos;s U3</h3>
              <PieChartProportion
                proportion={u3(estimate.value)}
                start={0.5}
              />
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-2xl"
                >
                  <span>What do these mean?</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Effect Size Interpretations</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="text-center space-y-2">
                      <h4 className="font-medium">
                        Probability of Superiority
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        There is a{" "}
                        <span className="font-semibold text-foreground">
                          {round(pSup(estimate.value) * 100, 1)}%
                        </span>{" "}
                        chance that a person picked at random from the
                        intervention group will have a higher score than a
                        person picked at random from the control group.
                      </p>
                    </div>

                    <div className="text-center space-y-2">
                      <h4 className="font-medium">Cohen&apos;s U3</h4>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {round(u3(estimate.value) * 100, 1)}%
                        </span>{" "}
                        of people in the intervention group score higher than
                        the average of the people in the control group.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="secondary"
                      className="whitespace-nowrap rounded-2xl"
                    >
                      <a
                        href="https://rpsychologist.com/cohend/"
                        target="_blank"
                      >
                        Learn more about Cohen&apos;s d
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
