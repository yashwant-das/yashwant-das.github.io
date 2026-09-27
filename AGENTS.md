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
- Don't print the email address anywhere on the page. The Copy email button in the closing contact copies it, falling back to `mailto:` without a clipboard.
- **Minimal, after cursor.com:** every section must earn its space, and nothing is said twice. Order, as on cursor.com: hero, Selected work (its window is the page's focal point), Shipped for, Stack, Writing, the closing contact, and a slim footer. Sections align to one left edge; the logo band and the closing are centred, as on cursor.com.
  - Warm-cream (`#f7f7f4`) or warm-dark (`#14120b`) canvas. Depth comes from filled surfaces (4px radius), not borders or rules. The feature windows are the only raised things and the only shadows (`--shadow-window`, measured from cursor.com). No gradients or decorative motion.
  - Inter (standing in for CursorGothic) at weight 400 for display type. Sizes follow cursor.com's: 26px hero (`--text-headline`), 22px section titles and block text (`--text-title`), 14px captions, and one large closing line (`--text-display`, like "Try Cursor now."). Below 640px, text follows Apple's iOS sizes: 17px body, 15px secondary text, nothing under 11px, and every touch target at least 44px. JetBrains Mono only for repo names. No labels or kickers above headings. Set every `font-size` from the type-scale tokens; don't add one-off sizes.
  - Set every margin, padding and gap from the `--space-*` tokens (a 4px grid).
  - Buttons are pills: the primary is an ink inversion (Copy email), the secondary a soft fill.
- **Orange:** `--primary` is for the wordmark mark and focus rings; `--link` is for text links ("More on Medium →"). Nothing else is orange.
- **Hero:** avatar, then one two-tone block at headline size (the name in ink; role, place and statement in grey), the LinkedIn (primary) and GitHub buttons, and a "Tested on" line of platforms with icons. No Copy email here.
- **Shipped for:** a cursor.com logo band: a small centred caption over one row of filled 100px tiles, client logos in full ink, ordered by market value (largest first; private companies placed by scale). Employers are named in one line beneath.
- **Closing:** "Get in touch." at display size, centred, with Copy email and every social.
- **Feature blocks (Selected work, Stack):** as on cursor.com, a filled block with two-tone text on one side and an app window on a tinted `--media` panel on the other, alternating sides. Each window's sidebar is an ARIA tab list (click, arrow keys, Home and End; `src/main.ts`) that swaps a README-style pane: repositories with their description, logos and GitHub link; toolbox groups with their tools. Everything in them comes from `content.json`. Phones keep the windows, as cursor.com does: below 768px the text sits above the panel, the window fits whole inside it, and the sidebar becomes a row of pill tabs across the top that scrolls sideways (left and right arrows too). The panels share one grid cell, so switching never changes the window's height.
- **Writing:** full-width filled rows: title in ink, a grey line beneath, the arrow on the right.
- Project `stack` entries must be toolbox item names; the build checks this.
- Inlined icons get per-copy ids (see `decorate` in `src/render.ts`), since one icon can appear several times, some of them in hidden panels.
- **Themes:** follow the system setting until the toggle is used; the choice is remembered. Both themes must be equally polished. Use the colour tokens in `css/style.css`, never raw colours.
- **Logos:** single-colour `currentColor` SVGs only. Focus tools and client brands show logos; when a tool has none, use the closest matching icon (see `src/icons/`). Social buttons pick up the logo named after their label in lower case (`LinkedIn` → `linkedin`).
- **Accessibility:**
  - Keep the skip link, one `h1`, visible focus rings in both themes, and support for `prefers-reduced-motion`.
  - Don't rely on colour alone to convey meaning.

## Before you finish

Run `npm run validate`. The tests check that content renders from the JSON (logos, windows, rows), the window tabs by click and keyboard on desktop and phone, the copy buttons, the system theme and toggle, axe in both themes, and that nothing overflows horizontally from phone to wide desktop.

Work on a branch, and keep changes scoped.
