# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is a static personal portfolio website built with:

- HTML entry shell: [`index.html`](index.html)
- Build and prerender: [`vite.config.ts`](vite.config.ts)
- Styling: [`css/style.css`](css/style.css)
- TypeScript source: [`src/`](src/)
- Logos: [`src/icons/`](src/icons/) (single-colour SVGs) plus Simple Icons slugs
- Build output: `dist/` (generated, not committed)
- Content: [`data/content.json`](data/content.json)
- Content schema: [`data/schema.json`](data/schema.json)
- Tests: Playwright in `tests/`

The site is intentionally lightweight and data-driven. Personal content lives in JSON and is rendered to static HTML at build time by `src/render.ts`, never hard-coded into the HTML shell.

## Source Of Truth

Before changing layout, visual style, or component behavior, read:

1. [`docs/DESIGN-HANDOFF.md`](docs/DESIGN-HANDOFF.md)
2. [`docs/DESIGN-MANIFEST.json`](docs/DESIGN-MANIFEST.json)
3. [`README.md`](README.md)

## Common Commands

```bash
npm run build
npm run check
npm run lint
npm test
npm run validate
npm run format
```

For local preview:

```bash
npm run dev
```

Open `http://localhost:5173`. `npm run build && npm run preview` serves the production build at `http://localhost:8000`.

## Architecture Notes

- [`index.html`](index.html) is a generic shell: head basics, the pre-paint theme script, the skip link, and the `<!--app-head-->` / `<!--app-body-->` slots.
- [`vite.config.ts`](vite.config.ts) fills those slots at build time and on each dev request.
- [`src/render.ts`](src/render.ts) turns content into HTML: header, hero, brand wall, periodic table, surfaces, work, contact, footer and JSON-LD. It also hides sections that are empty or turned off in `visibility`. Escape every data value with `escapeHtml`.
- [`src/icons.ts`](src/icons.ts) resolves icon names to inline SVG. It runs at build time only; never import it, or `simple-icons`, from browser code.
- [`src/main.ts`](src/main.ts) handles copy email and the active nav link. [`src/theme.ts`](src/theme.ts) handles the theme toggle and persistence (dark default; only a light choice is stored).
- [`css/style.css`](css/style.css) owns tokens, the hairline grid technique, layout, responsive behaviour and reduced motion.
- [`data/schema.json`](data/schema.json) must be updated when content fields change, and [`src/types.ts`](src/types.ts) kept aligned with it. [`scripts/validate-schema.mjs`](scripts/validate-schema.mjs) also enforces unique toolbox symbols and valid groups.

## Design Rules

- Preserve the quiet, typographic system in [`docs/DESIGN-HANDOFF.md`](docs/DESIGN-HANDOFF.md): neutral greys, one serif display face, hairline grids.
- The accent colour is for focus rings and the "current focus" marker only.
- No cards, shadows, gradients, glows or decorative motion.
- Use the existing tokens before adding colours, spacing or radii.
- Hairline grids use the box-shadow technique and whole-pixel cells; keep both when changing a grid.
- Logos must be single-colour `currentColor` SVGs. Don't add raster or multi-colour logos.
- Maintain both themes to the same standard, and check horizontal overflow at the documented widths.

## Content Rules

- Prefer [`data/content.json`](data/content.json) for profile-specific content.
- Do not hard-code personal facts, company names, or project details in [`index.html`](index.html) or [`src/render.ts`](src/render.ts); use [`data/content.json`](data/content.json).
- This is a personal site, not a resume: don't reintroduce experience timelines, dates, education or certification lists.
- If adding a new data field:
  1. Update [`data/schema.json`](data/schema.json).
  2. Update [`src/types.ts`](src/types.ts).
  3. Render it from [`src/render.ts`](src/render.ts), escaping values.
  4. Hide or degrade gracefully when absent.
- Keep [`data/content.json`](data/content.json) valid against the schema.

## Accessibility Rules

- Preserve the skip link.
- Keep exactly one hero `h1`.
- Maintain semantic sections and heading hierarchy.
- Icon-only buttons need accessible names.
- Focus states must remain visible in both themes.
- Respect `prefers-reduced-motion`.
- Do not rely on color alone to communicate important state.

## Testing And Verification

Run at least these checks before finishing code changes:

```bash
npm run build
npm run check
npm run lint
```

Run `npm test` when changes affect:

- DOM structure
- Navigation
- Theme behavior
- Rendered content
- Contact/copy behavior
- Responsive layout that could affect visibility

For design changes, also verify:

- No horizontal overflow at 360, 390, 430, 600, 820, 1024, 1366, 1440, and 1920 widths.
- Theme toggle works, and both themes pass axe.
- Periodic table cells stay square, whole-pixel and uniform.
- Contact email, copy button and social links work.

## Generated Files

- `dist/` is Vite's build output and is not committed. Edit the sources instead.
- Avoid committing transient Playwright reports or screenshots unless the user explicitly asks for artifacts.

## Git Hygiene

- Work on a branch for feature work.
- Do not delete or revert unrelated user changes.
- Keep changes scoped to the requested task.

## Review Expectations

When reviewing changes:

- Prioritize correctness, broken behavior, accessibility regressions, data-contract issues, and missing verification.
- Prefer no finding over speculative feedback.
- Use inline comments only for discrete, actionable issues tied to a changed line.
