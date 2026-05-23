# TODO: Data Structure Update Issues

## Resolved

- `intervention_content` removed throughout ✓
- `control_description` removed throughout ✓
- `sample_intervention` / `sample_intervention_n` / `sample_control` / `sample_control_n` removed ✓
- `intervention_condition` → `condition` rename in `interventions.json` handled ✓
- `effect_p` removed — confirmed no code references it ✓
- `sample_description` column removed from `ColumnsSamples` ✓
- Effect dialog updated with `intervention_sample_n`, `intervention_sample_description`, `control_sample_n`, `control_sample_description` ✓

---

## Outstanding

### 1. Nullable effect size guards

15 effects in `effects.json` currently have `null` effect sizes. Nullable guards were added as a workaround. Once the data is cleaned, remove these:

- [ ] `components/data-explorer/filters/effects.tsx` — `s != null` check in `onSubmit`
- [ ] `components/meta-analysis/dot-plot.tsx` — `validData` filter
- [ ] `components/meta-analysis/forest-plot.tsx` — `validData` filter
- [ ] `components/meta-analysis/publication-bias.tsx` — null filter on `effect_size` and `effect_size_se`
- [ ] `components/meta-analysis/effect-dialog-content.tsx` — `effect.effect_size != null` guard
- [ ] `components/meta-analysis/highlights.tsx` — `datum.sample_country` null guard
- [ ] `hooks/use-filter-counts.ts` — `d.sample_country != null` guard

### 2. Samples tab data source

`displayData.samples` is currently extracted from `data.json` rows (via `applyFiltersToData`), cast as `Samples`. But `samples.json` has fields not in `data.json` (`sample_n`, `sample_description`). The samples tab is missing those fields as a result.

- [ ] Decide whether to join `samples.json` data into the display pipeline, or keep extracting from `data.json`
- [ ] If joining: update `applyFiltersToData` and the data explorer state to merge `samples.json` fields by `paper|study` key
