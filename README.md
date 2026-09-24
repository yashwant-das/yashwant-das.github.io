# yashwant-das.github.io

[![Deploy](https://github.com/yashwant-das/yashwant-das.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/yashwant-das/yashwant-das.github.io/actions/workflows/deploy.yml)

My personal site: who I am, who I've worked with, my toolbox as a periodic table, and what I'm building. It's deliberately not a resume.

Built with Vite and TypeScript. The content in `data/content.json` is rendered to static HTML at build time.

## Run it

```bash
npm ci
npm run dev        # http://localhost:5173
npm run validate   # build (with type and content checks), lint, Playwright tests
```

## Edit content

Everything personal lives in `data/content.json`. Your editor autocompletes it from `data/schema.json`, and the build fails if it's invalid.

- **Logos and icons:** set `logo` or `icon` to a [Simple Icons](https://simpleicons.org) slug, or to the name of a single-colour SVG in `src/icons/`.
- **Toolbox:** each item needs a unique `name` and an `icon`. Add `focus: true` to mark current focus.
- **Selected work:** mirror the repositories pinned on GitHub, using each repo's name and description.
- **Writing:** add Medium articles to `articles`.
- **Hiding a section:** set it to `false` in `visibility`.

## Deploy

Every push to `main` is checked, then published to GitHub Pages.

## License

© 2026 Yashwant Das. All rights reserved. Company and tool logos are trademarks of their owners and appear only to identify organisations and tools I've worked with.
