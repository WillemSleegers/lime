"use client"

import { Card, CardContent } from "@/components/ui/card"
import { round } from "@/lib/utils"
import { Heterogeneity } from "@/lib/types"

type CollapsibleHeterogeneityProps = {
  heterogeneity: Heterogeneity
}

function i2Label(i2: number): string {
  if (i2 < 25) return "low"
  if (i2 < 50) return "moderate"
  if (i2 < 75) return "high"
  return "very high"
}

export const CollapsibleHeterogeneity = ({
  heterogeneity,
}: CollapsibleHeterogeneityProps) => {
  const {
    q, qDf, qp,
    i2Paper, i2Study, i2Outcome, i2Total,
    tau2Paper, tau2Study, tau2Outcome,
  } = heterogeneity

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-subsection-title">Heterogeneity</h2>
        <p className="text-sm text-muted-foreground">
          Heterogeneity refers to real variation in effect sizes across studies —
          beyond what you&apos;d expect from sampling error alone. The statistics
          below describe how much the effects vary and where that variation comes
          from across the three levels of the model (papers, studies within
          papers, and outcomes within studies).
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Cochran&apos;s Q Test</h3>
          <p className="text-sm leading-relaxed">
            The Q test found{" "}
            {qp < 0.05 ? (
              <span className="font-semibold">significant heterogeneity</span>
            ) : (
              <span>no significant heterogeneity</span>
            )}{" "}
            across the included effects (Q({Math.round(qDf)}) = {round(q, 2)},{" "}
            p = {round(qp, 3)}). Note that the Q test has low power when the
            number of studies is small, so a non-significant result does not rule
            out meaningful variation.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            &tau;<sup>2</sup> — Absolute Variance Components
          </h3>
          <p className="text-sm text-muted-foreground">
            &tau;<sup>2</sup> is the estimated variance in true effect sizes at
            each level of the model. Unlike I<sup>2</sup>, it is an absolute
            measure and does not depend on the precision of the included studies,
            making it more useful for comparing heterogeneity across different
            selections of effects.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex flex-col gap-2 py-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Between papers
                </div>
                <div className="text-2xl font-bold">{round(tau2Paper, 4)}</div>
                <div className="text-xs text-muted-foreground">
                  Level 3 &tau;<sup>2</sup>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-2 py-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Between studies
                </div>
                <div className="text-2xl font-bold">{round(tau2Study, 4)}</div>
                <div className="text-xs text-muted-foreground">
                  Level 2 &tau;<sup>2</sup>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-2 py-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Between outcomes
                </div>
                <div className="text-2xl font-bold">
                  {round(tau2Outcome, 4)}
                </div>
                <div className="text-xs text-muted-foreground">
                  Level 1 &tau;<sup>2</sup>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            I<sup>2</sup> — Relative Variance Explained by Heterogeneity
          </h3>
          <p className="text-sm text-muted-foreground">
            I<sup>2</sup> estimates what proportion of total variance is due to
            true heterogeneity rather than sampling error. The model partitions
            this across three levels.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex flex-col gap-2 py-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Total I<sup>2</sup>
                </div>
                <div className="text-2xl font-bold">{round(i2Total, 1)}%</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {i2Label(i2Total)} heterogeneity
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-2 py-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Between papers
                </div>
                <div className="text-2xl font-bold">{round(i2Paper, 1)}%</div>
                <div className="text-xs text-muted-foreground">
                  Level 3 I<sup>2</sup>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-2 py-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Between studies
                </div>
                <div className="text-2xl font-bold">{round(i2Study, 1)}%</div>
                <div className="text-xs text-muted-foreground">
                  Level 2 I<sup>2</sup>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-2 py-4 text-center">
                <div className="text-sm font-medium text-muted-foreground">
                  Between outcomes
                </div>
                <div className="text-2xl font-bold">
                  {round(i2Outcome, 1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Level 1 I<sup>2</sup>
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-xs text-muted-foreground">
            Keep in mind that I<sup>2</sup> depends on the precision of the
            included studies, not just the absolute spread of effects. Selecting
            a subset of larger, more precise studies can increase I<sup>2</sup>{" "}
            even if the absolute heterogeneity (&tau;<sup>2</sup>) decreases.
            Use &tau;<sup>2</sup> for comparisons across different selections.
          </p>
        </div>
      </div>
    </div>
  )
}
