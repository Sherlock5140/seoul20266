# PROJECT_CONTEXT

## Current State

This file is the compact current-state, scope, routing, version, and recent-handoff source for the root Travel Guide PWA.

Primary AI editors: Claude Code, Codex, Gemini.

Last updated: 2026-07-30 | Stack: HTML + Vue 3 CDN + Tailwind CDN + Leaflet + Service Worker. No build step.

The app is a local-first multi-trip itinerary PWA with day timelines, map markers, trip switching, localStorage persistence, direct/day-filtered/snapshot sharing, exchange-rate conversion, and an offline shell.

Built-in trips: `SEOUL_2026`, `HONGKONG_2026`.

The root runtime excludes nested side projects, temporary worktrees, generated media/output, and skill-packaging artifacts unless a task explicitly places them in scope.

## Document and Skill Router

Read only the rows that match the task. A skill supplies workflow but never expands authorization.

| Task | Required guide | Skill |
|------|----------------|-------|
| Itinerary wording, Day/event content, meals, routes, coordinates | `TRAVEL_DATA_GUIDE.md` | `$edit-itinerary-data` |
| New trip, catalog, country, or travel data shape | `TRAVEL_DATA_GUIDE.md` + `ENGINEERING_GUIDE.md` | `$edit-itinerary-data`, then `$change-travel-app` if consumers change |
| JavaScript, storage, share, map, rates, cache, service worker | `ENGINEERING_GUIDE.md` | `$change-travel-app` |
| UI, layout, modal, responsive, share-mode presentation, visual bug | `ENGINEERING_GUIDE.md` + `SEOUL20266_UI_STYLE_GUIDE.md` | `$change-travel-app` |
| Targeted or full app review, readiness, security, accessibility | Guides covering the requested scope | `$audit-travel-app` |
| Agent instructions, adapters, routing, delegation, skills | `AGENTS.md` + affected documents | `$maintain-agent-docs` |
| Feature explanation, architecture orientation, read-only status | This file; add a task guide only for requested detail | None |
| Commit, push, GitHub Pages, deploy, publish, release | `ENGINEERING_GUIDE.md` + the repository release configuration | None; follow the explicit Release / sync authorization |
| Security workflow setup | `SECURITY.md` | Use the exact requested setup or audit workflow |
| Historical changes | `CHANGELOG.md` | None |

Canonical project skills live under `.agents/skills/`. Tool adapters must use this router when their native skill discovery path differs.

## Ownership Boundaries

| Topic | Owning document |
|-------|-----------------|
| Authorization, task modes, quality, delegation, skill protocol | `AGENTS.md` |
| Current state, routes, versions, recent handoff | `PROJECT_CONTEXT.md` |
| Travel semantics, IDs, schema, meals, routes, coordinates | `TRAVEL_DATA_GUIDE.md` |
| Runtime, compatibility, fallback, validation, cache/deployment | `ENGINEERING_GUIDE.md` |
| Observable UI, responsive, visual, interaction contract | `SEOUL20266_UI_STYLE_GUIDE.md` |
| Tool-specific operation | `CLAUDE.md`, `CODEX.md`, `GEMINI.md` |
| Repeatable procedure | `.agents/skills/*/SKILL.md` |
| History | `CHANGELOG.md` |

Cross-domain documents may reference an observable dependency, but the owning document contains the full normative rule.

## Current Versions

- SW cache: `travel-guide-v67-20260514-1707`
- Core app/config/service/catalog query: `20260503h`
- Seoul trip data query: `20260514f`
- Hong Kong trip data query: `20260503d`

Version and app-shell synchronization rules live in `ENGINEERING_GUIDE.md`.

## Exposure Boundary

The GitHub origin is public. Treat committed runtime data and repository documentation as world-readable.

- Do not add nonpublic reservations, credentials, contact details, private notes, scan evidence, or generated working files.
- Keep secrets in approved secret stores and reference only their variable names.
- Use explicit file staging; never upload side-project or generated-output directories with a root-app change.
- A private backup or public-data sanitization requires a separate verified repository/privacy decision.

## Update Log

Older entries → `CHANGELOG.md`. Keep at most three entries.
Timestamp source: `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`; compact entries use `YYYY-MM-DD`.

- 2026-07-30 | Codex | Agent governance and skill routing | Added instruction precedence, skill protocol, bounded delegation, self-improvement gates, four project Skills, deterministic doc validation, public-repository safeguards, protected governance ownership, and removal of stale generated review bundles. Files: AGENTS.md, PROJECT_CONTEXT.md, CLAUDE.md, CODEX.md, GEMINI.md, TRAVEL_DATA_GUIDE.md, ENGINEERING_GUIDE.md, REVIEW_PROMPT.md, SEOUL20266_UI_STYLE_GUIDE.md, SECURITY.md, .github/CODEOWNERS, .github/workflows/codex-security.yml, .agents/skills/, scripts/validate-agent-docs.sh, .gitignore, CHANGELOG.md
- 2026-07-30 | Codex | Travel/engineering documentation split | Split itinerary-domain rules into TRAVEL_DATA_GUIDE.md and runtime/code rules into ENGINEERING_GUIDE.md; reduced PROJECT_CONTEXT.md to routing/current state and synchronized all AI entry, audit, UI, and history references. Files: AGENTS.md, PROJECT_CONTEXT.md, TRAVEL_DATA_GUIDE.md, ENGINEERING_GUIDE.md, CODEX.md, CLAUDE.md, GEMINI.md, REVIEW_PROMPT.md, SEOUL20266_UI_STYLE_GUIDE.md, CHANGELOG.md
- 2026-07-30 | Codex | AI workflow docs optimization | Centralized task modes, evidence gates, stable code navigation, shared risk invariants, itinerary workflow, and scope-based validation; simplified tool-specific entry docs and separated audit from fix authorization. Files: AGENTS.md, PROJECT_CONTEXT.md, REVIEW_PROMPT.md, CLAUDE.md, CODEX.md, GEMINI.md, CHANGELOG.md
