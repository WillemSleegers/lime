---
name: update-codebook
description: Check the LIME codebook against the actual sheet data, validation rules, and app codebook, and propose updates. Use when the user asks to review or update the codebook.
---

# Update the codebook

Read `.claude/skills/lime-context.md` first.

DRAFT: not yet used. Refine it with the user on first use.

## Steps

1. Load the Codebook tab and every sheet level with Rscript.
2. Compare four sources:
   - the Codebook tab
   - the actual sheet columns and values
   - the factor levels in `r/validate.r`
   - `assets/data/codebook.json`
3. Report:
   - Columns that exist in the sheet but aren't documented. Recent additions include the `_1`/`_2` time and statistics columns, `effect_r`, `effect_size_se`, `paper_in_paper`, and many Study-level design columns.
   - Factor levels that differ between sources. Known gaps: `paper_status` in codebook.json lacks "unscreened" and "add to website"; `effect_size_name` gained OR and g.
   - Conventions agreed in sessions that aren't written down: one pooled row per comparison, unflipped `effect_size`, estimated n marked approx. with a note, and converted rows next to reported ORs.
   - Unclear or outdated descriptions, and typos.
4. Propose revised entries as a paste-ready CSV in the Codebook tab's column order.
