---
name: draft-effects
description: Draft new Effects-level rows for a LIME paper whose Statistics-level groups are coded but that has no effects yet. Decides which statistics groups to compare and with which effect size, calculates them, and writes a paste-ready CSV. Use when a paper has paper_status_detail "calculate effect sizes", or when the user asks to add effects for a paper. Not for coding a whole paper (code-paper) or recalculating existing effect rows (calculate-effects).
---

# Draft effects

Read `.claude/skills/lime-context.md` first.

The statistics are already coded and checked. This skill only decides the comparisons. Don't recode statistics, and don't compare our effects with the effects the paper reports. If you notice a problem in another level (e.g. wrong `outcome_days_since_intervention`), report it, don't fix it.

## Steps

1. **Gather in parallel:**
   - `Rscript r/draft-effects.r <paper>`: the study design, one row per statistics group (outcome, time, condition, control or intervention, sample, which statistics it holds), and any existing effects.
   - The `statistic_notes` and the other levels' rows for the paper. Collaborators often describe the design or the intended comparisons in `statistic_notes`.
   - The PDF. Paperbank file names use a thousands separator: `1,102 - Arrazat et al. (2024).pdf`. Check for a folder too.
2. **Read the PDF's method and the tables the statistics come from:** who was measured when, whether the same people were measured more than once, and how they were assigned to conditions.
3. **Decide the comparisons** with the rules below. Ask the user about anything they don't cover.
4. **Write the comparisons** to `comparisons.csv` in the scratchpad, one row per effect: `effect`, `intervention_statistics_1`, `control_statistics_1`, `effect_size_name`, and where needed `intervention_statistics_2`, `control_statistics_2`, `effect_r`, `effect_exclude` (default "no"), `effect_notes`. Number effects from 1, ordered by study, outcome, time, and intervention.
5. **Run** `Rscript r/draft-effects.r <paper> <comparisons.csv>`. It takes `study` and `outcome` from the statistics groups, calculates with `calculate_effects()`, adds a converted g for each reported OR, and writes `r/output/<paper>-effects.csv`.
6. **Check the printed results:** effects without an effect size (a missing statistic), a group compared with itself, and whether each sign matches the raw difference: positive when the intervention's raw value (M, or successes / n) is higher than the control's, negative when it's lower. For a difference-in-differences, compare the two changes. This is a mechanical check: ignore `outcome_expectation` and what the intervention was meant to do, and don't describe effects as good or bad, in the check or in the report. Judging an effect by whether it goes the expected way invites confirmation bias.
7. **Report:**
   - the CSV path and a short table of the effects (comparison, measure, g with CI), without interpreting their direction
   - judgment calls you made, and problems noticed in other levels
   - the derived columns (`paper_label`, `outcome_label` up to `control_sample`) are left as `-`, so drag the formulas down over the pasted rows
   - Positron's data preview shows "no" as "false"
   - a reminder to update the paper's status (don't suggest a value)

## Which comparisons

- Within a study and outcome: every intervention against every control. They're all pooled; `vcalc()` handles the shared groups.
- Every time point after the intervention gets its own effect. `meta-analysis.r` picks which time point to use.
- An overall outcome and its suboutcomes (`outcome_is_suboutcome` 1, e.g. beef and pork within meat) all get effects. The suboutcomes get `effect_exclude` "no". The overall outcome gets "yes", with the note "Excluded because its suboutcomes are included", so the same behavior isn't counted twice (paper 1092). An outcome with `outcome_is_suboutcome` 0 that has no suboutcomes stays "no". See TODO.md about settling this across the sheet.
- Samples follow from the statistics groups; there's no separate choice to make.

## Which measure

| Design | Counts (successes, failures) | M, SD, n |
|---|---|---|
| Between groups, or periods with different people or sales (e.g. control weeks vs intervention weeks in a cafeteria: papers 1102, 1092) | OR2DL | SMD |
| Same participants before and after, no control group | ask the user | SMCC with `effect_r` |
| Pre-test + control group (mixed) | OR2DL DiD | SMD DiD with `effect_r` |

- Difference-in-differences: `_1` is the later time point and `_2` the pre-test, for both intervention and control. Compare each later time point with the pre-test, not with the previous time point (papers 70, 1103).
- Binary difference-in-differences with the same participants at both time points: `calculate_did_logit()` treats them as independent, which overstates the variance. With raw data or a table of individual transitions, compute the paired variance in a paper-specific script (see lime-context). Otherwise say so in `effect_notes`.
- `effect_r` for SMCC or SMD difference-in-differences: derive it from a reported paired t-test, change-score SD, or raw data. If that isn't possible, ask the user. For a mixed design without r, the current rule is a post-only SMD between the groups at the later time point, with a note (paper 1105; see TODO.md).
- Don't add rows for effects the paper reports when the descriptives allow a calculation. Only when there are no usable descriptives, add the reported effect as a row (`effect_from_paper` "yes", with its values, and `effect_p` as reported) to `comparisons.csv`. Its statistics groups can then hold just n. The script adds a converted g for reported ORs. For other reported measures (d, F, t), ask the user.

## Gaps in the statistics

If a group lacks what the measure needs (e.g. only a percentage and n, or M without SD), propose Statistics-level additions as a separate CSV (`r/output/<paper>-statistics.csv`, every column in sheet order). For example, successes = round(percentage × n) and failures = n − successes, with `statistic_from_paper` "no" and a note. Calculate from those values in memory before the user pastes them.

## effect_notes

Only for unusual things: a judgment call, an assumption, why a row is excluded. Don't note where the statistics come from (Statistics-level already says), and don't mention the paper's own effect.

## Known issues

- Fisher's exact test returns p = 0 for very large samples (paper 1102). Leave it; see TODO.md.
