# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Quest Learner Readiness Platform

A mobile-first web application for assessing and visualizing learner readiness in Kenya's education context.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Architecture

Next.js 16 App Router (React 19), no `src/` directory. All top-level folders sit at project root.

### Folder Structure

```
/app            — Routes and page layouts (App Router)
/components
  /ui           — Primitives (shadcn/Radix). Do not put domain logic here.
  /common       — Shared composed components (headers, layouts, score displays)
  /features     — Domain-specific components grouped by feature
/services
  /data         — Static JSON data files
  *.ts          — Service wrappers (e.g., readinessService.ts)
/types          — TypeScript interfaces for the readiness domain
/hooks          — Custom React hooks for data fetching simulations
/context        — React Context providers for global state
/lib            — Utilities (cn(), etc.)
```

### Data Flow Rules

1. **Service layer is mandatory.** Components never import JSON directly. All data access goes through service wrappers in `/services`.
2. **Simulate async.** Service functions must return `Promise` and use `setTimeout` to mirror real API latency, even for static JSON.
3. **State via Context.** `LearnerProfile` and `ReadinessData` are provided globally through React Context. Consume them via custom hooks (e.g., `useReadiness()`), never import the context directly in components.
4. **Technical Layer First.** Organize by technical concern (hook → component → service), then by feature within each layer.

### Component Patterns

- shadcn/ui primitives in `/components/ui` use CVA for variants and `data-slot` attributes
- All className props merged through `cn()` from `@/lib/utils`
- `"use client"` directive on interactive components
- Compound component pattern (e.g., Card → CardHeader, CardTitle, CardContent, CardFooter)

### Path Aliases

`@/*` maps to project root:
- `@/components`, `@/components/ui`, `@/lib`, `@/hooks`, `@/services`, `@/types`, `@/context`

## Design Standards — Mobile-First Kenya

### Grid & Touch

- **8px grid system** for all spacing and sizing
- **Minimum 48×48px** touch targets for all interactive elements
- Mobile-first responsive design; test at 320px minimum width

### Color Palette

| Token              | Hex       | Usage                                    |
|--------------------|-----------|------------------------------------------|
| `--quest-primary`  | `#1E3F75` | Primary typography                       |
| `--quest-title`    | `#1E3A77` | Titles and headings                      |
| `--quest-desc`     | `#636363` | Descriptions and secondary text          |
| `--quest-link`     | `#4A4A4A` | Link text                                |
| `--quest-success`  | `#42C842` | Mastery celebration (scores > 80%)       |
| `--quest-btn-bg`   | `#FFD100` | Button backgrounds                       |
| `--quest-btn-hover`| `#1F3A77` | Button hover state                       |

### Typography

- Primary font: Inter (loaded via `next/font/google`)
- Monospace: Geist Mono

## Culture Alignment — "Always Growing"

Scores are framed with growth mindset language:

| Score Range | Label              | Visual Treatment                          |
|-------------|--------------------|-------------------------------------------|
| < 60%       | Growth Opportunity | Encouraging language, no red/failure color |
| 60–80%      | Developing         | Neutral, progress-oriented                 |
| > 80%       | Mastery            | Celebrate with Success Green (`#42C842`)   |

Never use deficit framing. Scores below threshold are opportunities, not failures.

## Stack Reference

- **Framework:** Next.js 16.1.6, React 19.2.3
- **UI:** shadcn (radix-vega style), Radix UI, Base UI
- **Styling:** Tailwind CSS v4 with OKLCH theme variables in `app/globals.css`
- **Icons:** lucide-react
- **Animation:** Framer Motion for page transitions & count-up effects
- **Charts:** Recharts via shadcn chart component
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **shadcn CLI:** Available as dev dependency; MCP server configured in `.mcp.json`

## Accessibility

- Badge text uses dark `#1E3F75` on yellow/green backgrounds for WCAG AA (white only on blue `#1E3F75` badges)
- Description text `#636363` passes AA on white at 4.6:1
- All interactive links/buttons have `focus-visible:ring-2` styles
- Skip-to-content link in layout for keyboard navigation
- Semantic landmarks: `<header role="banner">`, `<main>`, `<nav>`, `<section aria-labelledby>`
- Loading states use `role="status"`, errors use `role="alert"`
- Decorative icons use `aria-hidden="true"`, score SVG uses `role="img"` + `aria-label`
- `useCountUp` respects `prefers-reduced-motion: reduce`
