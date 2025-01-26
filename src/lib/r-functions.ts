import { WebR } from "webr"

export async function runMetaAnalysis(webR: WebR) {
  const result = await webR.evalRRaw(
    `
      V <- metafor::vcalc(
          vi = effect_size_var,
          cluster = paper_study,
          subgroup = outcome,
          data = data,
          grp1 = intervention_condition,
          grp2 = control_condition
        )
      res <- metafor::rma.mv(
        effect_size_value, V, 
        random = ~ 1 | paper / study / outcome, 
        data = data
      )
      sav <- metafor::robust(res, cluster = paper, clubSandwich = TRUE)

      res_egger <- metafor::rma.mv(
        effect_size_value, V, 
        random = ~ 1 | paper / study / outcome,
        mods = ~effect_se,
        data = data
      )

      sav_egger <- metafor::robust(
        res_egger, 
        cluster = paper, 
        clubSandwich = TRUE
      )
      
      c(
        sav$b, sav$ci.lb, sav$ci.ub, sav_egger$b[2], sav_egger$se[2], 
        sav_egger$zval[2], sav_egger$pval[2])
    `,
    "number[]",
  )
  return result
}
