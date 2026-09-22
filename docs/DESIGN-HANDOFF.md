# Portfolio Design Handoff

This document is the source of truth for the current portfolio visual system and implementation contract.

## Product Context

- Product: personal portfolio website
- Audience: recruiters, hiring managers, collaborators, and engineers reviewing work
- Primary task: quickly understand identity, experience, projects, skills, credentials, and contact path
- Stack: static HTML, vanilla CSS, TypeScript DOM rendering, JSON content
- Entry point: `index.html`
- Stylesheet: `css/style.css`
- Content source: `data/content.json`
- Content schema: `data/schema.json`

## Design Principles

1. Keep the first viewport direct and portfolio-first: identity, role, summary, calls to action, and avatar.
2. Preserve Apple-inspired restraint: white or black canvas, light gray surfaces, blue accent, strong typography, and measured motion.
3. Prefer quiet utility over decoration. Do not add ornamental gradients, animated background glows, or nested cards.
4. Keep content data-driven. User-specific claims should come from `data/content.json` or be derived from it.
5. Maintain accessible controls and visible focus states for navigation, theme, copy, and link actions.

## Design Tokens

The active implementation defines tokens in `css/style.css`, starting near the `Design Tokens` comment.

| Token              | Light     | Dark      | Usage                                     |
| ------------------ | --------- | --------- | ----------------------------------------- |
| `--bg-primary`     | `#ffffff` | `#000000` | Page canvas, footer, primary surfaces     |
| `--bg-secondary`   | `#f5f5f7` | `#1d1d1f` | Cards, pills, nav hover, muted panels     |
| `--bg-tertiary`    | `#fafafa` | `#2c2c2e` | Secondary controls and skeletons          |
| `--text-primary`   | `#1d1d1f` | `#f5f5f7` | Headings, primary copy, labels            |
| `--text-secondary` | `#6e6e73` | `#a1a1a6` | Body copy, descriptions, inactive nav     |
| `--text-tertiary`  | `#86868b` | `#86868b` | Periods, metadata, footer copy            |
| `--accent-blue`    | `#0071e3` | `#0a84ff` | Primary buttons, focus, links, indicators |
| `--border-light`   | `#d2d2d7` | `#424245` | Dividers, cards, controls                 |

## Typography

- Font stack: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `SF Pro Display`, `SF Pro Text`, `Segoe UI`, `Roboto`, sans-serif.
- Body copy: 16px baseline, `line-height: 1.6`, no global negative letter spacing.
- Hero title: `clamp(44px, 6.6vw, 84px)`, `line-height: 1.02`, tight letter spacing.
- Section titles: `clamp(32px, 4.2vw, 48px)`, left aligned, with small monospace eyebrow via `::before`.
- Card titles: 18px, semibold, compact line height.
- Metadata and pills: 12px to 13px, subdued color.

## Layout Contract

### Header

- Sticky 64px header.
- Translucent white or black background with saturation blur.
- Left: logo mark and name.
- Center/right: section navigation on desktop.
- Mobile: hamburger button plus theme toggle; menu opens below the header.

### Hero

- Open, unframed layout.
- Left column: eyebrow, name, subtitle, summary, CTA row, data-driven profile metrics.
- Right column: avatar image on desktop; stacks below copy on mobile.
- CTA buttons should remain stable in size and wrap cleanly.
- Profile metrics must be accurate and come from `heroStats` in `data/content.json`.

### Sections

- Sections use full-width page rhythm, not floating page-level cards.
- Major content modules use simple single-level cards with 14px radius, light border, and `--bg-secondary`.
- Section spacing: 96px desktop, 72px mobile.
- Section titles are left aligned, with semantic headings preserved.

### Modules

- About: single text card.
- Experience: timeline cards, three columns on wide desktop, one column on mobile.
- Career break: an experience entry with `"kind": "break"`. It is a labelled gap in
  the timeline, not a job, so it is deliberately quieter than a real role —
  transparent card with a dashed border, no hover lift, a dashed marker in place of a
  company logo, smaller role text, and the company line set as an uppercase label.
  Breaks keep the timeline continuous so no gap reads as unexplained; they must never
  compete visually with actual positions.
- Projects: three columns desktop, two columns tablet, one column mobile.
- Skills: category cards, three columns desktop, two columns tablet, one column mobile.
- Education and certifications: compact credential cards.
- Contact: left-aligned card with social links (Email, LinkedIn, GitHub, Medium). Email is the first social entry using a `mailto:` href.

## Responsive Contract

Validate these viewports before shipping meaningful layout changes:

| Viewport                | Size        |
| ----------------------- | ----------- |
| Mobile compact          | 360 x 800   |
| Mobile standard         | 390 x 844   |
| Mobile large            | 430 x 932   |
| Foldable / small tablet | 600 x 960   |
| Tablet portrait         | 820 x 1180  |
| Tablet landscape        | 1024 x 768  |
| Laptop                  | 1366 x 768  |
| Desktop                 | 1440 x 900  |
| Wide desktop            | 1920 x 1080 |

Acceptance criteria:

- No horizontal overflow.
- Header controls remain reachable.
- Hero text and buttons do not overlap the avatar.
- Cards do not nest inside other cards.
- Long project tags wrap without resizing the card grid unexpectedly.
- Contact links open in a new tab (external URLs) or compose an email (`mailto:` links) with `noopener noreferrer`.

## Interaction Contract

- Navigation links scroll to sections and update active state.
- Mobile nav opens and closes through `#nav-toggle`; selecting a link closes it.
- Theme toggle updates `html[data-theme]`, persists manual preferences, and updates `theme-color`.
- Resume link is hidden unless `data.content.json` provides a value.
- Social and project links open in a new tab with `noopener noreferrer`.
- Section entrance animation respects `prefers-reduced-motion`.

## Content Contract

All profile content should come from `data/content.json` unless it is structural UI copy.

Data-driven fields:

- Identity: `name`, `subtitle`, `heroSummary`, `heroStats`, `avatar`
- Contact: `resume`, `socials` (including an optional `Email` mailto entry)
- Body sections: `about`, `experience`, `projects`, `skills`, `education`, `certifications`

Implementation notes:

- Empty sections are hidden by `src/render.ts`.
- New content fields should be added to `data/schema.json` and `src/types.ts`.
- Avoid hard-coded personal achievements in `index.html`; configure them in `heroStats` or derive them from other data.

## Accessibility Contract

- Keep `Skip to content` available.
- Preserve one `h1` in the hero and ordered heading hierarchy for sections.
- Controls must have accessible names: theme toggle, nav toggle, social links.
- Focus states must remain visible against light and dark themes.
- Icon-only controls require labels or titles.
- Do not rely on color alone for state when adding new interactive controls.

## Quality Gates

Run these before merging design changes:

```bash
npm run build
npm run check
npm run lint
npm test
```

For responsive verification, run a Playwright or browser pass over the viewport matrix above and confirm `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

## File Ownership

- `index.html`: semantic shell, stable IDs, structural controls, skeleton placeholders.
- `css/style.css`: design tokens, layout, responsive behavior, component styling.
- `src/render.ts`: JSON-driven DOM population and content visibility.
- `src/theme.ts`: light/dark theme behavior.
- `src/main.ts`: navigation, scrolling, section observers, and page-level interactions.
- `data/content.json`: public portfolio data.
- `data/schema.json`: content validation contract.

## Change Checklist

Before accepting future visual changes:

1. Confirm the change supports the portfolio user journey.
2. Update tokens instead of scattering one-off colors or spacing.
3. Keep static shell copy generic unless it is backed by content data.
4. Verify light and dark themes.
5. Verify desktop, tablet, and mobile layouts.
6. Run the quality gates.
7. Update this handoff and `DESIGN-MANIFEST.json` when design contracts change.
