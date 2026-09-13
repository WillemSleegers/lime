---
name: code-paper
description: Draft the coding of a new LIME paper from its PDF into paste-ready rows for each sheet level. Use when the user asks to code a paper or a paper has status "ready to code".
---

# Code a new paper

Read `.claude/skills/lime-context.md` first.

DRAFT: not yet tried end to end with the user. Refine it after the first real use.

## Steps

1. **Gather in parallel.**
   - The PDF, and the folder if there is one, with its supplement and data.
   - The Codebook tab.
   - The allowed levels in `r/validate.r`.
   - The existing rows for this paper, if partly coded.
   - One fully coded paper with a similar design as a template: paper 2 (between, repeated measures) or paper 34 (between, several studies, from a supplement).
2. **Decide the structure with the user before drafting rows:**
   - which studies to include
   - which conditions count as interventions and which as controls (e.g. suboptimal default menus as controls)
   - which outcomes and time points
   - which comparisons become effects
3. **Draft rows for every level**, copying columns from `read_sheet` so the order matches:
   - **Study:** `study_n` after exclusions.
   - **Sample:** a `(total)` sample, then one per condition (per period if relevant), with n, gender, and age where reported.
   - **Condition:** descriptions of what participants actually saw, plus mechanism and medium from the allowed levels.
   - **Outcome:** item wording and scale in `outcome_notes` / `outcome_scale`, and `outcome_expectation`.
   - **Statistics:** one group per condition × sample × outcome × time. `statistics` is numbered across the paper, `statistic` within the group. Prefer counts (successes/failures/n) or M/SD/n. Set `statistic_from_paper`.
   - **Effects:** both `intervention_statistics_1` and `control_statistics_1` set, `effect` numbered across the paper, measure set, then calculated with `calculate_effects()`.
4. Note the source (page, table, figure) of every value in the notes columns, and flag values that needed judgment.
5. Check the draft the same way check-paper checks a coded paper: n per condition, counts vs reported tests, keys.
6. Write one CSV per level to `r/output/<paper>-<level>.csv` and suggest the `paper_status` to set.
