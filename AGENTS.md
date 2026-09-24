# AGENTS.md

Guidance for AI agents working in this repo. See `PRODUCT.md` for audience and tone.

## How it works

- `data/content.json` holds every personal fact. `data/schema.json` describes it and `src/types.ts` mirrors that schema; keep all three in step.
- `vite.config.ts` renders the content into `index.html` at build time using `src/render.ts`. Escape every data value with `escapeHtml`.
- `src/icons.ts` resolves `icon` and `logo` names to inline SVG, checking a built-in `ui:` icon first, then `src/icons/<name>.svg`, then Simple Icons. It runs at build time only, so never import it in browser code.
- Browser code is `src/main.ts` (copy email, active nav link) and `src/theme.ts` (theme toggle).
- `css/style.css` holds the colour tokens, layout and components.

## Commands

```bash
npm run dev        # local dev server
npm run validate   # run before finishing: build + lint + tests
npm run format     # Prettier
```

`npm run build` type-checks, validates the content (schema, unique toolbox names, valid groups), then builds.

## Design rules

- This is a personal site, not a resume. Don't add job timelines, dates, education or certifications.
- Don't print the email address anywhere on the page. The Contact section's "Copy email" action copies it (falling back to `mailto:` without a clipboard).
- **Quiet and typographic:**
  - Neutral greys, hairline grids.
  - One typeface (Inter). Set every `font-size` from the type-scale tokens in `css/style.css`; don't add one-off sizes or a second font.
  - Set every margin, padding and gap from the `--space-*` tokens (a 4px grid).
  - No cards, shadows, gradients or decorative motion.
- **Accent colour:** used only for focus rings and the cell markers (employers in "Worked with", current focus in the toolbox). Markers stop short of the cell edges so neighbours stay separate, and every marker has a legend.
- **Themes:** dark is the default; light must be equally polished. Use the colour tokens in `css/style.css`, never raw colours.
- **Logos:** single-colour `currentColor` SVGs only. Every toolbox item shows a logo; when a tool has none, use the closest matching icon (see `src/icons/`). Social links pick up the logo named after their label in lower case (`LinkedIn` → `linkedin`).
- **Grids:** the brand wall and the periodic table keep whole-pixel cells and exactly-1px hairlines, drawn with `box-shadow` edges. `.container` snaps its width so both grids fill it exactly and share one right edge with every other section.
- **Accessibility:**
  - Keep the skip link, one `h1`, visible focus rings in both themes, and support for `prefers-reduced-motion`.
  - Don't rely on colour alone to convey meaning.

## Before you finish

Run `npm run validate`. The tests check that content renders from the JSON, that table cells stay square and uniform, the copy button, the theme toggle, axe in both themes, and that nothing overflows horizontally from phone to wide desktop.

Work on a branch, and keep changes scoped.
