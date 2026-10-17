# TODO

## Important

- [ ] **Methodology section 2.1 is out of sync with the Study-level columns** — It describes study design variables the sheet doesn't hold yet: cluster label, cluster number, a three-level assignment process (random / non-random researcher-assigned / self-selection), data tracking, and study RCT. The sheet has draft columns for a new scheme (`study_condition_assignment_unit`, `_process`, `_structure`, `study_cluster_label`, `study_cluster_k`, `study_measurement_unit`, `study_data_tracking`, `study_pseudoreplication_risk`, `study_crossover_contamination_risk`, `study_rct`), but they're empty or copies of the current columns. Settle the scheme, then bring the methodology, the draft entries in `codebook.yaml`, and the app's study filters in line with it.
- [ ] When creating the data from the R script, go back to selecting effects with the shortest time point from intervention to outcome, rather than the longest. The idea is that this makes the effects more comparable. Or, alternatively, include all effects but add a filter on the website so users can select what they want, like minimum days since intervention. The main challenge is that our model does not support multiple effects that only differ in their time point, so we need to make sure each outcome only includes one time point

## Code Quality

- [ ] **Resolve remaining lint warnings** — 5 warnings surfaced by `pnpm lint`, none currently blocking:
  - `components/data-explorer/table/columns.tsx` — 3x `@typescript-eslint/no-explicit-any` on shared column defs (`Column<any, unknown>`) reused across different row types. Try narrowing to `Column<unknown, unknown>`; may run into TanStack Table type friction.
  - `components/data-explorer/table/data-table.tsx` and `components/meta-analysis/filters.tsx` — React Compiler skips memoization around TanStack Table's `useReactTable()` and React Hook Form's `watch()` (both flagged as "incompatible library"). No clear fix short of replacing those libraries.
- [ ] Add tests

## Meta-Analysis

- [ ] **Factor model for intervention mechanism moderator** — When "Exclude multi-mechanism interventions" is on, mechanism becomes a clean categorical variable. Add an option to run a single factor model across all mechanism levels simultaneously, giving predicted means for each in one chart/table, rather than picking one mechanism at a time.
- [ ] **Double-check remaining "effect"-labeled Highlights tooltips** — `components/meta-analysis/highlights.tsx` has four bar charts still counting directly over the effect-level `data` array with `unit="effect"`: Intervention mechanism, Intervention medium, Measurement type, Outcome categories. Verify each field (`intervention_mechanism`, `intervention_medium`, `outcome_measurement_type`, `outcome_subcategory`) is genuinely effect-level rather than constant across multiple effect rows for the same intervention/outcome/study — if it's coarser, counting per raw effect row over-counts, the same bug just fixed for `paper_type` (was constant per paper but counted per effect row, ~3x inflation) in the "Publication type" chart.

## Effect Size Calculation

- [ ] **Separate pre-post correlations per arm for difference-in-differences** — Effects-level has a single `effect_r`, but a DiD with the same participants measured twice needs two correlations: one pre-post correlation within the intervention group and one within the control group. Paper 70 shows they can differ quite a bit (phi = .87 compassion vs .78 control at post-test). For now paper 70's paired variance comes from a paper-specific script in its Paperbank folder, not from the sheet.
  - Naming: `_1`/`_2` means time elsewhere in the sheet, so `effect_r_1`/`effect_r_2` may mislead; `intervention_r`/`control_r` names them by arm. Decide whether `effect_r` stays for SMCC (where it's the correlation between the intervention and control measurements of the same people) or gets replaced.
  - `calculate_did_logit()`: add `-2·r / (n·√(p1(1−p1)·p2(1−p2)))` per arm to the variance (r = 0 gives the current independent version). Checked against paper 70's raw data: counts + per-group phi reproduce the script's SEs exactly.
  - `calculate_did_smd()`: Morris (2008) assumes one shared r; with two, replace `2(1−r)(1/n_i + 1/n_c)` with `2(1−r_i)/n_i + 2(1−r_c)/n_c` (an approximation). Paper 92 would get its pooled r in both columns.
  - Also update `validate.r`, the codebook, the skill docs, and methodology section 3; then recalculate papers 70 and 92 from the sheet.

- [ ] **Rate-based effects for counts that aren't proportions** — Paper 140 codes red meat packages as successes out of shoppers entering the store (failures = shoppers − packages). That's a rate (packages per shopper), not a proportion: one shopper can buy several packages, and failures don't count anything real. It's currently kept as an approximate proportion (g DiD for pilot week 1).
  - Alternative: a log rate ratio (packages per shopper), with difference-in-differences on the log rate scale; variance 1/packages per cell under a Poisson assumption.
  - Needs: a way to pool rate ratios (the meta-analysis doesn't pool IRRs yet), a conversion to the common effect size scale, and a check for other papers coded the same way.
  - Different from sales as the unit (e.g. paper 62: vegetarian vs meat dishes out of all dishes sold), where the proportion is valid.

## Data Quality and Coding Review

### High Priority

- [ ] **Review and validate data codings** - Go through the database systematically and check coding decisions for accuracy and consistency. Suggest improvements where appropriate.
  - Review intervention content categorizations (animal welfare, health, environment, etc.)
  - Validate intervention mechanism classifications
  - Check outcome subcategory assignments
  - Verify study design classifications
  - Review sample type categorizations
  - Suggest alternative or additional coding schemes where current ones may be inadequate

### Reviews tab ("Meta-reviews & reviews")

- [ ] **What does the tab's `status` column mean?** Lohmann et al. (2026) is "unscreened" there, but 19 papers in Paper-level (1102 onwards) already list it in `paper_in_paper`. Decide whether "unscreened" means the review or the papers taken from it, and update the status if needed.
- [ ] **Meta-reviews in `paper_in_paper`?** Grundy et al. (2022) and Onwezen & Dagevos (2024) are "included" but aren't `paper_in_paper` levels in `codebook.yaml`, presumably because they led to reviews rather than papers. Confirm, so `validate.r` can check the tab's included reviews against the codebook.

### Areas to Focus On

- Look for inconsistencies in how similar studies/interventions are coded
- Identify potential missing categories or overly broad/narrow classifications
- Check for coding errors or ambiguous cases that need clarification
- Suggest refinements to improve the utility and interpretability of the database

### Goal

Serve as a collaborator to polish, check, and improve the database quality and usability for researchers and advocates working on animal welfare interventions.
