# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LIME (Library of Interventions for Meat Elimination) is a Next.js application providing a database of intervention studies on reducing animal product consumption, with data exploration tools, meta-analysis (via WebR), and data visualizations.

## Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS + shadcn/ui, using the `@theme` syntax
- TanStack React Table for the data explorer
- React Hook Form + Zod for forms/validation
- Recharts for charts, WebR (R via WebAssembly) for meta-analysis stats
- Research data lives as static JSON in `assets/data/`; all pages are client-rendered (`"use client"`) — no server components for data pages
- React Compiler is enabled — don't add manual `useMemo`/`useCallback`

## How it works

- **Data explorer**: tabbed Papers → Studies → Interventions → Outcomes → Effects (+ All, a full joined dataset). Levels can be "locked" so filtering one constrains the others (`semiJoin` in `json-functions.ts`, coordinated by `use-data-explorer-state.ts`).
- **Meta-analysis**: mutiple-step progressive disclosure, each unlocking after the previous. Runs `metafor`/`clubSandwich` client-side via WebR.

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

## Testing

No test suite is configured (no test command in `package.json`, no test files). Filter/lock logic, `json-functions.ts`, WebR/R code generation, and the Zod schemas are the parts most worth covering if tests get added.

## Accuracy requirements

Never assume what the app contains or does — verify against the code before writing documentation or descriptions:

- Table columns: `components/data-explorer/table/columns.tsx`
- Data structures: `lib/types.ts`
- Features: the relevant component file

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
