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
- **Minimal, after cursor.com:** every section must earn its space. Order: hero, Shipped for, Selected work, Stack, Writing, footer.
  - Warm-cream (`#f7f7f4`) or warm-dark (`#14120b`) canvas. Depth comes from filled surfaces (4px radius), not borders; the only lines are the hairlines between Stack rows. No shadows, gradients or decorative motion.
  - Inter (standing in for CursorGothic) at weight 400 for display type. JetBrains Mono only for code-like text: repo names, stacks and kickers. Set every `font-size` from the type-scale tokens; don't add one-off sizes.
  - Set every margin, padding and gap from the `--space-*` tokens (a 4px grid).
  - Buttons are pills: the primary is an ink inversion (Copy email), the secondary a soft fill.
- **Orange:** `--primary` is for the wordmark mark and focus rings; `--link` is for text links ("More on Medium →"). Nothing else is orange.
- **Hero:** name and statement read as one two-tone block, with Copy email and the LinkedIn and GitHub buttons beneath. Other socials go in the footer.
- **Shipped for:** client logos in one row; employers are named in a line beneath, not shown as logos.
- **Stack:** text, not tiles. A "Current focus" row of logo pills, one line per toolbox group, and the platforms tested on. Project cards list their `stack`, and the build checks each entry is a toolbox item.
- **Themes:** follow the system setting until the toggle is used; the choice is remembered. Both themes must be equally polished. Use the colour tokens in `css/style.css`, never raw colours.
- **Logos:** single-colour `currentColor` SVGs only. Focus tools and client brands show logos; when a tool has none, use the closest matching icon (see `src/icons/`). Social buttons pick up the logo named after their label in lower case (`LinkedIn` → `linkedin`).
- **Accessibility:**
  - Keep the skip link, one `h1`, visible focus rings in both themes, and support for `prefers-reduced-motion`.
  - Don't rely on colour alone to convey meaning.

## Before you finish

Run `npm run validate`. The tests check that content renders from the JSON (logos, stack rows, cards), the copy button, the system theme and toggle, axe in both themes, and that nothing overflows horizontally from phone to wide desktop.

Work on a branch, and keep changes scoped.
