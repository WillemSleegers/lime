import { WebR } from "webr"

// ─── Main meta-analysis ───────────────────────────────────────────────────────

export const code = `# Create the variance-covariance matrix of dependent effect sizes
V <- metafor::vcalc(
  vi = effect_size_var,
  cluster = paper_study,
  subgroup = outcome,
  data = data,
  grp1 = intervention_key,
  grp2 = control_key
)
  
# Run the meta-analysis
res <- metafor::rma.mv(
  yi = effect_size, 
  V = V, 
  random = ~ 1 | paper / study / outcome, 
  data = data
)

sav <- metafor::robust(
  x = res,
  cluster = paper,
  clubSandwich = TRUE
)

pred <- predict(sav)

# Compute I² partitioned by level (Cheung, 2014)
W <- diag(1/res$vi)
X <- model.matrix(res)
P <- W - W %*% X %*% solve(t(X) %*% W %*% X) %*% t(X) %*% W
Vt <- (res$k - res$p) / sum(diag(P))
I2_paper   <- 100 * res$sigma2[1] / (sum(res$sigma2) + Vt)
I2_study   <- 100 * res$sigma2[2] / (sum(res$sigma2) + Vt)
I2_outcome <- 100 * res$sigma2[3] / (sum(res$sigma2) + Vt)
I2_total   <- 100 * sum(res$sigma2) / (sum(res$sigma2) + Vt)

# Run the Egger's test
res_egger <- metafor::rma.mv(
  effect_size, V, 
  random = ~ 1 | paper / study / outcome,
  mods = ~effect_size_se,
  data = data
)

# Get cluster-robust confidence intervals for the Egger's test
sav_egger <- metafor::robust(
  res_egger, 
  cluster = paper, 
  clubSandwich = TRUE
)

# Return the values of interest:
# - The estimate of the meta-analysis
# - The robust lower and upper bound of the confidence interval
# - The lower and upper bound of the prediction interval
# - The estimate, standard error, z-value, and p-value
#   of the second coefficient from the Egger's test model
# - The Q statistic, degrees of freedom, and p-value for heterogeneity
# - I² partitioned by level (paper, study, outcome) and total
c(
  pred$pred, pred$ci.lb, pred$ci.ub, pred$pi.lb, pred$pi.ub,
  sav_egger$b[2], sav_egger$se[2], sav_egger$zval[2], sav_egger$pval[2],
  res$QE, as.numeric(res$k - res$p), res$QEp,
  I2_paper, I2_study, I2_outcome, I2_total,
  res$sigma2[1], res$sigma2[2], res$sigma2[3]
)`

export async function runMetaAnalysis(webR: WebR) {
  const result = await webR.evalRRaw(code, "number[]")
  return result
}

// ─── Moderator analysis ───────────────────────────────────────────────────────

function moderatorSetupCode(
  moderatorVar: string,
): string {
  return `
# Use the pre-filtered data passed from JavaScript
data_mod <- data[nchar(trimws(data$${moderatorVar})) > 0, ]
valid_levels <- unique(data_mod$${moderatorVar})
k_per_level <- as.integer(table(data_mod$${moderatorVar})[valid_levels])

# Recalculate variance-covariance matrix for the filtered data
V_mod <- metafor::vcalc(
  vi = effect_size_var,
  cluster = paper_study,
  subgroup = outcome,
  data = data_mod,
  grp1 = intervention_key,
  grp2 = control_key
)

# Run moderated meta-analysis with cell-means parametrization
res_mod <- metafor::rma.mv(
  yi = effect_size,
  V = V_mod,
  random = ~ 1 | paper / study / outcome,
  mods = ~ factor(${moderatorVar}) - 1,
  data = data_mod
)

# Get cluster-robust confidence intervals
sav_mod <- metafor::robust(res_mod, cluster = paper, clubSandwich = TRUE)
`
}

export function generateModeratorCode(
  moderatorVar: string,
): string {
  return moderatorSetupCode(moderatorVar)
}

export async function runModeratorAnalysis(
  webR: WebR,
  moderatorVar: string,
): Promise<{ levels: string[]; numbers: number[] }> {
  const setup = moderatorSetupCode(moderatorVar)

  const levels = await webR.evalRRaw(
    setup + `\nas.character(valid_levels)`,
    "string[]",
  )

  const numbers = await webR.evalRRaw(
    setup +
      `\nc(
  as.numeric(sav_mod$b),
  sav_mod$ci.lb,
  sav_mod$ci.ub,
  sav_mod$pval,
  as.integer(k_per_level),
  res_mod$QM,
  res_mod$QMdf[1],
  res_mod$QMp
)`,
    "number[]",
  )

  return { levels, numbers }
}
