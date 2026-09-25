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
- **Cursor-style editorial calm** (see `DESIGN.md`, adapted in `css/style.css`):
  - Warm-cream canvas and warm near-black ink; depth from hairlines and white-on-cream surfaces only. No shadows, gradients or decorative motion.
  - Inter (standing in for CursorGothic) for text, with display sizes at weight 400 and negative tracking. JetBrains Mono only on code-like surfaces: the IDE mockup, repo names, counts and meta. Set every `font-size` from the type-scale tokens; don't add one-off sizes.
  - Set every margin, padding and gap from the `--space-*` tokens (a 4px grid). Radii come from the `--radius-*` tokens: 8px for buttons and tiles, 12px for cards.
- **Orange:** `--primary` is for the wordmark mark and focus rings; `--primary-fill` (a step darker, so white labels pass AA) is for the one primary action, Copy email. Everything else uses ink or secondary buttons.
- **Timeline pastels** stay inside the hero's IDE mockup. The mockup is built from `content.json`, repeats facts stated elsewhere, and is `aria-hidden`.
- **Markers:** current focus in the toolbox inverts the tile to ink, with a legend and screen-reader text. Employers and clients are separate labelled groups rather than marked tiles.
- **Themes:** light (cream) is the default; the warm dark theme must be equally polished. Use the colour tokens in `css/style.css`, never raw colours.
- **Logos:** single-colour `currentColor` SVGs only. Every toolbox item shows a logo; when a tool has none, use the closest matching icon (see `src/icons/`). `lava`, `gionee`, `altbalaji`, `ffi` and `marquistech` in `src/icons/` are stand-in wordmarks set from Inter's outlines; swap in the official marks when available. Social links pick up the logo named after their label in lower case (`LinkedIn` → `linkedin`).
- **Toolbox grid:** tiles are whole-pixel squares, sized with `round()` against the table's container width so every row lines up.
- **Accessibility:**
  - Keep the skip link, one `h1`, visible focus rings in both themes, and support for `prefers-reduced-motion`.
  - Don't rely on colour alone to convey meaning.

## Before you finish

Run `npm run validate`. The tests check that content renders from the JSON, that table cells stay square and uniform, the copy button, the theme toggle, axe in both themes, and that nothing overflows horizontally from phone to wide desktop.

Work on a branch, and keep changes scoped.
