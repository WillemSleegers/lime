# CLAUDE.md

## Project Overview

LIME (Library of Interventions for Meat Elimination) is a Next.js application providing a database of intervention studies on reducing animal product consumption, with data exploration tools, meta-analysis (via WebR), and data visualizations.

This file holds conventions and things that aren't visible from the code. For what the app currently contains (pages, tabs, steps, columns, dependencies, scripts), read the code and `package.json` — don't rely on descriptions here or in the README.

## Conventions

- Uses pnpm
- React Compiler is enabled — don't add manual `useMemo`/`useCallback`
- Data pages are client components; there is no server-side data fetching
- Tailwind v4 config lives in `app/globals.css` (`@theme`)

## Data

The JSON in `assets/data/` is generated from the Google Sheet by `r/meta-analysis.r` — don't edit it by hand. The R scripts and data-pipeline skills are described in `.claude/skills/lime-context.md`.

## Non-obvious wiring

- **Data explorer locking**: filtering one level can constrain the others via `semiJoin` in `lib/json-functions.ts`, coordinated by `hooks/use-data-explorer-state.ts`.
- **WebR** needs cross-origin isolation headers, set per route in `next.config.ts`. A new page that runs WebR needs them too.
- **Methodology and FAQ** text lives in Markdown next to the page (`app/*/*.md`). The methodology describes how effects are calculated, so keep it in sync with `r/calculate-effects.r`.

## CSS and styling

Prefer simple solutions:

- Use `@apply` with standard Tailwind classes for custom utilities, not CSS variables or media queries
- Use Tailwind's spacing scale (`px-3`, `py-12`, `md:px-6`) instead of custom spacing systems
- Don't add variants or edge-case utilities until they're actually needed

```css
/* Good */
.page-container {
  @apply px-3 py-12 md:px-6 md:py-16 lg:px-12 lg:py-20;
}
```

Add complexity only after the simple version proves insufficient, and after discussing the tradeoff with the user.

## Accuracy requirements

Never assume what the app contains or does — verify against the code before writing documentation or descriptions (e.g. table columns in `components/data-explorer/table/columns.tsx`, data structures in `lib/types.ts`).

## Writing style (user-facing content)

Down-to-earth and practical, not promotional:

- "This page helps you browse through the papers in our database" — not "Unlock powerful insights with our advanced data exploration platform"
- Concrete examples over abstract descriptions; plain language over marketing speak

## Design philosophy

This site helps researchers and advocates find effective interventions to reduce animal product consumption — friction, confusing UI, or dense jargon here has a real cost. When touching this codebase, look for chances to improve UX, visual polish, and clarity, and push back on implementations that just meet functional requirements without actually serving users well.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
