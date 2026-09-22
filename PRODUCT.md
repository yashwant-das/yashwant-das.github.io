# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Tech recruiters, engineering hiring managers, VP/Directors of Engineering, and peer test architects reviewing credentials to evaluate Yashwant Das for Senior / Lead QA Architect, Test Engineering Manager, and AI-Assisted QA leadership roles.

Secondary: Collaborators, engineers, and open-source contributors exploring practical QA architecture and AI testing protocols.

## Product Purpose

A high-performance, distraction-free personal portfolio and engineering showcase. It exists to provide evaluators with immediate, verifiable proof of technical depth, enterprise architecture leadership, and cutting-edge test innovation, driving contact through email, LinkedIn, or GitHub.

## Positioning

Dual depth: 12+ years of enterprise quality engineering architecture (OTT streaming, fintech, e-commerce, and mobile for Fortune 500s) combined with production-focused AI-assisted test systems (Smart Playwright Protocol, self-healing test automation engines, and agentic workflows that keep engineers in control).

## Operating Context

Evaluated primarily by busy decision-makers on desktop and mobile screens, frequently cross-referencing a resume or LinkedIn profile. Demands instant visual scannability, zero layout jank or clutter, resilient performance, and immediate access to code repositories and contact paths.

## Capabilities and Constraints

- **Stack & Architecture:** Static HTML5 entry shell, vanilla CSS design tokens, and TypeScript compiling to vanilla ES modules in `dist/`. No heavy framework runtime.
- **Data Decoupling:** All personal content, roles, metrics, and project metadata live in `data/content.json` governed by `data/schema.json`. Shell code (`index.html`) remains strictly generic.
- **Dynamic Grace:** Sections hide cleanly when data is absent or toggled off via `src/render.ts`.
- **Quality Gates:** Must pass automated verification suites (`npm run build`, `npm run check`, `npm run lint`, and Playwright test runner).

## Brand Commitments

- **Tone of Voice:** Authoritative, engineering-focused, pragmatic, and measured. Avoid superficial AI hype in favor of architecture, protocols, and concrete mechanics.
- **Visual Language:** Apple-inspired restraint as specified in `docs/DESIGN-HANDOFF.md` — crisp typography, monochromatic canvases (pure white/black), subtle surface tiers, single-level cards, and zero decorative background noise or gradient blobs.
- **Assets:** Preserves verified professional assets including avatar (`assets/avatars/avatar.webp`) and enterprise logos (`assets/logos/`).

## Evidence on Hand

- **Career Milestones:** 12+ years across Publicis Sapient (Pilot Flying J), LTIMindtree (Paramount, Travelers, Equifax), Future Focus Infotech (Falabella), Diagnal Technologies (Optus Sport, FOX), and Samsung India.
- **Featured Repositories:**
  - _Smart Playwright Protocol (SPP)_: `https://github.com/yashwant-das/test-playwright-protocol`
  - _Testing LLM Automation Engine_: `https://github.com/yashwant-das/testing-llm-automation-engine`
- **Credentials:** BCA (Manipal University Jaipur), Diploma in Electronics & Embedded Systems (NTTF), IBM Generative AI certifications, Cisco Python, Atlassian Jira.
- **Contact:** `mailto:yashworks@gmail.com`, LinkedIn, GitHub, Medium.

## Product Principles

1. **Evidence Over Assertion:** Back every technical claim with specific frameworks, protocols, career context, or inspectable code.
2. **Quiet Utility Over Ornament:** Present information with maximum scanability and hierarchy; the engineering work leads while the interface recedes.
3. **Data-Driven Single Source of Truth:** Never hard-code personal claims or achievements in markup; maintain fidelity with `data/content.json`.
4. **Architectural Control in AI:** Frame AI testing around auditable decisions, explicit task lifecycles, and human verification rather than opaque generation.

## Accessibility & Inclusion

- Adherence to WCAG 2.1 AA standards.
- Strict semantic heading hierarchy (`h1` through `h3`), skip-to-content mechanism, keyboard navigation with high-contrast visible focus rings in both light and dark themes.
- Complete support for `prefers-reduced-motion` and automated auditing via Playwright with `@axe-core/playwright`.
