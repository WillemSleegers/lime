# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LIME (Library of Interventions for Meat Elimination) is a Next.js application that provides a database of intervention studies focused on reducing animal product consumption. The project features data exploration tools, meta-analysis capabilities using WebR, and data visualizations.

## Common Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

### No test commands are currently configured in package.json

## Architecture Overview

### Core Structure

- **Next.js App Router**: Uses the `app/` directory structure with route-based pages
- **TypeScript**: Fully typed codebase with strict type definitions
- **Tailwind CSS + shadcn/ui**: Component library with custom styling
- **Static Data**: Research data stored as JSON files in `assets/data/`

### Key Directories

#### `/app` - Next.js App Router Pages

- `page.tsx` - Homepage with hero section and feature overview
- `data-explorer/` - Interactive data tables with filtering and export
- `meta-analysis/` - Statistical analysis tools using WebR
- Other pages: about, FAQ, changelog, contact, contributors

#### `/components` - React Components

- `ui/` - shadcn/ui components (buttons, tables, dialogs, etc.)
- `data-explorer/` - Data table components, filters, and dialogs
- `meta-analysis/` - Statistical visualization components (forest plots, dot plots)
- `charts/` - Custom chart components using Recharts
- `navigation/` - Site navigation components

#### `/lib` - Utility Functions

- `types.ts` - TypeScript type definitions for all data structures
- `r-functions.ts` - WebR integration for statistical analysis
- `json-functions.ts` - Data manipulation utilities (joins, filtering)
- `csv-utils.ts` - CSV export functionality
- `utils.ts` - General utility functions and cn() helper

#### `/assets/data` - Research Data

Static JSON files containing:

- `papers.json` - Publication metadata
- `studies.json` - Study details and sample sizes
- `interventions.json` - Intervention descriptions and categories
- `outcomes.json` - Outcome measures and methods
- `effects.json` - Effect sizes and statistical data
- `data.json` - Combined dataset for analysis
- `codebook.json` - Data dictionary and variable descriptions

#### `/constants` - Application Constants

- Filter options and meta-analysis configurations

### Key Technical Features

#### Data Explorer System

- Multi-level tabbed interface (Papers → Studies → Interventions → Outcomes → Effects)
- Cross-table filtering with "lock" functionality to maintain filters across levels
- Uses `semiJoin` operations from `json-functions.ts` to maintain relational integrity
- CSV export functionality for all data levels

#### Meta-Analysis Integration

- WebR integration for running R statistical packages in the browser
- Uses `metafor` and `clubSandwich` R packages for meta-analysis
- Real-time statistical computation with forest plots and publication bias testing
- Custom R code generation and execution through WebR interface

#### Type System

All data structures are strongly typed, derived from the JSON data files:

- `Data`, `Papers`, `Studies`, `Interventions`, `Outcomes`, `Effects`
- Type-safe state management with proper React setter functions
- Consistent type patterns across data levels

### Development Patterns

#### State Management

- Uses React useState with complex state objects for data management
- Batched state updates to minimize re-renders
- Lock system for maintaining filter relationships across data levels

#### Component Architecture

- shadcn/ui for consistent design system
- Compound components for complex features (filters, dialogs, tables)
- Custom hooks and utilities for data manipulation

#### Data Flow

1. Static JSON data loaded at build time
2. Client-side filtering and manipulation using json-functions
3. WebR integration for server-side R statistical analysis
4. Real-time updates to visualizations and tables

## Important Notes

- The project uses WebR for statistical computation, which requires specific package installation
- Data relationships are maintained through composite keys (paper, study, intervention, outcome)
- The type system is generated from actual data files, ensuring runtime/compile-time consistency
- All statistical analysis runs client-side using WebAssembly (WebR)
