# TODO

## Code Quality

- [ ] **Resolve remaining lint warnings** — 5 warnings surfaced by `npm run lint`, none currently blocking:
  - `components/data-explorer/table/columns.tsx` — 3x `@typescript-eslint/no-explicit-any` on shared column defs (`Column<any, unknown>`) reused across different row types. Try narrowing to `Column<unknown, unknown>`; may run into TanStack Table type friction.
  - `components/data-explorer/table/data-table.tsx` and `components/meta-analysis/filters.tsx` — React Compiler skips memoization around TanStack Table's `useReactTable()` and React Hook Form's `watch()` (both flagged as "incompatible library"). No clear fix short of replacing those libraries.

## Meta-Analysis

- [ ] **Factor model for intervention mechanism moderator** — When "Exclude multi-mechanism interventions" is on, mechanism becomes a clean categorical variable. Add an option to run a single factor model across all mechanism levels simultaneously, giving predicted means for each in one chart/table, rather than picking one mechanism at a time.

## Data Quality and Coding Review

### High Priority

- [ ] **Review and validate data codings** - Go through the database systematically and check coding decisions for accuracy and consistency. Suggest improvements where appropriate.
  - Review intervention content categorizations (animal welfare, health, environment, etc.)
  - Validate intervention mechanism classifications
  - Check outcome subcategory assignments
  - Verify study design classifications
  - Review sample type categorizations
  - Suggest alternative or additional coding schemes where current ones may be inadequate

### Areas to Focus On

- Look for inconsistencies in how similar studies/interventions are coded
- Identify potential missing categories or overly broad/narrow classifications
- Check for coding errors or ambiguous cases that need clarification
- Suggest refinements to improve the utility and interpretability of the database

### Goal

Serve as a collaborator to polish, check, and improve the database quality and usability for researchers and advocates working on animal welfare interventions.
