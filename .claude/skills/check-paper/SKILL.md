---
name: check-paper
description: Check a coded LIME paper against its PDF (and supplements/raw data) for coding mistakes, and produce paste-ready corrections. Use when the user asks to check, verify, or review how a paper was coded, or when an effect size doesn't reproduce.
---

# Check a coded paper

Read `.claude/skills/lime-context.md` first, especially "Common coding errors found so far".

## Steps

1. **Gather everything in parallel.**
   - The paper's rows from every sheet level: Paper, Study, Sample, Condition, Outcome, Statistics, Effects. Include `paper_notes`, `study_notes`, `sample_notes`, `statistic_notes`, and `effect_notes`; they often explain choices.
   - The Paperbank entry, which may be a folder with a supplement, data, and an extraction script.
   - A recalculation of the stored effects with `calculate_effects()`, flagging differences > 0.001.
2. **Read the PDF sections that matter:** the method (design, how participants were assigned and split), the results text, and every table and figure used for statistics.
3. **Check, in this order:**
   - **Design and n.** Is each coded n the n of that condition? Watch for totals per dish, menu, or study. Use the paper's own arithmetic (reported Ns of pairwise tests, df, "each name received X responses") and CI widths to confirm.
   - **Statistics.** Is every value the one in the paper, from the right cell? Do counts reproduce reported percentages and tests (e.g. an omnibus χ² with `chisq.test(correct = FALSE)`)? Is `statistic_from_paper` right (yes / approx. / no)?
   - **Keys.** Do the intervention and control sides point at the right condition, sample, time, and statistics group? Are both statistics groups set?
   - **Effects.** Is the measure right for the statistics (successes/failures → OR2DL; M/SD/n → SMD; within-subject → SMCC with `effect_r`)? Do the direction and p-value belong to this comparison? Is there exactly one pooled row per comparison? In a mixed design (pre-test + control group), is each effect a difference-in-differences against the control rather than a pre-post change within one group? Collaborators often leave the intended comparisons in `statistic_notes`.
   - **Raw data**, if available: recompute M, SD, n, and r with the stated exclusions and complete pairs.
4. **Explain the likely cause** of each discrepancy before proposing a fix (e.g. old values computed from rounded percentages). When a value can't be derived exactly, present options (equal split, day share, contact authors) and let the user choose.
5. **Produce corrections** as paste-ready CSVs per level (see "Output files"). Recalculate effects from the corrected statistics in memory, before the user pastes. Show old vs new values in chat.
6. **Report:** clear errors vs judgment calls, the evidence (page, table, figure), which rows to delete before pasting, and remind the user to update `paper_status`.

## Judgment calls the user has made

- Per-condition n not reported: split the reported total equally, or by day share when days per condition are reported. Mark it approx. with a note citing the page.
- A reported pooled estimate across studies: recode per study when the supplement has M/SD/n.
- A control reported as combined groups: keep it combined, as reported, with a condition note.
- Conditions irrelevant to reducing animal products (e.g. a "humane" label): leave them out, and renumber effects from 1.
- Reported ORs from models: code them as effect rows (not statistics), then add a converted g row (see calculate-effects).
- Mixed design (pre-test + control group): code difference-in-differences against the control, not pre-post within the intervention group (paper 70).
- Counts from the same participants at two time points (binary DiD): `calculate_did_logit()` treats the time points as independent, which overstates the variance. With raw data, compute the paired variance in a paper-specific script (see lime-context, "Paper-specific scripts"); without it, keep the independent variance and say so in `effect_notes`.
- Control measured at only some time points: pool the difference-in-differences where the control exists; keep uncontrolled pre-post effects at other times as `effect_exclude` "yes" with a note (paper 140).
- Numerator and denominator counting different things (e.g. red meat packages out of shoppers entering the store, so failures = shoppers − packages): keep as successes/failures, note that it's really a rate and the proportion is approximate (paper 140). Not the same as sales as the unit (e.g. vegetarian vs meat dishes out of all dishes sold, paper 62), where every count is a sale and the proportion is valid. See TODO.md about rate-based effects.
- Beliefs about animal suffering (e.g. "Eating pork directly contributes to the suffering of pigs"): out of scope as general animal welfare attitudes; don't code effects (paper 3, outcome 3).

These calls are also described publicly in section 3 of `app/methodology/methodology.md`. Keep the two in sync when adding one.
