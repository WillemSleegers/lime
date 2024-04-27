import { WebR } from "webr"

export async function runMetaAnalysis(webR: WebR) {
  const result = await webR.evalRRaw(
    `
          V <- metafor::vcalc(
              vi = effect_size_var,
              cluster = paper_study,
              subgroup = outcome,
              data = data,
              grp1 = group_1,
              grp2 = group_2
            )
          res <- metafor::rma.mv(effect_size_value, V, random = ~ 1 | paper_study/outcome, data = data)
          c(res$beta, res$ci.lb, res$ci.ub)
          `,
    "number[]",
  )
  return result
}
