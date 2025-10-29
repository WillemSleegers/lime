import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HighlightLineChart } from "./charts/highlight-line-chart"
import { HighlightRadialBarChart } from "./charts/highlight-radial-bar-chart"
import { HighlightBarChart } from "./charts/highlight-bar-chart"

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
  let paperTypeData
  let studyDesignData
  let studyRandomizationCount
  let studyRandomizationPercentage
  let studyDataAvailableCount
  let studyDataAvailablePercentage
  let studyConditionAssignmentData
  let outcomeSubcategoryData
  let outcomeMeasurementTypeData
  let countryData
  let sampleSizeStats

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
      "open access"
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
      const contents = datum.intervention_content?.split(", ") || []
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
      const mechanisms = datum.intervention_mechanism?.split(", ") || []
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
      const mediums = datum.intervention_medium?.split(", ") || []
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

    // Calculate paper type distribution
    const paperTypeCounts: Record<string, number> = {}
    data.forEach((datum) => {
      const types = datum.paper_type.split(", ")
      types.forEach((type) => {
        paperTypeCounts[type] = (paperTypeCounts[type] || 0) + 1
      })
    })
    paperTypeData = Object.entries(paperTypeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Calculate study design distribution
    const studyDesignCounts: Record<string, number> = {}
    const uniqueStudies = new Map<string, typeof data[0]>()
    data.forEach((datum) => {
      uniqueStudies.set(`${datum.paper}-${datum.study}`, datum)
    })
    uniqueStudies.forEach((datum) => {
      const designs = datum.study_design.split(", ")
      designs.forEach((design) => {
        studyDesignCounts[design] = (studyDesignCounts[design] || 0) + 1
      })
    })
    studyDesignData = Object.entries(studyDesignCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Calculate randomization percentage (count "yes")
    studyRandomizationCount = Array.from(uniqueStudies.values()).filter(
      (datum) => datum.study_randomization === "yes"
    ).length
    studyRandomizationPercentage = round(
      (studyRandomizationCount / studiesCount) * 100,
      0
    )

    // Calculate data availability percentage (count "yes")
    studyDataAvailableCount = Array.from(uniqueStudies.values()).filter(
      (datum) => datum.study_data_available.includes("yes")
    ).length
    studyDataAvailablePercentage = round(
      (studyDataAvailableCount / studiesCount) * 100,
      0
    )

    // Calculate condition assignment distribution
    const studyConditionAssignmentCounts: Record<string, number> = {}
    uniqueStudies.forEach((datum) => {
      const assignments = datum.study_condition_assignment.split(", ")
      assignments.forEach((assignment) => {
        studyConditionAssignmentCounts[assignment] = (studyConditionAssignmentCounts[assignment] || 0) + 1
      })
    })
    studyConditionAssignmentData = Object.entries(studyConditionAssignmentCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Calculate outcome subcategory distribution
    const outcomeSubcategoryCounts: Record<string, number> = {}
    data.forEach((datum) => {
      outcomeSubcategoryCounts[datum.outcome_subcategory] = (outcomeSubcategoryCounts[datum.outcome_subcategory] || 0) + 1
    })
    outcomeSubcategoryData = Object.entries(outcomeSubcategoryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Calculate outcome measurement type distribution
    const outcomeMeasurementTypeCounts: Record<string, number> = {}
    data.forEach((datum) => {
      const types = datum.outcome_measurement_type.split(", ")
      types.forEach((type) => {
        outcomeMeasurementTypeCounts[type] = (outcomeMeasurementTypeCounts[type] || 0) + 1
      })
    })
    outcomeMeasurementTypeData = Object.entries(outcomeMeasurementTypeCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Calculate country distribution
    const countryCounts: Record<string, number> = {}
    uniqueStudies.forEach((datum) => {
      countryCounts[datum.sample_country] = (countryCounts[datum.sample_country] || 0) + 1
    })
    countryData = Object.entries(countryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Calculate sample size statistics
    const controlSizes = data.map(d => d.effect_control_n)
    const interventionSizes = data.map(d => d.effect_intervention_n)
    const allSizes = [...controlSizes, ...interventionSizes].sort((a, b) => a - b)

    sampleSizeStats = {
      min: Math.min(...allSizes),
      median: allSizes[Math.floor(allSizes.length / 2)],
      max: Math.max(...allSizes),
    }
  } else {
    openAccessPercentage = 0
    preregistrationPercentage = 0
    studyRandomizationPercentage = 0
    studyDataAvailablePercentage = 0
  }

  return (
    <div className="space-y-8">
      {/* Papers Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Papers</h2>
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Row 1: Number of papers with year timeline - time series needs maximum width */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
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
          {/* Row 2: Open access papers - radial chart needs space to not get cut off */}
          <Card className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
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
          {/* Row 2: Paper type distribution - 4 items, bars need width */}
          <Card className="col-span-1 sm:col-span-1 md:col-span-3 lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-lg">Publication type</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects by publication type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paperTypeData && paperTypeData.length > 0 && (
                <HighlightBarChart data={paperTypeData} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Studies Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Studies</h2>
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Row 1: Studies count - wide card looks better for single number */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {studiesCount ? studiesCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of studies
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Row 2: Three percentage cards - all radial charts */}
          <Card className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
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
          <Card className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {studyRandomizationCount ? studyRandomizationCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Randomized studies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart percentage={studyRandomizationPercentage} />
            </CardContent>
          </Card>
          <Card className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {studyDataAvailableCount ? studyDataAvailableCount.toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Data available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <HighlightRadialBarChart percentage={studyDataAvailablePercentage} />
            </CardContent>
          </Card>
          {/* Row 3: Study design and condition assignment - both bar charts need width */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Study design</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of studies by study design
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studyDesignData && studyDesignData.length > 0 && (
                <HighlightBarChart data={studyDesignData} />
              )}
            </CardContent>
          </Card>
          <Card className="col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Condition assignment</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of studies by condition assignment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              {studyConditionAssignmentData && studyConditionAssignmentData.length > 0 && (
                <HighlightBarChart data={studyConditionAssignmentData} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Outcomes Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Outcomes</h2>
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Row 1: Number of effects - wide card for single number */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-2xl">{effectsCount}</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Row 2: Outcome measurement type distribution - 4 items */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-lg">Measurement type</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects by measurement type
              </CardDescription>
            </CardHeader>
            <CardContent>
              {outcomeMeasurementTypeData && outcomeMeasurementTypeData.length > 0 && (
                <HighlightBarChart data={outcomeMeasurementTypeData} />
              )}
            </CardContent>
          </Card>
          {/* Row 3: Outcome subcategory distribution - potentially many items, full width */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-lg">Outcome categories</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of effects by outcome category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {outcomeSubcategoryData && outcomeSubcategoryData.length > 0 && (
                <HighlightBarChart data={outcomeSubcategoryData} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interventions Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Interventions</h2>
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Row 1: Intervention content - full width for potentially many items */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
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
          {/* Row 2: Intervention mechanism - full width for potentially many items */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
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
          {/* Row 3: Intervention medium - full width */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
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
      </div>

      {/* Samples Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Samples</h2>
        <div className="gap-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {/* Row 1: Number of observations - wide card for single number */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {"~" + Math.round(participantsCount).toString()}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of observations
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Row 2: Sample size statistics - three separate cards */}
          <Card className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {sampleSizeStats ? Math.round(sampleSizeStats.min).toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Min sample size
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="col-span-1 sm:col-span-1 md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {sampleSizeStats ? Math.round(sampleSizeStats.median).toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Median sample size
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                {sampleSizeStats ? Math.round(sampleSizeStats.max).toString() : "-"}
              </CardTitle>
              <CardDescription className="mt-0 leading-5">
                Max sample size
              </CardDescription>
            </CardHeader>
          </Card>
          {/* Row 3: Country distribution - potentially many countries, full width */}
          <Card className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-6">
            <CardHeader>
              <CardTitle className="text-lg">Country</CardTitle>
              <CardDescription className="mt-0 leading-5">
                Number of studies by country
              </CardDescription>
            </CardHeader>
            <CardContent>
              {countryData && countryData.length > 0 && (
                <HighlightBarChart data={countryData} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
