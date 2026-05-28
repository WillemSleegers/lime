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

import { ALLOWED_MODERATOR_VARS } from "@/constants/constants-meta-analysis"

function assertAllowedModerator(moderatorVar: string): void {
  if (!ALLOWED_MODERATOR_VARS.has(moderatorVar)) {
    throw new Error(`Unknown moderator variable: ${moderatorVar}`)
  }
}

export type FactorModeratorResult = {
  levels: string[]
  estimates: number[]
  ciLower: number[]
  ciUpper: number[]
  pvals: number[]
  k: number[]
  qm: number
  qmdf: number
  qmp: number
}

/**
 * Single-value moderator analysis: fits one cell-means rma.mv with a factor
 * predictor. The model is fit once; we then read back named scalars/vectors.
 */
export async function runFactorModeratorAnalysis(
  webR: WebR,
  moderatorVar: string,
): Promise<FactorModeratorResult> {
  assertAllowedModerator(moderatorVar)

  await webR.evalRVoid(`
data_mod <- data[nchar(trimws(data$${moderatorVar})) > 0, ]
valid_levels <- sort(unique(data_mod$${moderatorVar}))
k_per_level <- as.integer(table(data_mod$${moderatorVar})[valid_levels])

V_mod <- metafor::vcalc(
  vi = effect_size_var,
  cluster = paper_study,
  subgroup = outcome,
  data = data_mod,
  grp1 = intervention_key,
  grp2 = control_key
)

res_mod <- metafor::rma.mv(
  yi = effect_size,
  V = V_mod,
  random = ~ 1 | paper / study / outcome,
  mods = ~ factor(${moderatorVar}, levels = valid_levels) - 1,
  data = data_mod
)

sav_mod <- metafor::robust(res_mod, cluster = paper, clubSandwich = TRUE)

# WebR's evalRRaw rejects vectors containing NA_real_ (R's NA encodes as JS
# null, which trips the "Can't convert" guard). Coerce NAs to NaN so the JS
# side gets back numeric values and can filter with Number.isFinite.
.numbers <- c(
  as.numeric(sav_mod$b),
  sav_mod$ci.lb,
  sav_mod$ci.ub,
  sav_mod$pval,
  as.integer(k_per_level),
  res_mod$QM,
  res_mod$QMdf[1],
  res_mod$QMp
)
.numbers[is.na(.numbers)] <- NaN
`)

  const [levels, numbers] = await Promise.all([
    webR.evalRRaw(`as.character(valid_levels)`, "string[]"),
    webR.evalRRaw(`.numbers`, "number[]"),
  ])

  const n = levels.length
  return {
    levels,
    estimates: numbers.slice(0, n),
    ciLower: numbers.slice(n, 2 * n),
    ciUpper: numbers.slice(2 * n, 3 * n),
    pvals: numbers.slice(3 * n, 4 * n),
    k: numbers.slice(4 * n, 5 * n),
    qm: numbers[5 * n],
    qmdf: numbers[5 * n + 1],
    qmp: numbers[5 * n + 2],
  }
}

export type LevelEstimate = {
  level: string
  estimate: number
  lower: number
  upper: number
  pval: number
  k: number
}

/**
 * Multi-value moderator analysis: for each requested level, subset rows whose
 * (comma-joined) moderator column contains that level as a token, and fit a
 * separate rma.mv. Levels are passed via a bound character vector — never
 * interpolated as R code — to avoid injection.
 */
export async function runPerLevelModeratorAnalysis(
  webR: WebR,
  moderatorVar: string,
  levels: string[],
): Promise<LevelEstimate[]> {
  assertAllowedModerator(moderatorVar)
  if (levels.length === 0) return []

  await webR.objs.globalEnv.bind("mod_levels", levels)

  await webR.evalRVoid(`
mod_col <- as.character(data$${moderatorVar})
mod_tokens <- strsplit(mod_col, ", ", fixed = TRUE)

# results: 5 numbers per level (estimate, lower, upper, pval, k); NA if a level
# has too few rows or papers to fit a multilevel model.
.fit_level <- function(lvl) {
  idx <- vapply(mod_tokens, function(toks) lvl %in% toks, logical(1))
  sub <- data[idx, , drop = FALSE]
  k <- nrow(sub)
  # NaN sentinel (not NA_real_) because WebR's evalRRaw rejects NA in the
  # returned vector — NaN survives as JS NaN and is filtered out client-side.
  .fail <- c(NaN, NaN, NaN, NaN, k)
  if (k < 2 || length(unique(sub$paper)) < 2) return(.fail)
  V <- try(metafor::vcalc(
    vi = effect_size_var,
    cluster = paper_study,
    subgroup = outcome,
    data = sub,
    grp1 = intervention_key,
    grp2 = control_key
  ), silent = TRUE)
  if (inherits(V, "try-error")) return(.fail)
  fit <- try(
    metafor::rma.mv(
      yi = effect_size, V = V,
      random = ~ 1 | paper / study / outcome,
      data = sub
    ),
    silent = TRUE
  )
  if (inherits(fit, "try-error")) return(.fail)
  sav <- try(metafor::robust(fit, cluster = sub$paper, clubSandwich = TRUE), silent = TRUE)
  if (inherits(sav, "try-error")) return(.fail)
  pred <- try(predict(sav), silent = TRUE)
  if (inherits(pred, "try-error")) return(.fail)
  out <- c(pred$pred, pred$ci.lb, pred$ci.ub, as.numeric(sav$pval[1]), k)
  out[is.na(out)] <- NaN
  out
}

level_results <- vapply(mod_levels, .fit_level, numeric(5))
`)

  const flat = await webR.evalRRaw(`as.numeric(level_results)`, "number[]")

  // R fills the matrix column-major: 5 rows × N cols. Each col is a level.
  return levels.map((lvl, i) => ({
    level: lvl,
    estimate: flat[i * 5 + 0],
    lower: flat[i * 5 + 1],
    upper: flat[i * 5 + 2],
    pval: flat[i * 5 + 3],
    k: flat[i * 5 + 4],
  }))
}
