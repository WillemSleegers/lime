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

#### CSS and Styling Approach

**Prefer simple solutions over complex ones:**

- **Start with `@apply`**: When creating custom utility classes, use `@apply` with standard Tailwind classes instead of CSS variables or complex media queries
- **Use Tailwind's spacing scale**: Don't create custom spacing systems with CSS variables unless absolutely necessary - Tailwind's built-in scale (px-3, py-12, md:px-6, etc.) is sufficient
- **Keep globals.css minimal**: Custom utilities should be concise - if you need more than 10-15 lines for a utility, reconsider the approach
- **Avoid over-engineering**: Don't create multiple variants (X-only, Y-only) or edge-case utilities upfront - add them only when actually needed

**Example of good vs. bad approaches:**

✅ **Good - Simple and clear:**
```css
.page-container {
  @apply px-3 py-12 md:px-6 md:py-16 lg:px-12 lg:py-20;
}
```

❌ **Bad - Over-engineered:**
```css
@utility page-container {
  padding-left: var(--spacing-page-x);
  padding-right: var(--spacing-page-x);
  /* ...50+ lines of media queries and CSS variables... */
}
```

**When to add complexity:**
- Only after the simple solution proves insufficient
- When there's a clear, demonstrated need
- After discussing the tradeoffs with the user

## Important Notes

- The project uses WebR for statistical computation, which requires specific package installation
- Data relationships are maintained through composite keys (paper, study, intervention, outcome)
- The type system is generated from actual data files, ensuring runtime/compile-time consistency
- All statistical analysis runs client-side using WebAssembly (WebR)

## Design Philosophy & Critical Evaluation

This project serves a vital mission: helping researchers and advocates find effective interventions to reduce animal product consumption and, ultimately, reduce animal suffering. Given this important purpose, the website's usability and visual design directly impact its effectiveness in advancing animal welfare.

**When working on this codebase, actively evaluate and improve:**

- **User Experience**: Every friction point in the interface potentially prevents a researcher from finding crucial evidence that could inform more effective animal advocacy
- **Visual Design**: Academic tools don't need to be boring - polished, engaging interfaces build credibility and encourage deeper exploration of the data
- **Content Clarity**: Technical jargon and dense text create barriers for practitioners who could use this research to design better interventions
- **Information Architecture**: Poor organization wastes users' time and may cause them to miss important findings

**Be constructively critical of existing implementations:**
- Question whether UI components truly serve users or just meet basic functional requirements
- Identify opportunities to make academic content more accessible to practitioners and advocates
- Look for ways to highlight the most actionable insights for intervention designers
- Consider how visual hierarchy and progressive disclosure can make complex data more approachable

**Remember**: Every improvement to this platform's usability potentially amplifies its impact in reducing animal suffering by making evidence-based advocacy more accessible and effective.

## Accuracy Requirements

**NEVER make assumptions about data, features, or functionality.** Always verify before writing documentation or descriptions.

**Before writing about what the application contains or does:**
1. Use Read, Glob, or Grep tools to examine the actual codebase
2. For data descriptions: check table columns in `/components/data-explorer/table-columns.tsx`
3. For features: verify implementations exist in relevant component files
4. For data structures: review types in `/lib/types.ts`
5. For functionality: search for actual implementations rather than assuming they exist

**Never write descriptions based on:**
- What "should" be included
- What seems reasonable
- Generic assumptions about research databases
- What other similar tools typically have

**Always base descriptions on:**
- Actual code implementations you can verify
- Real data structures and column definitions in the codebase
- Features that demonstrably exist

This is critical because inaccurate documentation directly undermines the platform's mission of making animal welfare research accessible and effective.

## Writing Style Guidelines

When writing user-facing content (help text, instructions, descriptions, etc.), use a **down-to-earth, practical style**:

- **Be helpful and informative** rather than promotional or hype-driven
- **Use plain language** that practitioners and researchers can easily understand
- **Provide concrete examples** instead of abstract descriptions
- **Focus on practical guidance** - tell users what they can actually do and how
- **Avoid marketing speak** like "powerful tools" or "cutting-edge features"
- **Use conversational tone** as if explaining to a colleague

**Good examples:**
- "This page helps you browse through the papers in our database"
- "You might filter papers by publication year, or studies by sample size"
- "The 'All' option gives you a complete dataset with everything joined together"

**Avoid:**
- "Unlock powerful insights with our advanced data exploration platform"
- "Seamlessly navigate through comprehensive research datasets"
- "Experience next-generation research discovery tools"
