# Travel App Context

Read this file only when the `AGENTS.md` Scope Router selects the Travel Guide app, a derived artifact needs current trip identity or version, or Travel routing/current state is being changed. Most derived artifacts should read the relevant source data and contract directly.

## Current State

Last updated: 2026-07-30 | Stack: HTML + Vue 3 CDN + Tailwind CDN + Leaflet + Service Worker. No build step.

The app is a local-first multi-trip itinerary PWA with day timelines, map markers, trip switching, localStorage persistence, direct/day-filtered/snapshot sharing, exchange-rate conversion, and an offline shell.

Built-in trips: `SEOUL_2026`, `HONGKONG_2026`.

The root app excludes nested side projects, temporary worktrees, generated media/output, and skill-packaging artifacts unless a task explicitly places them in scope.

## Travel Document and Skill Router

Read only the matching row. Its guide column is routing metadata; when a Skill applies, let that selected Skill load each guide once. Task mode and authorization remain owned by `AGENTS.md`.

| Travel task | Required guide | Skill |
|-------------|----------------|-------|
| Itinerary wording, Day/event content, meals, routes, coordinates | `TRAVEL_DATA_GUIDE.md` | `$edit-itinerary-data` |
| New trip, catalog, country, or travel data shape | `TRAVEL_DATA_GUIDE.md` + `ENGINEERING_GUIDE.md` | `$edit-itinerary-data`, then `$change-travel-app` if consumers change |
| JavaScript, storage, share, map, rates, cache, service worker | `ENGINEERING_GUIDE.md` | `$change-travel-app` |
| UI, layout, modal, responsive, share-mode presentation, visual bug | `ENGINEERING_GUIDE.md` + `SEOUL20266_UI_STYLE_GUIDE.md` | `$change-travel-app` |
| Targeted or full app review, readiness, security, accessibility | Guides covering the requested scope | `$audit-travel-app` |
| Feature explanation, architecture orientation, read-only app status | This file; add a task guide only for requested detail | None |
| Deploy or publish the Travel app | `ENGINEERING_GUIDE.md` + verified release configuration | Matching deployment/hosting capability when available; follow explicit Release / sync authorization |
| Commit, push, or open a PR for Travel repository changes | Matching changed-scope guide only; add engineering/release configuration only when app deployment is involved | Matching GitHub/release capability when available; follow explicit Release / sync authorization |
| Security workflow setup | `SECURITY.md` | Exact requested setup or audit workflow |
| Historical changes | `CHANGELOG.md` | None |

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

Older entries → `CHANGELOG.md`. Keep at most three compact entries.
Timestamp source: `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`; entries use the resulting Taipei date.

- 2026-07-30 | Codex | Workspace scope routing | Added target/output-based scope classification, artifact/external/unknown routes, conditional Travel context loading, restored implicit Skill selection, cross-model discovery bridges, public-data safeguards, split release routing, and reduced duplicated Skill/adapter instructions. Files: AGENTS.md, PROJECT_CONTEXT.md, CLAUDE.md, CODEX.md, GEMINI.md, .agents/skills/, .claude/skills/, .github/CODEOWNERS, scripts/validate-agent-docs.sh, .gitignore
- 2026-07-30 | Codex | Router context trim | Removed duplicated adapter routing and Travel ownership text, made guide loading single-pass, adopted Claude Compact Instructions, and hardened import/route/bridge/current-version validation. Files: AGENTS.md, PROJECT_CONTEXT.md, CLAUDE.md, GEMINI.md, .agents/skills/maintain-agent-docs/SKILL.md, scripts/validate-agent-docs.sh
