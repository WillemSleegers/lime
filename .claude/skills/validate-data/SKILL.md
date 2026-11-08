---
name: validate-data
description: Run the LIME data checks in r/validate.r, for every sheet or just some, then triage what they find and offer fixes. Use when the user asks to validate the Google Sheet or data, check for errors, or asks what still needs fixing.
---

# Validate data

Read `.claude/skills/lime-context.md` first.

## Steps

1. **Run the checks** from the repo root and save the output in the scratchpad:
   ```sh
   Rscript r/validate-report.r > <scratchpad>/validation.txt 2>&1
   ```
   To check only some sheets, name their sections: `Rscript r/validate-report.r Study-level "Paper status"`. Each check that finds something is printed under the comment above it in validate.r (or its first line of code) and its line number, with the result as CSV. `.row` is the row in the sheet. A full pass takes about a minute and can print a few thousand lines, so read it in parts. Report any `== ERROR` blocks first: a check that fails hides what it would have found.
2. **Read each flagged check** in validate.r at its line. The comment says what the check looks for, often when a hit isn't an error (e.g. n larger than `sample_n` because n counts meals), and sometimes how to fix it (e.g. cells shown as dates need plain-text formatting before retyping). When the output doesn't settle whether a hit is an error, look at the paper's rows or its PDF.
3. **Report per issue:** the check, the affected papers and sheet rows, the likely cause, and the suggested fix. Group hits that are likely fine separately, with the reason, so they don't bury real issues. Order by severity:
   - effects that are wrong: they don't reproduce, have the wrong sign, or fall outside their interval
   - paper status that doesn't match the website: included papers without a usable effect or with undecided effects, other papers with pooled effects
   - missing data: required cells, missing statistics or effect sizes
   - structure and formatting: keys, numbering, lookups, factor levels, formula errors, spaces, dates
4. **Offer fixes, then ask what's next.**
   - Mechanical fixes (misspelled factor levels, extra spaces, typed-over lookups): propose old → new per cell in chat, and after the user approves, write paste-ready CSVs per sheet (see "Output files" in the context file).
   - Issues that need the paper: ask which paper to work on, then switch to check-paper (coding mistakes, effects that don't reproduce), calculate-effects (pooled effects without an effect size), or draft-effects (papers with statistics but no effects).
