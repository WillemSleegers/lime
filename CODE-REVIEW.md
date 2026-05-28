# LIME — Codebase Evaluation

_Date: 2026-05-27_

Full-codebase sweep covering correctness, architecture, performance, and UI/UX. File references use clickable `file:line` links.

## Correctness bugs

### High severity

**1. `runModeratorAnalysis` runs the entire R setup twice** — [lib/r-functions.ts:118-145](lib/r-functions.ts#L118-L145)
`setup` is concatenated and `evalRRaw` is called twice (once for `levels`, once for `numbers`). Each call re-runs `vcalc`, `rma.mv`, and `robust` — doubling the most expensive computation on the page. Combine into a single `evalRRaw` (e.g. return a list, or build one numeric vector with the level codes encoded separately) so the model fits once.

**2. R-code injection via `moderatorVar`** — [lib/r-functions.ts:82-109](lib/r-functions.ts#L82-L109)
`moderatorVar` is interpolated directly into the R source: `data$${moderatorVar}` and `factor(${moderatorVar})`. Today the value comes from a typed `MODERATOR_VARIABLES` constant, but the type is `DataKeys` which is `string`, and `handleRun` accepts whatever is in state. Defensive: whitelist against `MODERATOR_VARIABLES.map(v => v.value)` before running, or pass the column via `webR.objs.globalEnv.bind` instead of string-substituting an R identifier.

**3. `Highlights` renders `NaN` / `undefined` when `data` is undefined** — [components/meta-analysis/highlights.tsx:233-239, 385, 500](components/meta-analysis/highlights.tsx#L233)
The `else` branch only initializes 5 of ~25 locals. Later JSX does `Math.round(participantsCount).toString()` and `{effectsCount}` unconditionally → renders `~NaN` and blank cells. Since `HighlightsTab` guards `Next` on `!data` but still renders `<Highlights data={data}/>`, the page can briefly mount with no data. Guard the whole block with `if (!data) return null` or wrap each card in `data && (...)`.

**4. Samples lose rows in cross-level filter** — [lib/data-explorer-utils.ts:46-48, 82](lib/data-explorer-utils.ts#L46)
Samples are keyed `paper|study|sample` in `samples.json`, but `applyFiltersToData` keys them on `paper|study` and uses `uniqueBy(["paper","study"])`. A study with two samples collapses to one. If today every study has exactly one sample this is silent, but it will break whenever that changes.

**5. `FilterStudies` uses `>` instead of `>=`** — [components/data-explorer/filters/studies.tsx:74](components/data-explorer/filters/studies.tsx#L74)
`datum.study_n > values.study_n`. Default is 1 → excludes any study with n=1, and is inconsistent with `FilterEffects` (uses `>=`) and the meta-analysis filter (also `>=`). Should be `>=`.

**6. `Counter` interval is never cleaned up on unmount** — [components/landing-page/counter.tsx:16-28](components/landing-page/counter.tsx#L16)
`setInterval` only `clearInterval`s when `frame === totalFrames`. If the component unmounts mid-animation (or `duration`/`target` changes), the interval keeps firing and calls `setCount` on an unmounted component. Return `() => clearInterval(counter)` from the effect.

**7. `PaperCarousel` timer also leaks** — [components/landing-page/paper-carousel.tsx:22-36](components/landing-page/paper-carousel.tsx#L22)
`setTimeout(..., 3000)` has no `clearTimeout` on cleanup. On `api`/`current` change, a new timer is scheduled while the old one fires once more. Over time the carousel can jump as multiple stale timers settle.

**8. `shuffle` mutates its input** — [lib/utils.ts:37-51](lib/utils.ts#L37) used by [components/landing-page/paper-carousel.tsx:19](components/landing-page/paper-carousel.tsx#L19)
`shuffle(papers)` permutes the imported `papers.json` array in place. Static JSON imports are cached singletons; any other consumer of `papers` (e.g. forest-plot-style lookups) now sees a permuted version. Use a non-mutating shuffle, or `shuffle([...papers])`.

### Medium severity

**9. `usePersistedForm` overwrites empty defaults on remount when localStorage is empty** — [hooks/use-persisted-form.ts:25-37](hooks/use-persisted-form.ts#L25)
Initial `form.reset(loadFormValues(...))` runs in an effect after first render, so RHF briefly has the constructor defaults and then is reset — fine, but the subscription writes on *every* watched change, including the reset itself. Combined with `JSON.parse` of a truncated/corrupted value silently failing in the `catch {}`, you can end up with persisted state diverging from the visible UI. Consider `useFormPersist`-style libraries or at least logging the parse error in dev.

**10. `forest-plot.tsx` matches axis ticks by string label** — [components/meta-analysis/forest-plot.tsx:237-242](components/meta-analysis/forest-plot.tsx#L237)
`effects.find(e => e.paper_label + " - " + e.effect == payload.value)` — and crucially it searches the *original full* `data.json` (`import effects from "../../assets/data/data.json"` aliased as `effects`), not the filtered data passed in. So clicking a tick in a filtered meta-analysis can open a dialog for an effect that wasn't included. Pass `data` to `CustomizedAxisTick` and look up there.

**11. `Highlights` "participantsCount" sums study `study_n` per (paper, study)** — [components/meta-analysis/highlights.tsx:55-67](components/meta-analysis/highlights.tsx#L55)
But the reducer does `Math.round(partialSum) + a` instead of `partialSum + a`, so it accumulates rounding error every iteration. Should just be `partialSum + a` then round once at display time. Also `Math.round(participantsCount)` at line 385 when `participantsCount` is undefined → `NaN`.

**12. `forest-plot.tsx` ticks have a clipping bug at line 102** — [components/meta-analysis/forest-plot.tsx:102](components/meta-analysis/forest-plot.tsx#L102)
`for (let tick = firstTick; tick <= lastTick; tick += tickInterval)` uses an exact `<=` against a float — last tick can be lost to FP error. Both `forest-plot.tsx` and `moderator-chart.tsx` re-implement tick generation; meanwhile `lib/utils.ts` already has `generateTicks`. Use it.

**13. CSV export uses `row[col] || ""` which drops `0` and `false`** — [lib/csv-utils.ts:46](lib/csv-utils.ts#L46)
`String(row[columnName] || "")` converts `0` and `false` to `""`. For an effects dataset where 0s are valid counts, this silently corrupts downloads. Use `row[col] == null ? "" : String(row[col])`.

## Architectural issues

**15. Hot-loop static-imported JSON loads everything client-side** — [app/data-explorer/page.tsx:33-39](app/data-explorer/page.tsx#L33), [components/meta-analysis/filters.tsx:29](components/meta-analysis/filters.tsx#L29)
Every page that imports `@/assets/data/*.json` ships the full JSON to the client. `data.json` is the joined dataset — likely the largest. Same with `lib/filter-counts.ts` and `constants-meta-analysis.ts` both static-importing `data.json` just to compute min/max year. Move these counts/min-max into a small pre-computed JSON (or precompute at build) so the analytics pages don't haul the entire joined dataset to compute three numbers.

**16. Filter logic is duplicated three times** — `lib/data-explorer-utils.ts` (one form), `hooks/use-filter-counts.ts::applyFilters` (another form), each `components/data-explorer/filters/*.tsx` (a third form per level). They diverge on edge cases (the `>=` vs `>` bug above is exactly this) and on null handling. Consolidate behind a single `applyFilters(data, predicates)` that all callers use.

**17. `lib/filter-schemas.ts` keeps an explicitly labeled "LEGACY" block** — [lib/filter-schemas.ts:106-172](lib/filter-schemas.ts#L106)
Comments say "Kept for backward compatibility - can be removed once all usages are migrated." There's no consumer of `outcome_subcategory_behavior` / `_intention` / `_attitude` left in the codebase (the meta-analysis form uses the unified field). Delete it — and the corresponding constants — instead of carrying it.

**18. WebR ref is `useRef<WebR>(null)` and read everywhere** — [app/meta-analysis/page.tsx:25, 121-161](app/meta-analysis/page.tsx#L25)
The init effect creates a WebR but does not destroy it on unmount or React 19 dev double-invoke. Each remount of `MetaAnalysisPage` (e.g. fast refresh) leaks a WebAssembly worker. Add a cleanup that calls `webR.current?.close()` and guards `if (!cancelled)` for the install step.

**19. `data-explorer/page.tsx`'s `Tabs` is decorative w.r.t. `level` state** — [app/data-explorer/page.tsx:61, 181-228](app/data-explorer/page.tsx#L61)
`level` state is read nowhere; `<Tabs defaultValue={level}>` only consumes the initial value. The six `onClick` handlers all just set `level` which is then ignored. Either drive `Tabs` with `value`/`onValueChange` (controlled) and use `level` to gate something, or drop the state entirely. As written it's dead code.

**20. `MODERATOR_VARIABLES` levels use `INTERVENTION_MECHANISM_OPTIONS` directly** — [constants/constants-meta-analysis.ts:70-71](constants/constants-meta-analysis.ts#L70)
But the data column `intervention_mechanism` is a comma-joined string ("information, social pressure"), so a row matches a level only via substring. The moderator UI already special-cases this with `val === level || val.includes(level)` ([moderator-analysis.tsx:65-71](components/meta-analysis/moderator-analysis.tsx#L65)), but R-side `factor(${moderatorVar}) - 1` treats the entire joined string as a single level. So clicking "information" actually models the level `"information, social pressure"`, which is wrong. This is a real correctness bug for any multi-valued moderator column.

**21. `app/FAQ/page.tsx` directory is uppercased** — [app/FAQ/](app/FAQ/) but links go to `/faq` ([app/data-explorer/page.tsx:173](app/data-explorer/page.tsx#L173), [app/meta-analysis/page.tsx:225](app/meta-analysis/page.tsx#L225)). Next will serve `/FAQ` on case-sensitive filesystems (Linux/Vercel) and 404 on `/faq`. Rename the directory to lowercase.

## Performance

**22. `Filters.tsx` calls `form.watch()` at render** — [components/meta-analysis/filters.tsx:175-176](components/meta-analysis/filters.tsx#L175)
`form.watch()` returns the whole values object and triggers a re-render on every field change; `useFilterCounts(values)` then re-runs ~18 `applyFilters(data, ...)` passes against the full dataset every keystroke. Debounce, or scope subscriptions per group.

**24. `defaults` and `min/max` for sliders recomputed each render** — every filter component does `Math.min(...data.map(...))` / `Math.max(...)` on render. Hoist to module-level constants (the JSON is static).

## UI / UX

**25. `Tabs` `data-[state=active]` classes are duplicated verbatim on every `TabsTrigger`** — [app/data-explorer/page.tsx:185-227](app/data-explorer/page.tsx#L185), same in `app/meta-analysis/page.tsx`. ~70 lines of identical class strings. Move to the `tabsTrigger` variant in `components/ui/tabs.tsx`.

**26. `setTimeout(..., 100)` for scroll-to-top after tab change** — [app/meta-analysis/page.tsx:81-117](app/meta-analysis/page.tsx#L81) (appears four times). Flaky on slower devices. Use a layout effect on `activeTab` or a ref-based approach.

**27. Forest plot Y-axis width is `longestLabel.length * 8`** — [components/meta-analysis/forest-plot.tsx:170](components/meta-analysis/forest-plot.tsx#L170). Character count × constant fails for proportional fonts. The moderator chart already does this right (canvas-measure). Reuse that helper.

**28. `console.log(status)` in render-effect** — [app/meta-analysis/page.tsx:211-213](app/meta-analysis/page.tsx#L211) and another `console.log` at line 122. Leftover debug logs.

**29. `DataTable` opts out of memoization with `"use no memo"`** — [components/data-explorer/table/data-table.tsx:50](components/data-explorer/table/data-table.tsx#L50). With React Compiler enabled project-wide, this disables it for the largest render-heavy component. There's probably a reason (TanStack Table identity issues), but it deserves a comment so a future reader doesn't remove it.

**30. ESLint disabled inline three times** — restructured all three out:

- `usePersistedForm`'s mount-only effect now uses a `useRef` gate so the deps list can be honest.
- `moderator-analysis` derives `selectedModerator` inside the effect rather than reading the outer derived value.
- The WebR `RObject` cast was made unnecessary by stringifying the moderator cell when building the subset (the value is always a string at runtime).

**31. Default form button is implicitly submit-on-Enter inside collapsibles** — none of the filter forms have an explicit `type="button"` on the close/reset secondary buttons (see filter pages). If the user presses Enter in a year-input, the form submits. Usually fine, but mixed with the "Update table" UX where the user expects to click the button.

## Smaller cleanups

- **`buildKeyMap` returns `Map<string, boolean>`** — a `Set<string>` is the natural shape ([lib/json-functions.ts:131-144](lib/json-functions.ts#L131)).
- **`semiJoin` builds a separate `keysArray` twice** — once in `buildKeyMap`, once in the caller closure. Minor.
- **`countUniqueValues`, `countValue`, etc.** in `json-functions.ts` are over-commented (every line). Comments don't add information; consider stripping.
- **`PaperCarousel` uses `key={index}`** — fine for shuffled, but if you ever paginate, beware.
- **`Tabs defaultValue={level}`** but `level` is in `useState` — Tabs only reads initial value, so this can never change after first render. Either control it or drop the state.
- **`tsconfig.tsbuildinfo` (279 KB) is checked in / present at root** — should be `.gitignore`d if not already; check `git status`.
- **`.DS_Store` in repo root** — same.
- **`TODO.md` / `TODO-data-structure.md`** — surfacing these in the repo root suggests they should be tracked as issues, not files.

## Top fixes to apply first

If you want to act on a subset, the highest-leverage are: **#1** (doubles meta-analysis runtime), **#20** (silently wrong moderator analysis for multi-value columns), **#3** (`NaN` render in highlights), **#21** (production 404 on Vercel), **#13** (silent CSV data corruption), and **#6/#7/#8** (the leak/mutation trio in the landing page).

Suggested grouping into three small, low-risk PRs:

1. **Moderator analysis correctness** — #1 + #2 + #20
2. **Correctness one-liners** — #3 + #5 + #13
3. **FAQ rename** — #21
