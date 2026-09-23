# Design Handoff

Source of truth for the site's visual system and implementation contract.

## Intent

A personal site, not a resume. It says who Yashwant is in one sentence, shows who he has worked with, and presents his toolbox as a periodic table. There is no employment timeline, education or certification list; the resume covers those.

The look is quiet and typographic: neutral greys, one serif display face, hairline grids, no cards, no gradients, and almost no motion.

## Stack

- `index.html` is a generic shell with two slots: `<!--app-head-->` and `<!--app-body-->`.
- `vite.config.ts` renders `data/content.json` into those slots at build time and on each dev-server request, using `src/render.ts`. The shipped page is static HTML; nothing renders on the client.
- `src/icons.ts` (build time only) resolves each `icon` / `logo` name to inline SVG, in this order:
  1. a built-in stroke icon (`ui:globe`, `ui:phone`, `ui:tv`, `ui:gamepad`)
  2. a file in `src/icons/<name>.svg`
  3. a Simple Icons slug
- `src/main.ts` adds the theme toggle, the copy-email button and the active nav link. It's about 1 kB gzipped.

## Tokens

Defined at the top of `css/style.css`. Dark is the default theme; light uses the same token names under `:root[data-theme='light']`.

| Token           | Dark      | Light     | Use                                       |
| --------------- | --------- | --------- | ----------------------------------------- |
| `--bg`          | `#0b0b0b` | `#fbfbfa` | Page canvas                               |
| `--bg-hover`    | `#141414` | `#f1f1ef` | Hover fill on tiles and cells             |
| `--text`        | `#ededed` | `#111111` | Headings, symbols, primary text           |
| `--text-2`      | `#a3a3a3` | `#555555` | Body copy, nav, names                     |
| `--text-3`      | `#8a8a8a` | `#6e6e6e` | Metadata, numbers, footnotes (AA on --bg) |
| `--line`        | `#232323` | `#e3e3e0` | Hairlines                                 |
| `--line-strong` | `#3a3a3a` | `#c9c9c5` | Button outline, link underline            |
| `--logo`        | `#8f8f8f` | `#6a6a6a` | Resting logo colour                       |
| `--accent`      | `#8aa4ff` | `#2448d8` | Focus ring and "current focus" rule only  |
| `--status`      | `#4cc38a` | `#1a8a5a` | Status dot in the hero                    |

The accent is the only colour on the page. Don't use it for decoration.

## Typography

- Display: Instrument Serif 400, self-hosted through `@fontsource`, with a size-adjusted Georgia fallback so the swap doesn't shift layout. Used only for the hero statement and the contact line.
- UI: the system sans stack at 15px/1.6.
- Labels: the system mono stack at 12px. Section titles, meta, group heads, atomic numbers, footnotes and the legend all use it.
- Two weights only: 400 and 500.

## Layout

- The content column is 1040px max, with a gutter of `clamp(16px, 4vw, 40px)`.
- Section spacing is `clamp(72px, 10vw, 128px)`.
- Each section header is a mono title on the left and mono meta on the right. The brand wall and toolbox headers sit inside `.grid-frame`, which shrinks to the grid's width, so both align exactly with the grid edges.

## Hairline grids

The brand wall and the periodic table share one technique:

- Each cell draws its right and bottom edges outside itself with `box-shadow`, and its left and top edges inside. Neighbouring edges land on the same pixel, so every line is exactly 1px, never doubled, and ragged last rows still close.
- Column widths use `round(down, …, 1px)` against the container (`cqi`), so cells are whole pixels and lines never fall on half pixels. Tests assert this.

## Components

### Hero

- The avatar (56px, greyscale, hairline ring) sits beside the name, which is the page's only `h1`, and the role and location.
- The statement is set in the serif at `clamp(36px, 6vw, 68px)` with `text-wrap: balance`.
- Below it: the optional status dot and the GitHub and LinkedIn links.

### Worked with

- Monochrome logos in `currentColor`: `--logo` at rest, `--text` on hover. There are 7 columns from a 700px container width, 4 from 480px, and 2 below that.
- Logos are sized by equal area, not equal height (`logoSize()` in `src/render.ts`). A brand's optional `scale` corrects optically on top of that.
- A brand without a logo shows its name as a wordmark. That fallback is a designed state.
- The footnote states that client work was delivered through employers.

### Toolbox (periodic table)

- **Layout:**
  - From 700px container width, each group is a column with a fixed-height head (group number and label), and columns have different heights.
  - Below 700px, each group becomes a labelled block: 4 columns from 480px, 3 below that.
- **Cell:** square. Atomic number at top left (mono, tabular), logo at top right (14px), two-letter symbol in the middle, name at the bottom (one line, ellipsis as a last resort).
- **Current focus:** a 2px accent rule on the cell's bottom edge, with sr-only text "(current focus)". It's explained in the legend.
- **Numbering:** atomic numbers are derived from data order and never hand-maintained. `validate-schema` enforces unique symbols and valid groups.
- **Adding a tool:** add an item to `toolbox.items` with an `icon`. If a logo is only a wordmark and unreadable at 14px, leave `icon` out; a cell without a logo is valid.

### Tested on

A single wrapping row of stroke icons and labels, with a hairline above.

### Selected work

Hairline index rows, each a single link: title, a one-line description, then the language and ↗. From 720px the columns are `20rem / 1fr / 7rem`, so every row lines up.

### Contact

A large serif line with a `mailto:` link, a pill button that copies the email, and text links to each social profile.

## Interaction

- The theme defaults to dark. Only a light choice is stored (`localStorage['yd-theme']`); an inline script in `<head>` applies it before first paint. `theme-color` follows the theme.
- The nav shows Toolbox, Work and Contact. It hides below 520px, where the page is a short scroll with no menu.
- External links open in a new tab with `noopener noreferrer`.
- Motion is limited to 150ms colour transitions and smooth anchor scrolling, both disabled under `prefers-reduced-motion`.

## Viewports

Check these for horizontal overflow; the Playwright suite does it automatically:

360, 390, 430, 600, 820, 1024, 1366, 1440 and 1920 px wide.

## Logos

- Anything in `src/icons/` is single-colour and uses `currentColor`.
- Colour sources were converted with a luminance mask: white became a knockout and every other colour became solid, so knockouts work however the source file is layered.
- Wordmarks from Simple Icons (FOX, Nokia, Samsung) were tight-cropped from their square 24×24 box.
- Logos are trademarks of their owners and appear only to identify companies and tools that Yashwant has worked with or uses.
