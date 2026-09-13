---
name: calculate-effects
description: Calculate effect sizes, variances, and test statistics for LIME papers from the descriptive statistics in the Google Sheet. Use when a paper needs effect sizes calculated (paper_status "calculate effect sizes"), or when the user asks to calculate or recalculate SMD, OR2DL, SMCC, or difference-in-differences effects.
---

# Calculate effects

Read `.claude/skills/lime-context.md` first.

All calculations live in `r/calculate-effects.r`. Use it; don't write one-off conversion code. If a new kind of calculation is needed, add a function there and discuss it with the user first.

## Supported calculations

| effect_size_name | Input statistics | Method |
|---|---|---|
| SMD | M, SD (or SE), n per group | escalc SMD + Welch's two-sample t-test |
| OR2DL | successes, failures per group | escalc OR2DL + Fisher's exact test |
| SMCC | M, SD, n; `effect_r` for paired | Paired-sample t-test with `effect_r`, one-sample t-test on change scores without |
| g (with `_2` statistics) | successes, failures in a 2x2 | Difference in log odds ratios × √3/π, Wald χ² (df = 1) |

Effects with other measures (d, eta squared, IRR) are skipped and listed. Tell the user about them.

Reported odds ratios (effect_size_name "OR", with a 95% CI) are converted with `convert_reported_or()`: it returns a new `g` row per OR (log(OR) × √3/π, SE from the CI). Add those as new effects and set the original OR rows to `effect_exclude` "yes", so exactly one row per comparison is pooled.

## Steps

1. Ask which papers to process, unless the user named them. Without papers, the script takes every pooled effect (`effect_exclude` "no") that has no effect size yet.
2. Run from the repo root: `Rscript r/calculate-effects.r <paper> [<paper> ...]`
3. Read the printed results and check each effect:
   - Missing inputs (NA effect size): report which statistic is missing for which statistics group.
   - Intervention and control pointing at the same statistics group (except one-sample SMCC): likely a coding error.
   - Direction: positive means the intervention's raw value is higher than control's.
   - If the paper already had a stored effect size, compare it and flag differences above 0.001.
4. Report the CSV path (`r/output/effects-<date>.csv`). It contains every Effects-level column in sheet order (including empty ones), with `-` for empty cells, so rows paste straight over the matching rows (paper, effect). Remind them that Positron's data preview shows "no" as "false".
5. Any other paste-ready output (e.g. corrected rows for another level) also goes to `r/output/` as CSV with every column of that sheet, in sheet order, and `-` for empty cells.
