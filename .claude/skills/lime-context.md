# LIME data pipeline: shared context

Read this before running any LIME data skill.

## Where things live

- Google Sheet (source of truth): `https://docs.google.com/spreadsheets/d/1asBfkq4AkTtdcb_yZTkN685LVeV5DYHNrO83g9N5HCU/`
- Sheet tabs: Paper-level, Study-level, Sample-level, Condition-level, Outcome-level, Statistics-level, Effects-level, Codebook
- Paper PDFs: `/Users/willem/Google Drive/Projects/Meata-analysis/Papers/Paperbank`, named `<paper> - <paper_label>.pdf` (e.g. `10 - Carfora et al. (2017b).pdf`). Some papers are a folder `<paper> - <paper_label>/` instead, holding the PDF plus supplements (.docx: convert with `textutil -convert txt`), raw data, notes, and an R script used to extract statistics. Check it before concluding something isn't reported.
- R scripts:
  - `r/validate.r`: data checks
  - `r/calculate-effects.r`: all effect size calculations and conversions
  - `r/meta-analysis.r`: builds the app's JSON in `assets/data/` and fits the model
- App codebook: `assets/data/codebook.json`
- Paste-ready output: `r/output/` (git-ignored)

## Rules

- Never write to the Google Sheet. Produce paste-ready CSVs; the user pastes them.
- Run R with standalone `Rscript` from the repo root. Auth: `gs4_auth(email = "*@me.com")` (cached token; two Google accounts are cached, so don't use `email = TRUE`).
- Write non-trivial R to a file in the scratchpad and run it; inline `Rscript -e '...'` breaks on quoting (`\(x)` lambdas, regex escapes).
- The user's live R session (btw MCP) is read-only: it can only inspect objects they've loaded, not run code.
- Load sheets with `read_sheet(..., na = c("", "-"))`. Filter out rows with `is.na(paper)`: the sheets have trailing empty rows whose formulas show `#REF!` / `#N/A`.
- To use functions from `r/calculate-effects.r` without running its "Run" section, evaluate only the expressions before `gs4_auth`:
  ```r
  exprs <- parse("r/calculate-effects.r")
  stop_at <- which(vapply(exprs, function(e) grepl("^gs4_auth", deparse(e)[1]), logical(1)))
  for (e in exprs[seq_len(stop_at - 1)]) eval(e, globalenv())
  ```
  The same trick works for testing `r/meta-analysis.r` without `btw_mcp_session()` or `write_json()`.

## Paper-specific scripts

When a paper needs a calculation that `r/calculate-effects.r` can't do from sheet statistics (typically raw data), write `<paper> - <paper_label>.r` in the paper's Paperbank folder, next to the data (named `<paper> - <paper_label> - <original name>`). Turn a single PDF into a folder first. Follow the existing scripts' sections (Setup, Data import, Data preparation, Data analysis), run it from that folder, and name the script in `effect_notes`. Example: paper 70 (paired variance for a binary difference-in-differences).

Judgment calls on how to calculate effects are listed in `check-paper/SKILL.md` and publicly in section 3 of `app/methodology/methodology.md`.

## Output files (paste-ready)

- CSV (the user prefers CSV over TSV), written with `write_csv(..., na = "-")`.
- Include every column of the target sheet, in sheet order, even empty ones: take the order from `names(read_sheet(...))`.
- Name files `r/output/<paper>-<level>.csv` (e.g. `34-effects.csv`, `443-statistics.csv`).
- Notes columns (`*_notes`): don't cite the paper itself (author, year); everything extracted obviously comes from it. Point to the location instead when useful (e.g. "Table 2", "p. 5").
- p-values (`effect_p`): copy what the paper reports, including thresholds like "<0.001", when `effect_from_paper` is "yes". When we calculate or convert an effect ourselves, give the exact p (e.g. a Wald z = log(OR) / SE for a converted OR), never a threshold.
- Tell the user when rows must be deleted before pasting (renumbered statistics groups, restructured studies).
- Positron's data preview shows "no" as "false"; mention it when output has yes/no columns.

## Sheet mechanics

- In Effects-level, the columns between `paper_label` and `effect` (outcome_label, conditions, times, labels, samples) are derived by sheet formulas from the statistics groups. Every effect needs both `intervention_statistics_1` and `control_statistics_1` pointing at existing Statistics-level groups, even for effects reported directly by the paper (then the groups can hold just `n`).
- Statistics-level `sample_label` and similar label columns are lookups too; an empty `sample` shows `#N/A`.
- `paper_status` flow: unscreened → ready to code → (contact authors / analyze raw data) → calculate effect sizes → add to website → included. Remind the user to update it after finishing a paper.

## Data model

- Keys cascade: paper → study → sample / condition / outcome (with time) → statistics → effect.
- Sample-level: a `(total)` sample per study plus one sample per condition (and per period if relevant).
- Statistics-level is long: one row per `statistic_name` (`successes`, `failures`, `n`, `percentage`, `M`, `SD`, `SE`, `beta`) within a `statistics` group (one condition × sample × outcome × time). `statistics` numbers run across the paper; `statistic` numbers within a group.
- Effects-level links groups via `intervention_statistics_1` / `control_statistics_1`. The `_2` columns (with `intervention_time_2` / `control_time_2`) form a 2x2 set for difference-in-differences. `effect` numbers run across the paper.
- One comparison can have several rows (e.g. a reported OR and its converted g). Exactly one row per comparison may have `effect_exclude = "no"`; the others are "yes" with a note.
- `effect_size` is stored unflipped: positive means the intervention's raw value is higher than control's. `meta-analysis.r` flips by `outcome_expectation`.
- `effect_r` is the pre-post (repeated measures) correlation.
- Allowed factor levels are defined in `r/validate.r`.

## Meta-analysis (`r/meta-analysis.r`)

- Uses effects with `effect_exclude == "no"` and `effect_size_name` in OR2DL, SMCC, SMD, g. Reported d, eta squared, OR, and IRR are not pooled unless converted.
- Keeps only the latest `intervention_time_1` per paper/study/outcome.
- `vcalc()` with cluster paper-study, subgroup outcome, and group keys from condition-sample-time; then `rma.mv(random = ~ 1 | paper / study / outcome)` with clubSandwich robust inference clustered by paper.
- State on 2026-09-13: 732 effects from 178 papers; pooled estimate 0.255 [0.201, 0.309].

## Common coding errors found so far

- Total N for a whole dish, menu, or study used as the per-condition n: check the methods for how participants were split (paper 383).
- Effect sizes computed from rounded percentages instead of the coded counts (paper 31).
- Control-side keys pointing at the intervention's condition, sample, or statistics group (paper 4). Or shifted keys: an effect comparing control at T2 with control at T1, and the next one comparing the intervention at T2 with control at T1 (paper 3).
- Typos in statistic values that still recalculate without error, e.g. n = 9.14 instead of 914 (paper 3). Check that n values are whole numbers.
- Placeholder values left in `effect_size` (e.g. 0.25 with p = 0) or in `statistic_name` (paper 443).
- Stored p-values belonging to a different comparison (paper 273).
- Values copied from the wrong cell of a figure or table (paper 383: a squash percentage entered for a gnocchi dish).
- Pooled internal meta-analysis estimates coded instead of per-study effects when the supplement has per-study M/SD/n (paper 34).
- Pre-post change within the intervention group coded as the effect in a mixed design that has a control group, ignoring the control (paper 70). Use difference-in-differences against the control. The old rows also used OR2DL on the same participants at two time points, treating them as independent groups.
- Another paper cited as precedent without checking its design: paper 62's DiD counts dishes sold (independent observations), paper 70's counts the same participants twice. Check `study_design` and `sample_notes` before reusing an approach.
