---
name: Yashwant Das
description: A calm personal site on a warm canvas, after cursor.com, where two app windows show the work.
colors:
  canvas: '#f7f7f4'
  surface: '#f2f1ed'
  surface-hover: '#ebeae5'
  fill: '#e6e5e0'
  fill-hover: '#dcdbd5'
  line: 'rgba(38, 37, 30, 0.1)'
  hairline: 'color-mix(in oklab, #26251e 2.5%, transparent)'
  ink: '#26251e'
  ink-hover: '#3b3a31'
  muted: '#66655e'
  on-ink: '#f7f7f4'
  media: '#d9d5cf'
  window-chrome: '#f2f1ed'
  window-editor: '#f7f7f4'
  primary: '#f54e00'
  link: '#b83a00'
  success: '#1f8a65'
  canvas-dark: '#14120b'
  surface-dark: '#1b1913'
  surface-hover-dark: '#221f19'
  fill-dark: '#26241e'
  fill-hover-dark: '#302e27'
  line-dark: 'rgba(237, 236, 236, 0.1)'
  ink-dark: '#edecec'
  ink-hover-dark: '#d7d5cf'
  muted-dark: '#9a988f'
  on-ink-dark: '#14120b'
  media-dark: '#4a443b'
  media-veil-dark: 'rgba(20, 18, 11, 0.68)'
  link-dark: '#f54e00'
  success-dark: '#3fb68b'
typography:
  display:
    fontFamily: "'Geist Variable', 'Geist Fallback', system-ui, sans-serif"
    fontSize: 72px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.03em
  headline:
    fontFamily: "'Geist Variable', 'Geist Fallback', system-ui, sans-serif"
    fontSize: 26px
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: -0.0125em
  title:
    fontFamily: "'Geist Variable', 'Geist Fallback', system-ui, sans-serif"
    fontSize: 22px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.005em
  body:
    fontFamily: "'Geist Variable', 'Geist Fallback', system-ui, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "'Geist Variable', 'Geist Fallback', system-ui, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "'Geist Variable', 'Geist Fallback', system-ui, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  doc-title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.55
  doc-body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
  ui:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  ui-label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.04em
rounded:
  sm: 4px
  md: 8px
  window: 10px
  pill: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '7': 32px
  '8': 48px
  '9': 64px
  '10': 96px
components:
  header:
    backgroundColor: '{colors.canvas}'
    textColor: '{colors.ink}'
    typography: '{typography.body-sm}'
    height: 52px
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.on-ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: 0 20px
    height: 44px
  button-primary-hover:
    backgroundColor: '{colors.ink-hover}'
  button-secondary:
    backgroundColor: '{colors.fill}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.pill}'
    padding: 0 20px
    height: 44px
  button-secondary-hover:
    backgroundColor: '{colors.fill-hover}'
  text-link:
    textColor: '{colors.link}'
    typography: '{typography.body}'
  feature-block:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.sm}'
    padding: 16px
  window:
    backgroundColor: '{colors.window-chrome}'
    textColor: '{colors.ink}'
    typography: '{typography.ui}'
    rounded: '{rounded.window}'
    width: 920px
    height: 600px
  window-tab:
    textColor: '{colors.ink}'
    typography: '{typography.ui}'
    rounded: '{rounded.md}'
    padding: 8px
  window-tab-selected:
    backgroundColor: '{colors.fill}'
  window-tab-phone:
    typography: '{typography.body-sm}'
    rounded: '{rounded.pill}'
    padding: 0 16px
    height: 44px
  logo-tile:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sm}'
    height: 100px
  writing-row:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.sm}'
    padding: 20px 24px
  writing-row-hover:
    backgroundColor: '{colors.surface-hover}'
  footer:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.muted}'
    typography: '{typography.caption}'
    padding: 32px 20px
---

# Design System: Yashwant Das

## Overview

**Creative North Star: "The Quiet Workbench"**

The page is a warm surface with the work laid out on it. Nothing raises its voice: the canvas is cream or warm near-black, type sits at weight 400, and depth comes from filled surfaces a shade off the canvas rather than from borders or shadows. The craft shows in precision, not decoration: one left edge for every section, a 4px spacing grid, one type scale, and logos cropped tight so that one height means the same thing for every brand.

The language is borrowed from cursor.com and stays with it: a 1300px page with a 20px gutter, a 52px header, pill buttons, a centred logo band, and feature blocks that pair a short text with an app window on a painted wallpaper. Those two windows (Selected work and Stack) are the only raised objects and the page's focal point. They are real controls: tab lists that swap a README-style document, set in the system face like Cursor's own product UI.

Light and dark are equals. The theme follows the system until the toggle is used, every colour has a dark counterpart, and the wallpaper is veiled in dark mode so the windows still lead.

**Key Characteristics:**

- Warm cream (#f7f7f4) or warm near-black (#14120b) canvas; never pure white or grey.
- Weight 400 for every heading, from the 22px titles to the 72px closing line.
- Filled surfaces with a barely-there 1px hairline (the ink at 2.5%) instead of borders.
- Two app windows, the only shadows on the page.
- Orange only for focus rings and text links.
- One public-domain painting (Twachtman's "Winter Harmony") as the windows' wallpaper, and no other imagery.

## Colors

A warm neutral ramp from cream to graphite, with one orange that is never a fill.

### Primary

- **Signal Orange** (`{colors.primary}`): the focus ring, in both themes. It clears 3:1 against every surface a ring sits on.
- **Rust Link** (`{colors.link}`, `{colors.link-dark}` in dark): text links that close a block, like "All projects on GitHub →" and "More on Medium →". Darker than Signal Orange in light mode so it passes 4.5:1 as text.

### Neutral

- **Cream Canvas** (`{colors.canvas}` / `{colors.canvas-dark}`): the page floor and the header.
- **Paper Surface** (`{colors.surface}` / `{colors.surface-dark}`): feature blocks, logo tiles, writing rows and the footer. Hover lifts it one step (`{colors.surface-hover}`).
- **Soft Fill** (`{colors.fill}` / `{colors.fill-dark}`): secondary buttons, the selected window tab and the theme toggle's hover.
- **Warm Graphite** (`{colors.ink}` / `{colors.ink-dark}`): all text and logos, and the primary button's fill.
- **Stone Grey** (`{colors.muted}` / `{colors.muted-dark}`): secondary text. It passes 4.5:1 on every surface, including the selected tab's fill.
- **Hairline** (`{colors.hairline}`): the 1px edge on filled surfaces, drawn on a `::before` layer so it never shifts layout. **Line** (`{colors.line}`) is the stronger divider inside the windows.
- **Wallpaper Tint** (`{colors.media}` / `{colors.media-dark}`): shows behind the wallpaper while it loads; in dark mode a veil (`{colors.media-veil-dark}`) dims the painting.
- **Status Green** (`{colors.success}`): the status dot only.

### Named Rules

**The One Orange Rule.** Orange marks focus and text links, and nothing else. No orange fills, borders, icons or headings.

**The Token-Only Rule.** Every colour comes from a token in `css/style.css` with a value for both themes. No raw colours in components.

## Typography

**Display and body font:** Geist Variable, standing in for CursorGothic (Cursor's own typeface, which isn't ours to use). Of the open faces, Geist is the closest match: within 0.3% of its width, with the same x-height and cap height. A metric-matched Arial fallback keeps the swap from shifting layout.
**Product font:** the system face (`system-ui`), inside the windows only.

**Character:** one quiet sans at one weight for the page, so size alone sets the hierarchy; the windows switch to the platform's own face so they read as software, not as a page.

### Hierarchy

Sizes are cursor.com's from 640px up. Below 640px they follow Apple's iOS text styles, given in brackets.

- **Display** (400, 72px from 1024px, 56px from 640px [34px Large Title], 1.1, -0.03em): the closing "Get in touch." only.
- **Headline** (400, 26px [28px Title 1], 1.25): the name in the hero.
- **Title** (400, 22px, 1.3): section and feature-block titles.
- **Body** (400, 16px [17px], 1.5): hero and feature descriptions, buttons, writing-row titles.
- **Body small** (400, 14px [15px], 1.5): nav, secondary lines, the logo band's caption.
- **Caption** (400, 13px, 1.5): the footer.
- **Window type**, system face: 20px bold document heading, 13px document text (1.55), 14px semibold subheads, 12px chrome, 11px labels and secondary lines.

### Named Rules

**The Flat Weight Rule.** Headings are weight 400. Size, not weight, makes hierarchy; only the windows' document headings are bold, because they imitate a README.

**The Scale-Only Rule.** Every `font-size` is a type-scale token. No one-off sizes, and nothing below 11px.

**The No-Kicker Rule.** No labels or eyebrows above headings.

## Layout

The page is up to 1300px wide (`--page-width`) with a 20px gutter at every size, centred. Sections share one left edge; only the logo band and the closing are centred. Order: hero, Selected work, Tested for, Stack, Writing, the closing, a slim footer.

Spacing uses a 4px grid (`{spacing.1}` to `{spacing.10}`). Sections are 96px apart from 640px up and 64px on phones; the closing gets one and a half times that.

Feature blocks are one column below 1024px and a 1:2 split above it, alternating sides. Below 768px the text sits above the panel, the window fits inside it, and its sidebar becomes a row of pill tabs that scrolls sideways.

From 768px the window is 920 × 600px, 40px from the panel's top and bottom and 32px from its inner edge. In Selected work it runs off the panel's outer edge (by at most 192px). The window's document is capped to the part left visible (a container query on the panel, minus the 208px sidebar), so no text is ever cut off. Stack's window sits whole inside its panel.

Breakpoints: 390px (nav hides), 560px (header and logo band), 640px (type and touch sizes), 768px (windows), 1024px (split blocks, single-row logo band).

## Elevation & Depth

Depth is tonal: surfaces sit one shade off the canvas, with a 1px hairline in the ink at 2.5%. There is one shadow on the page, and it belongs to the app windows.

### Shadow Vocabulary

- **Window** (`box-shadow: 0 28px 70px rgba(0,0,0,0.14), 0 14px 32px rgba(0,0,0,0.1), 0 0 0 1px var(--line)`): measured from cursor.com; the two feature windows only.

### Named Rules

**The Two Windows Rule.** Only the feature windows are raised. Everything else is flat, so the eye goes to the work.

## Shapes

Corners are small and exact. Filled surfaces (feature blocks, panels, logo tiles, writing rows) use 4px. Window tabs use 8px, the windows themselves 10px. Buttons, the theme toggle, phone tabs and the skip link are full pills. The avatar is the one circle.

## Components

Quiet and precise: soft fills, exact edges, and small state changes.

### Buttons

- **Shape:** full pill (`{rounded.pill}`), 44px high, 20px side padding.
- **Primary:** an ink inversion, Warm Graphite with canvas-coloured text; it is LinkedIn, the one way to get in touch, in the hero and the closing.
- **Secondary:** Soft Fill with ink text, for every other profile.
- **Hover / Focus:** the fill steps one shade over 150ms; the ↗ arrow stays put. Focus is a 2px Signal Orange ring, 2px out.
- Each social button leads with its logo, named after its label in lower case.

### Text links

Rust Link at body size, ending in "→", which nudges 2px right on hover. One per block at most.

### Navigation

A 52px sticky header on the canvas: the mark and name on the left, three section links centred, the theme toggle on the right. Links are ink and fade to 75% on hover; the section in view gets a 1px Stone Grey underline, 6px below the text. Below 640px the links get invisible 44px hit areas and the toggle is a full 44px button; below 390px only the name and toggle remain.

### Logo band

A centred 14px caption over one row of 100px tiles on Paper Surface, client logos in full ink, all one height (26px, or 22px below 560px, where the row wraps to two columns), ordered by market value.

### Writing rows

Full-width Paper Surface strips 4px apart: the title in ink, a grey line beneath, a ↗ on the right that turns ink on hover.

### App windows (signature)

A 10px-cornered frame on Window Chrome with three grey dots and a centred title, a 208px sidebar that is an ARIA tab list (click, arrows, Home and End), and an editor pane with a file tab, a breadcrumb and a README-style document. The selected tab takes Soft Fill. A document that outgrows the window (at large text sizes) scrolls inside its panel rather than being cut off. Tool logos inside come from one SVG sprite. On phones the frame stays, and the sidebar becomes 44px pill tabs; all panels share one grid cell so switching never changes the window's height.

## Do's and Don'ts

### Do:

- **Do** take every colour, size, space and radius from the tokens in `css/style.css`.
- **Do** give every new filled surface the 2.5% hairline on a `::before` layer.
- **Do** crop logos tight to their artwork and render them as single-colour `currentColor` SVGs.
- **Do** make every link and button at least a 44px touch target below 640px, with an invisible hit area for small text links.
- **Do** check both themes; a change is finished only when light and dark are equally polished.

### Don't:

- **Don't** use orange for anything but focus rings and text links.
- **Don't** add shadows outside the two feature windows, or borders and rules between sections.
- **Don't** bold a heading, or put a label above one.
- **Don't** add gradients, decorative motion or imagery beyond the windows' wallpaper.
- **Don't** let a window run toward its block's text, or let its document run past the panel's edge.
- **Don't** use cursor.com's own wallpaper or marks.
