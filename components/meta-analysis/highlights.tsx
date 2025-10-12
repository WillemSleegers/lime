import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HighlightLineChart } from "@/components/charts/highlights/highlight-line-chart"
import { HighlightRadialBarChart } from "@/components/charts/highlights/highlight-radial-bar-chart"
import { HighlightBarChart } from "@/components/charts/highlights/highlight-bar-chart"

import { round } from "@/lib/utils"
import {
  countUniqueFilteredValues,
  countUniqueValues,
  countUniqueValuesByGroup,
  mapToXYArray,
} from "@/lib/json-functions"
import { Data } from "@/lib/types"

type HighLightsProps = {
  data?: Data
}

export const Highlights = (props: HighLightsProps) => {
  const { data } = props

  let participantsCount
  let effectsCount
  let papersCount
  let studiesCount
  let openAccessCount
  let openAccessPercentage
  let preregistrationsCount
  let preregistrationPercentage
  let yearCounts
  let chartData
  let interventionContentData
  let interventionMechanismData
  let interventionMediumData

  if (data) {
    participantsCount = [
      ...data
        .reduce((map, { paper, study, study_n }) => {
          return map.set(`${paper}-${study}`, {
            paper,
            study,
            study_n,
          })
        }, new Map())
        .values(),
    ]
      .map((e) => e.study_n)
      .reduce((partialSum, a) => Math.round(partialSum) + a, 0)

    studiesCount = [
      ...new Set(data.map((datum) => datum.paper + "-" + datum.study)),
    ].length

    effectsCount = data.length
    papersCount = countUniqueValues(data, "paper")
    openAccessCount = countUniqueFilteredValues(
      data,
      "paper",
      "paper_open_access",
      "yes"
    )
    openAccessPercentage = round((openAccessCount / papersCount) * 100, 0)
    preregistrationsCount = countUniqueFilteredValues(
      data,
      "paper_study",
      "study_preregistered",
      "yes"
    )
    preregistrationPercentage = round(
      (preregistrationsCount / studiesCount) * 100,
      0
    )
    yearCounts = countUniqueValuesByGroup(data, "paper", "paper_year")
    chartData = mapToXYArray(yearCounts)

    // Calculate intervention content counts (split comma-separated values)
    const interventionContentCounts: Record<string, number> = {}
    data.forEach((datum) => {
      const contents = datum.intervention_content.split(", ")
      contents.forEach((content) => {
        interventionContentCounts[content] = (interventionContentCounts[content] || 0) + 1
      })
    })

    interventionContentData = Object.entries(interventionContentCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)

    // Calculate intervention mechanism counts (split comma-separated values)
    const interventionMechanismCounts: Record<string, number> = {}
    data.forEach((datum) => {
      const mechanisms = datum.intervention_mechanism.split(", ")
      mechanisms.forEach((mechanism) => {
        interventionMechanismCounts[mechanism] = (interventionMechanismCounts[mechanism] || 0) + 1
      })
    })

    interventionMechanismData = Object.entries(interventionMechanismCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)

    // Calculate intervention medium counts (split comma-separated values)
    const interventionMediumCounts: Record<string, number> = {}
    data.forEach((datum) => {
      const mediums = datum.intervention_medium.split(", ")
      mediums.forEach((medium) => {
        interventionMediumCounts[medium] = (interventionMediumCounts[medium] || 0) + 1
      })
    })

    interventionMediumData = Object.entries(interventionMediumCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value)
  } else {
    openAccessPercentage = 0
    preregistrationPercentage = 0
  }

  return (
    <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/* Number of papers */}
          <Card className="grow col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {papersCount ? papersCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData && <HighlightLineChart data={chartData} />}
            </CardContent>
          </Card>
          {/* Number of studies */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {studiesCount ? studiesCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of studies
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Number of effects */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">{effectsCount}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Number of observations */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {"~" + Math.round(participantsCount).toString()}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of observations
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Intervention content counts */}
          <Card className="grow col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Intervention content</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects by intervention content category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interventionContentData && interventionContentData.length > 0 && (
                <HighlightBarChart data={interventionContentData} />
              )}
            </CardContent>
          </Card>
          {/* Percentage of open access papers */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {openAccessCount ? openAccessCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Open access papers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart percentage={openAccessPercentage} />
            </CardContent>
          </Card>
          {/* Percentage of preregistered studies */}
          <Card className="grow">
            <CardHeader>
              <CardTitle className="text-2xl">
                {preregistrationsCount ? preregistrationsCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Preregistered studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart percentage={preregistrationPercentage} />
            </CardContent>
          </Card>
          {/* Intervention mechanism counts */}
          <Card className="grow col-span-2 sm:col-span-3 md:col-span-3 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Intervention mechanism</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects by intervention mechanism
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interventionMechanismData && interventionMechanismData.length > 0 && (
                <HighlightBarChart data={interventionMechanismData} />
              )}
            </CardContent>
          </Card>
          {/* Intervention medium counts */}
          <Card className="grow col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Intervention medium</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects by intervention medium
              </CardDescription>
            </CardHeader>
            <CardContent>
              {interventionMediumData && interventionMediumData.length > 0 && (
                <HighlightBarChart data={interventionMediumData} />
              )}
            </CardContent>
          </Card>
    </div>
  )
}
