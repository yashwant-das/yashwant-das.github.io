# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Tech recruiters, engineering hiring managers, VP/Directors of Engineering, and peer test architects reviewing credentials to evaluate Yashwant Das for Senior / Lead QA Architect, Test Engineering Manager, and AI-Assisted QA leadership roles.

Secondary: Collaborators, engineers, and open-source contributors exploring practical QA architecture and AI testing protocols.

## Product Purpose

A calm personal site, deliberately not a resume. In under a minute it shows who Yashwant is, who he has worked with (a logo wall), what he works with (a periodic table of tools), and what he builds (open-source work), and it leads to contact by email, LinkedIn or GitHub. The resume holds the career history.

## Positioning

Dual depth: 12+ years of enterprise quality engineering architecture (OTT streaming, fintech, e-commerce, and mobile for Fortune 500s) combined with production-focused AI-assisted test systems (Smart Playwright Protocol, self-healing test automation engines, and agentic workflows that keep engineers in control).

## Operating Context

Evaluated primarily by busy decision-makers on desktop and mobile screens, frequently cross-referencing a resume or LinkedIn profile. Demands instant visual scannability, zero layout jank or clutter, resilient performance, and immediate access to code repositories and contact paths.

## Capabilities and Constraints

- **Stack & Architecture:** Vite and TypeScript. `data/content.json` is rendered to static HTML at build time, and a ~1 kB script adds the theme toggle, copy email and active nav. No framework runtime.
- **Data Decoupling:** All personal content, roles, metrics, and project metadata live in `data/content.json` governed by `data/schema.json`. Shell code (`index.html`) remains strictly generic.
- **Dynamic Grace:** Sections hide cleanly when data is absent or turned off with `visibility`.
- **Quality Gates:** Must pass automated verification suites (`npm run build`, `npm run check`, `npm run lint`, and Playwright test runner).

## Brand Commitments

- **Tone of Voice:** Authoritative, engineering-focused, pragmatic, and measured. Avoid superficial AI hype in favor of architecture, protocols, and concrete mechanics.
- **Visual Language:** Quiet and typographic, as specified in `docs/DESIGN-HANDOFF.md`: neutral greys, a serif display face, hairline grids, monochrome logos, and one accent reserved for focus. Dark by default, with light designed to the same standard.
- **Assets:** Avatar at `public/assets/avatars/avatar.webp`. Monochrome logos in `src/icons/` and from Simple Icons.

## Evidence on Hand

- **Worked with:** Paramount, FOX, Optus Sport, Falabella, Pilot Flying J, Equifax, Travelers, Mediacorp, ALTBalaji and Nokia as clients; Samsung, LTIMindtree, Publicis Sapient and Diagnal as employers.
- **Featured Repositories:**
  - _Smart Playwright Protocol (SPP)_: `https://github.com/yashwant-das/ai-ts-playwright-protocol`
  - _Testing LLM Automation Engine_: `https://github.com/yashwant-das/ai-py-playwright-workbench`
- **Contact:** `mailto:yashworks@gmail.com`, LinkedIn, GitHub, Medium.

## Product Principles

1. **Evidence Over Assertion:** Back every technical claim with specific frameworks, protocols, career context, or inspectable code.
2. **Quiet Utility Over Ornament:** Typography and whitespace carry the page; the interface recedes.
3. **A Person, Not a Resume:** Show identity, range and current work; leave dates and job history to the resume.
4. **Data-Driven Single Source of Truth:** Never hard-code personal claims or achievements in markup; maintain fidelity with `data/content.json`.
5. **Architectural Control in AI:** Frame AI testing around auditable decisions, explicit task lifecycles, and human verification rather than opaque generation.

## Accessibility & Inclusion

- Adherence to WCAG 2.1 AA standards.
- Strict semantic heading hierarchy (`h1` through `h3`), a skip-to-content link, keyboard navigation, and visible focus rings in both themes. Axe runs in both themes.
- Complete support for `prefers-reduced-motion` and automated auditing via Playwright with `@axe-core/playwright`.
