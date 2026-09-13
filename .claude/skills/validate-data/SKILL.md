---
name: validate-data
description: Run the LIME data validation checks in r/validate.r and find effects that need attention, then triage the results. Use when the user asks to validate the Google Sheet, check for errors, or asks what still needs work.
---

# Validate data

Read `.claude/skills/lime-context.md` first.

DRAFT: `r/validate.r` was updated for the `_1`/`_2` columns but hasn't been run end to end since. Refine this skill after the first real run.

## Steps

1. **Run `r/validate.r`** with Rscript, skipping `btw_mcp_session()` (see the parse/eval trick in the context file). Its checks print their results rather than returning them, so capture each non-empty result per section.
2. **Run the effect-level attention checks**, which aren't all in validate.r yet:
   - Pooled effects (`effect_exclude` "no") missing `effect_size`, `effect_size_var`, or `effect_size_name`.
   - Pooled effects whose measure meta-analysis.r doesn't use (anything outside OR2DL, SMCC, SMD, g).
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
