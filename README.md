# LIME — Library of Interventions for Meat Elimination

LIME is a web application that provides a searchable database of intervention studies focused on reducing animal product consumption. It includes tools for exploring the data, running meta-analyses, and visualizing results.

## Features

- **Data Explorer** — Browse and filter the database at each level, from papers down to individual effects. Filters on one level can be locked to narrow down the others, and data can be exported to CSV.
- **Meta-Analysis** — Run a meta-analysis on a subset of effects you choose, including moderator analyses and publication bias tests. It runs entirely in the browser using WebR (R via WebAssembly) with `metafor` and `clubSandwich`.

## Development

Built with Next.js, Tailwind CSS, and shadcn/ui. See `package.json` for dependencies and scripts.

```sh
pnpm install
pnpm dev
```

The data in `assets/data/` is generated from the project's Google Sheet by the scripts in `r/`.
