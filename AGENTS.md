# AGENTS.md

Guidance for AI agents working in this repo. See `PRODUCT.md` for audience and tone.

## How it works

- `data/content.json` holds every personal fact. `data/schema.json` describes it and `src/types.ts` mirrors that schema; keep all three in step.
- `vite.config.ts` renders the content into `index.html` at build time using `src/render.ts`. Escape every data value with `escapeHtml`.
- `src/icons.ts` resolves `icon` and `logo` names to inline SVG, checking a built-in `ui:` icon first, then `src/icons/<name>.svg`, then Simple Icons. It runs at build time only, so never import it in browser code.
- Browser code is `src/main.ts` (window tabs, active nav link) and `src/theme.ts` (theme toggle).
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
- No email anywhere: no address, `mailto:` link or copy button. People reach out on LinkedIn, the primary button in the hero and the closing.
- **Minimal, after cursor.com:** every section must earn its space, and nothing is said twice. Order, as on cursor.com: hero, Selected work (its window is the page's focal point), Tested for, Stack, Writing, the closing contact, and a slim footer. The page is cursor.com's width: content up to 1300px wide (`--page-width`), 20px from the window's edge at every size (`--gutter`). Sections align to one left edge; the logo band and the closing are centred, as on cursor.com.
  - Warm-cream (`#f7f7f4`) or warm-dark (`#14120b`) canvas. Depth comes from filled surfaces (4px radius), not borders or rules. As on cursor.com, each filled surface (feature blocks, their panels, logo tiles, writing rows, the avatar) carries a barely-there 1px hairline, the ink at 2.5% (`--hairline`), drawn on a `::before` layer. The feature windows are the only raised things and the only shadows (`--shadow-window`, measured from cursor.com). No gradients or decorative motion; the one image is the feature panels' painted wallpaper.
  - Geist (standing in for CursorGothic, Cursor's own typeface; of the open faces it is the closest in width, x-height and cap height) at weight 400 for display type, with a metric-matched Arial fallback (`Geist Fallback`). Sizes follow cursor.com's: 26px hero (`--text-headline`), 22px section and block titles (`--text-title`), 14px captions, and one large closing line (`--text-display`, like "Try Cursor now."). Below 640px, text follows Apple's iOS text styles: Large Title (34px) for the closing line, Title 1 (28px) for the hero, Title 2 (22px) titles, Body (17px), Subheadline (15px) secondary text, Footnote (13px), and nothing under Caption 2 (11px). Every link and button is at least a 44px touch target; small links get an invisible hit area rather than a bigger box, and a test checks it. The feature windows are set like Cursor's product UI, in the system face (`--font-product`) throughout: 12px chrome (window title, file tab, breadcrumb, sidebar items), 11px secondary lines and labels, and a document with a 20px bold heading (`--text-doc-title`), 13px text and 14px semibold subheads; repo names too. No monospace face. No labels or kickers above headings. Set every `font-size` from the type-scale tokens; don't add one-off sizes.
  - Set every margin, padding and gap from the `--space-*` tokens (a 4px grid).
  - A 52px header, as on cursor.com, with nav links in ink that fade to 75% on hover; the section in view gets a quiet grey underline.
  - Buttons are pills: the primary is an ink inversion (LinkedIn), the secondary a soft fill.
- **Orange:** `--primary` is for focus rings; `--link` is for text links ("More on Medium →"). Nothing else is orange.
- **Mark:** as on cursor.com, a single-colour faceted mark in ink beside the name: a run button seen as a pyramid, its three faces at full, 55% and 28% opacity, so it follows the theme. `public/favicon.svg` is the same mark, switching to the dark theme's ink with the system setting. Safari ignores SVG favicons, so after changing it run `node scripts/favicons.mjs` to regenerate the PNG icons.
- **Hero:** avatar, then the name in ink at headline size with role and statement beneath it in grey at body size (`--text-base`), no location, the LinkedIn (primary) and GitHub buttons, and a "Tested on" line of named platforms (no generic "Smart TV"), each with its own icon. Where a platform's logo is a wordmark (Samsung, Roku, LG, Apple TV), set `wordmark` in `content.json`: the logo, cropped tight in `src/icons/`, stands in for that part of the name at cap height, standing on the baseline like the letters, and screen readers still hear the whole name. Icons are centred on the capital letters, not the line box (the `cap` unit in `css/style.css`); a test holds both to within half a pixel. Fire TV and Xbox use `ui:` icons, since Simple Icons can't carry their marks.
- **Tested for:** a cursor.com logo band: a small centred caption ("Tested for these clients") over one row of filled 100px tiles, client logos in full ink, ordered by market value (largest first; private companies placed by scale). Every logo is one height (`--logo-height`), centred in its tile; a wordmark too wide for its tile shrinks to fit. For that height to mean the same thing for every brand, crop each logo's viewBox tight to its artwork, and leave out ® marks, taglines and background tiles. Clients only: no employers line.
- **Closing:** "Get in touch." at display size, centred, with every social, LinkedIn first as the primary button.
- **Feature blocks (Selected work, Stack):** as on cursor.com, a filled block with a title and a grey body-size description on one side and an app window on a panel with a painted wallpaper on the other, alternating sides. The wallpaper is a public-domain painting (John Henry Twachtman's "Winter Harmony", National Gallery of Art, CC0) in `public/assets/wallpaper/`, never cursor.com's own. The Stack panel shows its other side, `--media` shows while it loads, and in dark mode `--media-veil` dims it. Each window's sidebar is an ARIA tab list (click, arrow keys, Home and End; `src/main.ts`) that swaps a README-style pane: repositories with their description, logos and GitHub link; toolbox groups with their tools. Everything in them comes from `content.json`. As on cursor.com, the text may end in one orange text link (Selected work: "All projects on GitHub →"), and the window is cursor.com's size: 920 × 600px, 40px from the panel's top and bottom and 32px from its inner edge. In Selected work it runs off the panel's right edge (at most 192px), the block's outer edge, and its document wraps inside the part left visible (a container query on the panel), so no text is cut off; a test checks this at iPad and laptop widths. It never runs toward the text, since in dark mode its editor pane is the block's own colour and the two would merge; and Stack's window can't run off the left without hiding its sidebar, so, as on cursor.com's reversed cards, it sits whole inside its panel. Phones keep the windows, as cursor.com does: below 768px the text sits above the panel, the window fits whole inside it, and the sidebar becomes a row of pill tabs across the top that scrolls sideways (left and right arrows too). The panels share one grid cell, so switching never changes the window's height. On desktop the window's height is fixed, so a document that outgrows it at 200% text size scrolls inside its panel; a test checks nothing is cut off.
- **Writing:** full-width filled rows: title in ink, a grey line beneath, the arrow on the right.
- Project `stack` entries must be toolbox item names; the build checks this.
- Tool logos repeat across the windows, so each is defined once as a `<symbol>` in a sprite at the top of the page and every copy is a `<use>` (see `useIcon` in `src/render.ts`). Other inlined icons get per-copy ids (see `decorate`), since one icon can appear several times, some of them in hidden panels.
- **Themes:** follow the system setting until the toggle is used; the choice is remembered. Both themes must be equally polished. Use the colour tokens in `css/style.css`, never raw colours.
- **Logos:** single-colour `currentColor` SVGs only. Focus tools and client brands show logos; when a tool has none, use the closest matching icon (see `src/icons/`). Social buttons pick up the logo named after their label in lower case (`LinkedIn` → `linkedin`).
- **Accessibility:**
  - Keep the skip link, one `h1`, visible focus rings in both themes, and support for `prefers-reduced-motion`.
  - Don't rely on colour alone to convey meaning.

## Before you finish

Run `npm run validate`. The tests check that content renders from the JSON (logos, windows, rows), the window tabs by click and keyboard on desktop and phone, that there is no email, 44px touch targets on a phone, the system theme and toggle, axe in both themes, and that nothing overflows horizontally from phone to wide desktop.

Work on a branch, and keep changes scoped.
