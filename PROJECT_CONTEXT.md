# PROJECT_CONTEXT

## Start Here For Any AI

Read this file before editing code, trip data, SW cache versions, or country/map/currency behavior.
Primary AI editors: Claude Code, Codex, Gemini. This is the shared handoff log.
UI source of truth: `SEOUL20266_UI_STYLE_GUIDE.md` — **only read for UI/layout/modal/share-mode tasks**.

Last updated: 2026-04-03 | Stack: HTML + Vue 3 CDN + Tailwind CDN + Leaflet + SW. No build step.

## App Summary

Local-first multi-trip travel itinerary PWA.
Features: day timeline + map markers, trip switching, localStorage persistence, share-link (full/day-filtered/snapshot), exchange-rate calculator, offline shell.
Built-in trips: `SEOUL_2026`, `HONGKONG_2026`

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | Single-page UI (1262 lines) |
| `scripts/config.js` | Country config, labels, map provider, currency (83 lines) |
| `scripts/app.js` | Vue app logic (1056 lines) — see Code Nav below |
| `services/storage.js` | localStorage read/write, trip index (189 lines) |
| `services/map.js` | Leaflet map + external map links |
| `services/rates.js` | Exchange-rate storage and refresh |
| `data/seoul-2026.js` | Built-in trips catalog (Seoul + HK) |
| `sw.js` | Service worker cache shell |

## Code Navigation (app.js key locations)

| Area | Line | What's there |
|------|------|--------------|
| Share URL build | ~451 | `buildShareUrl(tripId, {useCache, dayIndexes})` |
| Share copy | ~548 | `copyShareLink(tripId, {dayIndexes})` |
| Trip apply | ~627 | `applyTripState(tripId)` |
| Trip switch | ~683 | `switchTrip(tripId)` |
| Trip create | ~691 | `createTrip()` |
| Trip delete | ~788 | `deleteTrip(trip)` |
| Event copy | ~599 | `copyEventLocation(location)` |
| Close settings | ~960 | `closeSettings()` |
| Focus event | ~1009 | `focusEvent(id)` |

## index.html key sections

| Section | Line |
|---------|------|
| Map div | ~1056 |
| Settings modal | ~1086 |
| Share link panel | ~1197 |
| Create trip form | ~1215 |

## Country Model

| Code | Country | Map | Currency |
|------|---------|-----|----------|
| `KR` | Korea | NAVER Map | KRW |
| `HK` | Hong Kong | Google Maps | HKD |
| `JP` | Japan | Google Maps | JPY |
| `TH` | Thailand | Google Maps | THB |
| `INTL` | Generic | Google Maps | — |

Legacy `GLOBAL` → auto-normalized to `HK`. Never use `GLOBAL` in new data.

## Current Versions

- SW cache: `travel-guide-v33`
- Asset query version: `20260404b`

## Data Shapes

**Trip:** `tripId`, `meta.title`, `meta.country`, `schedule[]`
**Day:** `date`, `title`, `lunch/lunchId`, `tea/teaId`, `dinner/dinnerId`, `notice?`, `events[]`
**Event:** `id`, `time`, `location`, `map_term?`, `category`, `note`, `tags?`, `coords?`

## Rules

1. No `GLOBAL` country code. New country → update `scripts/config.js` first.
2. Changed frontend JS/CSS → update `index.html` asset version AND `sw.js` cache version + shell list.
3. Keep localStorage backward compatibility unless user explicitly asks to break it.
4. Don't assume `data/seoul-2026.js` only contains Seoul.
5. UI/modal/map/share/cache/data change → update this file.
6. One log entry per session/commit. Max 3 entries here; older → `CHANGELOG.md`.
7. **Timestamp:** run `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'` before writing — never guess.
8. Never overwrite another editor's entry; add a follow-up entry for corrections.

## Debugging Shortcuts

- Share/sync → `app.js` line ~451 (build), `storage.js` (normalization), `sw.js` (cache)
- Map/country → `meta.country`, `COUNTRY_CONFIG` in `config.js`, `services/map.js`
- Rates → `services/rates.js`; confirm country maps to expected currency

## Update Log

Older entries → `CHANGELOG.md`. Max 3 here.
Timestamp: `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`

- 2026-04-05 | Claude Code | Doc | Updated PROJECT_CONTEXT.md update log. Files: PROJECT_CONTEXT.md

- 2026-04-04 | Claude Code | Maintenance | Inserted new entry in PROJECT_CONTEXT.md update log. Files: PROJECT_CONTEXT.md

- 2026-04-04 | Codex | UI/UX, Rates | Added a Korea-only cash-rate source card inside the exchange modal that links to Creatrip's local cash-rate page, while keeping the app's own calculator for internal conversions. The rate modal layout was also tightened so the new source block reads as part of the same flow. Cache v31→v32; asset 20260404a. Files: `index.html`, `scripts/app.js`, `services/rates.js`, `sw.js`, `PROJECT_CONTEXT.md`
