import { WebR } from "webr"

export const code = `
  # Create the variance-covariance matrix of dependent effect sizes
  V <- metafor::vcalc(
      vi = effect_size_var,
      cluster = paper_study,
      subgroup = outcome,
      data = data,
      grp1 = intervention_condition,
      grp2 = control_condition
    )
  
  # Run the meta-analysis
  res <- metafor::rma.mv(
    yi = effect_size_value, 
    V = V, 
    random = ~ 1 | paper / study / outcome, 
    data = data
  )

  # Get cluster-robust confidence intervals
  sav <- metafor::robust(
    x = res, 
    cluster = paper, 
    clubSandwich = TRUE
  )

  # Run the Egger's test
  res_egger <- metafor::rma.mv(
    effect_size_value, V, 
    random = ~ 1 | paper / study / outcome,
    mods = ~effect_se,
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
  # - The robust lower and upper bound of the confidence 
  #   interval of the estimate
  # - The estimate, standard error, z-value, and p-value 
  #   of the second coefficient from the Egger's test model
  c(
    sav$b, sav$ci.lb, sav$ci.ub, sav_egger$b[2], sav_egger$se[2], 
    sav_egger$zval[2], sav_egger$pval[2]
  )
`

export async function runMetaAnalysis(webR: WebR) {
  const result = await webR.evalRRaw(code, "number[]")
  return result
}
