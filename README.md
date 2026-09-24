# Personal Portfolio - Yashwant Das

[![Deployment](https://github.com/yashwant-das/yashwant-das.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/yashwant-das/yashwant-das.github.io/actions/workflows/deploy.yml)
[![Pages](https://img.shields.io/github/deployments/yashwant-das/yashwant-das.github.io/github-pages?label=GitHub%20Pages&logo=github)](https://yashwant-das.github.io)

A quiet, typographic personal site: who I am in one sentence, who I've worked with, and my toolbox set as a periodic table. Built with Vite and TypeScript and rendered to static HTML at build time.

## Overview

- **Not a resume.** No employment timeline or bullet lists; the resume covers those.
- **Data-driven.** Every personal fact lives in `data/content.json`, validated by `data/schema.json`.
- **Static output.** `vite.config.ts` renders the content into `index.html` at build time, so the page needs no client-side rendering and has no loading states.
- **Dark first, light as an equal.** Both themes are tested for contrast and accessibility.

## Local development

```bash
npm ci
npm run dev       # http://localhost:5173, reloads on content or icon changes
npm run build     # static site in dist/
npm run preview   # serve dist/ at http://localhost:8000
```

## Quality gates

```bash
npm run validate          # everything below, in order
npm run build
npm run check             # types
npm run validate:schema   # content.json against schema.json, plus unique symbols
npm run lint
npm run format:check
npm run audit
npm test                  # Playwright: content, periodic table geometry, a11y in both themes, overflow
```

## Editing content

Edit `data/content.json`. The main fields:

- `statement`: the one sentence in the hero.
- `brands.items`: companies, each with a `kind` (`client` or `employer`), an optional `logo` and an optional optical `scale`.
- `toolbox.groups` / `toolbox.items`: the periodic table. Give each item a unique two-letter `symbol`, a `group`, an optional `icon`, and `focus: true` to mark current focus. Atomic numbers follow data order.
- `surfaces`, `projects`, `contact`.

### Logos and icons

An `icon` or `logo` name resolves in this order:

1. a built-in stroke icon (`ui:globe`, `ui:phone`, `ui:tv`, `ui:gamepad`)
2. `src/icons/<name>.svg`
3. a [Simple Icons](https://simpleicons.org) slug

Files in `src/icons/` must be single-colour and paint with `currentColor`. If a name doesn't resolve, the build logs a warning and renders a text fallback.

## Design handoff

See [`docs/DESIGN-HANDOFF.md`](docs/DESIGN-HANDOFF.md) and [`docs/DESIGN-MANIFEST.json`](docs/DESIGN-MANIFEST.json).

## Deployment

Pushing to `main` runs the quality gates, then publishes `dist/` to GitHub Pages ([workflow](.github/workflows/deploy.yml)).

## Project structure

```
├── index.html            # Shell with <!--app-head--> / <!--app-body--> slots
├── vite.config.ts        # Build-time renderer plugin
├── src/
│   ├── render.ts         # content.json -> HTML (build time)
│   ├── icons.ts          # icon/logo resolver (build time)
│   ├── icons/            # single-colour logo SVGs
│   ├── main.ts           # browser: copy email, active nav
│   ├── theme.ts          # browser: theme toggle
│   └── types.ts          # mirrors data/schema.json
├── css/style.css
├── data/                 # content.json + schema.json
├── public/               # avatar, favicon (copied as-is)
├── tests/                # Playwright
└── docs/                 # design handoff
```

## Future Enhancements

See [`docs/FUTURE-ENHANCEMENTS.md`](docs/FUTURE-ENHANCEMENTS.md) for scoped, non-blocking improvements that preserve the current architecture and design contract.

## ⚖️ License

© 2026 Yashwant Das. All Rights Reserved.

This repository contains my personal portfolio. The design, content, and media assets are my intellectual property. Unauthorized use, reproduction, or distribution is strictly prohibited.

Company and tool logos are trademarks of their respective owners and are shown only to identify organisations and tools I have worked with.
