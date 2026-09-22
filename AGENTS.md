# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

This is a static personal portfolio website built with:

- HTML entry shell: [`index.html`](index.html)
- Styling: [`css/style.css`](css/style.css)
- TypeScript source: [`src/`](src/)
- Compiled browser JS: [`dist/`](dist/)
- Content: [`data/content.json`](data/content.json)
- Content schema: [`data/schema.json`](data/schema.json)
- Tests: Playwright in `tests/`

The site is intentionally lightweight and data-driven. Most personal content should be configured in JSON and rendered by TypeScript, not hard-coded into the HTML shell.

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
npm run build
npm run serve
```

Open `http://localhost:8000`.

## Architecture Notes

- [`index.html`](index.html) owns semantic structure, stable element IDs, skeleton placeholders, and controls.
- [`src/render.ts`](src/render.ts) owns data rendering from [`data/content.json`](data/content.json), dynamic sections, social links, project cards, resume visibility, contact behavior, and empty-section hiding.
- [`src/main.ts`](src/main.ts) owns navigation behavior, smooth scrolling, section observers, mobile nav, scroll-to-top, and page-level effects.
- [`src/theme.ts`](src/theme.ts) owns light/dark theme initialization, persistence, system preference handling, and `theme-color`.
- [`css/style.css`](css/style.css) owns tokens, layout, responsive behavior, component styling, loading states, and reduced-motion behavior.
- [`data/schema.json`](data/schema.json) must be updated when new content fields are introduced.
- [`src/types.ts`](src/types.ts) must be kept aligned with [`data/schema.json`](data/schema.json).

## Design Rules

- Preserve the Apple-inspired visual language documented in [`docs/DESIGN-HANDOFF.md`](docs/DESIGN-HANDOFF.md).
- Use the existing CSS tokens before adding new colors, spacing values, radii, or shadows.
- Keep sections full-width with constrained inner content; avoid floating page-level cards.
- Do not add nested cards.
- Avoid decorative background glows, gradient blobs, and nonfunctional visual noise.
- Keep hero, nav, cards, buttons, tags, contact, and footer responsive across the viewport matrix in the design handoff.
- Maintain both light and dark theme quality.
- For meaningful visual changes, check for horizontal overflow at the documented viewport widths.

## Content Rules

- Prefer [`data/content.json`](data/content.json) for profile-specific content.
- Do not hard-code personal achievements, metrics, company names, or project facts in [`index.html`](index.html); use [`data/content.json`](data/content.json) fields such as `heroStats`.
- If adding a new data field:
  1. Update [`data/schema.json`](data/schema.json).
  2. Update [`src/types.ts`](src/types.ts).
  3. Render it from [`src/render.ts`](src/render.ts).
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
- Mobile nav opens and closes.
- Theme toggle works.
- Resume link visibility still follows content data.
- Contact email and social links render correctly.

## Generated Files

- Edit TypeScript in [`src/`](src/), then run `npm run build` to update [`dist/`](dist/).
- Do not manually edit [`dist/`](dist/) unless the task explicitly requires it and TypeScript source is not involved.
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
