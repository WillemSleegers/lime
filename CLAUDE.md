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

- **Next.js 16 App Router**: Uses the `app/` directory structure with route-based pages, Turbopack for dev, React Compiler enabled
- **React 19**: Latest version with concurrent features
- **TypeScript 5**: Fully typed codebase with strict type definitions
- **Tailwind CSS 4 + shadcn/ui**: Component library with custom styling using new `@theme` syntax
- **TanStack React Table v8**: Headless table library powering the data explorer
- **React Hook Form + Zod**: Form state management and validation
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
- `icons/` - Custom icon components
- `form/` - Custom form components
- `landing-page/` - Homepage-specific components

#### `/lib` - Utility Functions

- `types.ts` - TypeScript type definitions for all data structures
- `r-functions.ts` - WebR integration for statistical analysis
- `json-functions.ts` - Data manipulation utilities (joins, filtering)
- `data-explorer-utils.ts` - Filter and lock logic for data explorer
- `filter-schemas.ts` - Zod validation schemas for filters
- `csv-utils.ts` - CSV export functionality
- `utils.ts` - General utility functions and cn() helper

#### `/hooks` - Custom React Hooks

- `use-data-explorer-state.ts` - State management for data explorer lock system and filter coordination

#### `/assets/data` - Research Data

Static JSON files containing:

- `papers.json` - Publication metadata
- `studies.json` - Study details and sample sizes
- `interventions.json` - Intervention descriptions and categories
- `outcomes.json` - Outcome measures and methods
- `effects.json` - Effect sizes and statistical data
- `data.json` - Combined dataset for analysis
- `data-nested.json` - Hierarchical data structure
- `counts.json` - Dataset statistics and counts
- `codebook.json` - Data dictionary and variable descriptions

#### `/constants` - Application Constants

- `constants-filters.ts` - Filter options and definitions for data explorer
- `constants-meta-analysis.ts` - Meta-analysis configuration options

### Key Technical Features

#### Data Explorer System

- Multi-level tabbed interface (Papers → Studies → Interventions → Outcomes → Effects + All)
- The "All" tab provides a complete joined dataset with all levels combined for comprehensive analysis
- Cross-table filtering with "lock" functionality to maintain filters across levels
- When a level is locked, filtering at that level constrains all other levels
- Uses `semiJoin` operations from `json-functions.ts` to maintain relational integrity
- Filter validation using Zod schemas ensures type-safe filter operations
- CSV export functionality for all data levels
- State management handled by `use-data-explorer-state.ts` hook

#### Meta-Analysis Integration

- WebR integration for running R statistical packages in the browser (using WebAssembly)
- Uses `metafor` and `clubSandwich` R packages for meta-analysis
- Three-step progressive disclosure workflow:
  1. **Inclusion Criteria** - Define study selection filters
  2. **Highlights** - Review selected studies visually (unlocks after step 1)
  3. **Meta-Analysis** - View statistical results (unlocks after step 2)
- Real-time statistical computation with forest plots and publication bias testing
- Custom R code generation and execution through WebR interface
- Status indicators for computation progress

#### Type System

All data structures are strongly typed, derived from the JSON data files:

- `Data`, `Papers`, `Studies`, `Interventions`, `Outcomes`, `Effects`
- Type-safe state management with proper React setter functions
- Consistent type patterns across data levels

### Development Patterns

#### State Management

- Uses React useState with complex state objects for data management
- React Compiler enabled for automatic memoization (no manual useMemo/useCallback needed)
- Batched state updates to minimize re-renders
- Custom `use-data-explorer-state.ts` hook manages lock system and filter coordination
- Lock system maintains filter relationships across data levels using efficient Set-based lookups

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
- All page components use client-side rendering (`"use client"`) - no server components for data pages

## Testing

**No test suite currently configured.** The project does not have test commands in `package.json` or test files in the codebase.

Complex logic that would benefit from testing in future development:
- Filter operations and lock system logic (`use-data-explorer-state.ts`, `data-explorer-utils.ts`)
- JSON manipulation utilities (`json-functions.ts`)
- WebR integration and R code generation (`r-functions.ts`)
- Form validation schemas (`filter-schemas.ts`)

Consider adding unit tests for critical business logic to ensure reliability as the application grows.

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
