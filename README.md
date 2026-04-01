# LIME — Library of Interventions for Meat Elimination

LIME is a web application that provides a searchable database of intervention studies focused on reducing animal product consumption. It includes tools for exploring the data, running meta-analyses, and visualizing results.

## Features

- **Data Explorer** — Browse and filter papers, studies, interventions, outcomes, and effects. Supports cross-level filtering with a lock system that maintains relational integrity across tabs. Data can be exported to CSV.
- **Meta-Analysis** — A four-step workflow for running a meta-analysis on a user-defined subset of effects. Runs entirely in the browser using WebR (R via WebAssembly), with `metafor` and `clubSandwich` for statistical computation. Results include forest plots, dot plots, and publication bias tests.
- **Moderator Analysis** — Step 4 of the meta-analysis workflow, for exploring how effect sizes vary across moderator variables.

## Development

```bash
npm install
npm run dev     # Start development server (Turbopack)
npm run build   # Production build
npm run lint    # Run ESLint
```

## Tech Stack

- **Next.js 16** (App Router, Turbopack, React Compiler)
- **React 19** with TypeScript 5
- **Tailwind CSS 4** + **shadcn/ui**
- **TanStack Table v8** for data tables
- **React Hook Form** + **Zod** for form validation
- **WebR** for in-browser R statistical computation
- **Recharts** for data visualizations

## Data

Research data is stored as static JSON files in `assets/data/`. The dataset covers papers, studies, interventions, outcomes, and effect sizes, all linked by composite keys. Types are generated from the actual data files to keep runtime and compile-time types in sync.

## Project Structure

```
app/                  # Next.js App Router pages
components/           # React components
  data-explorer/      # Data table and filter components
  meta-analysis/      # Forest plots, dot plots, meta-analysis tabs
  charts/             # Recharts-based chart components
  ui/                 # shadcn/ui base components
hooks/                # Custom React hooks
lib/                  # Types, utilities, R code generation
constants/            # Filter options and meta-analysis defaults
assets/data/          # Static JSON data files
```
