---
name: validate-data
description: Run the LIME data validation checks in r/validate.r and find effects that need attention, then triage the results. Use when the user asks to validate the Google Sheet, check for errors, or asks what still needs work.
---

# Validate data

Read `.claude/skills/lime-context.md` first.

DRAFT: `r/validate.r` was updated for the `_1`/`_2` columns but hasn't been run end to end since. Refine this skill after the first real run.

## Steps

1. **Run `r/validate.r`** with Rscript, skipping `btw_mcp_session()` (see the parse/eval trick in the context file). Its checks print their results rather than returning them, so capture each non-empty result per section. To run one section (e.g. when the user asks for just the Study-level sheet), save this runner in the scratchpad and run it from the repo root with `Rscript <runner> "Study-level"`. It runs everything before the first `# Validation:` header (setup, functions, codebook, import), then only the named section, and prints each non-empty result with its line in validate.r:
   ```r
   options(width = 200)
   section <- commandArgs(trailingOnly = TRUE)[1]
   src <- readLines("r/validate.r")
   headers <- grep("^# Validation: ", src)
   start <- grep(paste0("^# Validation: ", section, " "), src)
   end <- c(headers, length(src) + 1)[match(start, headers) + 1]
   exprs <- parse("r/validate.r", keep.source = TRUE)
   lines <- vapply(attr(exprs, "srcref"), \(s) s[1], integer(1))
   for (i in seq_along(exprs)) {
     in_section <- lines[i] >= start && lines[i] < end
     if (lines[i] >= headers[1] && !in_section) next
     if (identical(deparse(exprs[[i]]), "btw_mcp_session()")) next
     if (lines[i] >= min(grep("^# Import data", src)) && !exists(".authed")) {
       googlesheets4::gs4_auth(email = "*@me.com")
       .authed <- TRUE
     }
     res <- withVisible(eval(exprs[[i]], globalenv()))
     v <- res$value
     if (!in_section || !res$visible || length(v) == 0) next
     if (is.data.frame(v) && nrow(v) == 0) next
     cat("\n=== line", lines[i], "===\n")
     if (is.data.frame(v)) print(v, n = Inf, width = Inf) else print(v)
   }
   ```
   Importing reads every sheet, so a run takes a few minutes. Filter the `✔`/`ℹ` googlesheets4 messages from the output.
2. **Run the effect-level attention checks**, which aren't all in validate.r yet:
   - Pooled effects (`effect_exclude` "no") missing `effect_size`, `effect_size_var`, or `effect_size_name`.
   - Pooled effects whose measure meta-analysis.r doesn't use (anything outside OR2DL, OR2DL DiD, SMCC, SMD, SMD DiD, g).
   - `effect_exclude` "maybe" or empty, joined with `paper_status` (flag it when the paper is already "included").
   - More than one pooled row per comparison (paper, study, outcome, conditions, times, samples).
   - Intervention and control using the same statistics group (except one-sample SMCC without `effect_r`).
   - A recalculation of all stored effects with `calculate_effects()`, flagging differences > 0.001.
   - "included" papers with no pooled effect.
3. **Report per issue:** the check, the affected papers and rows, the likely cause, and the suggested fix. Order by severity:
   - wrong effect sizes or direction
   - included papers with unresolved effects
   - missing effects
   - structural issues and factor levels
4. **Ask which paper to work on**, then switch to check-paper or calculate-effects.

## Known state (2026-09-13)

- Trailing empty rows with `#REF!` exist in Effects-level (54) and Statistics-level (125). The user needs to delete them as whole rows.
- `validate.r` factor levels now include OR, g, Fisher's exact test, Logistic regression, and z. Variants like "χ²" and "Welch's two sample t-test" (without the hyphen) are still in the sheet and will be flagged.
