# PROJECT_CONTEXT

## Start Here For Any AI

Read this file before editing code, trip data, SW cache versions, or country/map/currency behavior.
Primary AI editors: Claude Code, Codex, Gemini. This is the shared handoff log.
UI source of truth: `SEOUL20266_UI_STYLE_GUIDE.md` (layout, modals, responsive, share mode, visual bugs).

Last updated: 2026-04-03
Project: Travel Guide — Static PWA (HTML + Vue 3 CDN + Tailwind CDN + Leaflet + Service Worker). No build step.

## What This App Is

Local-first multi-trip travel itinerary web app.
- Day-by-day itinerary timeline with map markers
- Trip switching and localStorage persistence
- Share-link snapshot mode (schedule + meta only, no notes)
- Exchange-rate calculator
- PWA install/offline shell

Built-in trips: `SEOUL_2026`, `HONGKONG_2026`

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | Single-page UI, all layout and component templates |
| `scripts/config.js` | Global app config, country config, labels, map provider, currency |
| `scripts/app.js` | Main Vue app logic |
| `services/storage.js` | LocalStorage read/write, trip index, active trip state |
| `services/map.js` | Leaflet map service and external map opening logic |
| `services/rates.js` | Exchange-rate storage and refresh |
| `data/seoul-2026.js` | Built-in trip catalog (contains both Seoul and HK trips) |
| `sw.js` | Service worker cache shell |

## Country Model

| Code | Country | Map | Currency |
|------|---------|-----|----------|
| `KR` | Korea | NAVER Map | KRW |
| `HK` | Hong Kong | Google Maps | HKD |
| `JP` | Japan | Google Maps | JPY |
| `TH` | Thailand | Google Maps | THB |
| `INTL` | Generic | Google Maps | — |

Legacy `GLOBAL` in saved data is auto-normalized to `HK`. Do not use `GLOBAL` in new data.

## Current Versions

- SW cache: `travel-guide-v16`
- Asset query version: `20260402k`

## Data Shapes

**Trip:** `tripId`, `meta.title`, `meta.country`, `schedule[]`

**Day:** `date`, `title`, `lunch/lunchId`, `tea/teaId`, `dinner/dinnerId`, `notice?`, `events[]`

**Event:** `id`, `time`, `location`, `map_term?`, `category`, `note`, `tags?`, `coords?`

## Rules

1. Do not reintroduce `GLOBAL` as a real country code.
2. New country → update `scripts/config.js` first.
3. New currency → ensure `services/rates.js` supports it.
4. Changed frontend JS/CSS → update both `index.html` asset query version AND `sw.js` cache version + shell list.
5. Keep backward compatibility for existing localStorage data unless user explicitly asks to break it.
6. Do not assume `data/seoul-2026.js` only contains Seoul.
7. If you change UI, modal, map, share, cache, or trip data behavior → update this file.
8. Edit only the relevant section + add a new update-log entry. Do not dump long changelogs.
9. **Before writing `Updated at`:** run `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'` — never guess.
10. Each entry must say who changed it and what type (Bug Fix / Optimization / UI / Data / Docs / Infra).
11. Never overwrite another editor's entry. Add a follow-up entry for corrections.
12. One entry per work session/commit. List every file actually changed.

## Known Limitations

- JP/TH built-in trip templates not yet created.
- `data/seoul-2026.js` filename is misleading (contains both Seoul and HK).
- No formal build step or test runner. Manual browser testing required after UI changes.

## Debugging Shortcuts

- Share/sync issues → `scripts/app.js` (snapshot), `services/storage.js` (normalization), `sw.js` (cache)
- Map/country issues → `meta.country` in trip data, `COUNTRY_CONFIG` in `scripts/config.js`, `services/map.js`
- Rate issues → `services/rates.js`, confirm country maps to expected currency

## AI Entry Files

- `CLAUDE.md` → Claude Code-specific entry instructions
- `CODEX.md` → Codex-specific entry instructions
- `GEMINI.md` → Gemini-specific entry instructions
- All three still share the same source of truth in `PROJECT_CONTEXT.md`

## Update Log

Format: date · Updated at · Updated by · Type · Summary · Files
Older entries archived in `CHANGELOG.md`.
Before writing timestamp: `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`

- 2026-04-03
  Updated at: 2026-04-03 13:47 CST
  Updated by: Codex
  Type: Docs
  Summary:
  - Added `CODEX.md` so Claude Code, Codex, and Gemini now each have a dedicated project entry file.
  - Updated shared documentation to point Codex to `CODEX.md` while keeping `PROJECT_CONTEXT.md` as the common source of truth.
  Files: `CODEX.md`, `AGENTS.md`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 13:48 CST
  Updated by: Claude Code
  Type: Docs, Optimization
  Summary:
  - Reduced token consumption: PROJECT_CONTEXT.md 537 → 122 lines (−77%), CLAUDE.md 159 → 37 lines (−77%).
  - Archived 28 older update-log entries to `CHANGELOG.md` (not auto-loaded).
  - Rewrote PROJECT_CONTEXT.md as a compact reference (table format for architecture, country model, data shapes).
  - Rewrote CLAUDE.md Gemini rules into a concise table + 4-step checklist.
  - Combined context file savings: ~29KB → ~7KB per session start.
  Files: `PROJECT_CONTEXT.md`, `CLAUDE.md`, `CHANGELOG.md` (new)

- 2026-04-03
  Updated at: 2026-04-03 13:43 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Fixed share link stuck at "處理中..." and failing on recipient's end.
  - Removed `notes` from share payload (schedule + meta only) — notes caused oversized URLs.
  - Built share URL from clean `origin+pathname` instead of `window.location.href` (prevented stale hash/params leaking in).
  - Added 8-second safety timeout in `copyShareLink` so `shareLoading` always resets.
  - Cache: v15 → v16; asset: 20260402j → 20260402k.
  Files: `scripts/app.js`, `sw.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 11:15 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Refined map marker centering: add 15% mapHeight offset via project/subtract/unproject so pin lands at ~65% from top, giving popup clearance above it.
  - Cache: v14 → v15; asset: 20260402i → 20260402j.
  Files: `services/map.js`, `sw.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 11:11 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Removed `getHighlightOffset()` and projection offset entirely; replaced with `map.flyTo(event.coords)` for exact centering. `autoPan: false` retained.
  - Cache: v13 → v14; asset: 20260402h → 20260402i.
  Files: `services/map.js`, `sw.js`, `index.html`, `PROJECT_CONTEXT.md`
