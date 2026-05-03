# PROJECT_CONTEXT

## Start Here For Any AI

Read this file before editing code, trip data, SW cache versions, or country/map/currency behavior.
Primary AI editors: Claude Code, Codex, Gemini. This is the shared handoff log.
UI source of truth: `SEOUL20266_UI_STYLE_GUIDE.md` — **only read for UI/layout/modal/share-mode tasks**.

Last updated: 2026-05-03 | Stack: HTML + Vue 3 CDN + Tailwind CDN + Leaflet + SW. No build step.

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
| `data/trip-catalog.js` | Built-in trip catalog registry |
| `data/seoul-2026.js` | Seoul built-in trip only |
| `data/hongkong-2026.js` | Hong Kong built-in trip only |
| `sw.js` | Service worker cache shell |

## Code Navigation（Grep 前先查這裡）

**index.html**

| 區域 | 行號 |
|------|------|
| App root (#app) | 1063 |
| Header JSX (.glass-header) | 1070 |
| Main content (#timeline-container) | 1104 |
| Notebook Modal | 1201 |
| Settings Modal | 1217 |
| Trip selector | 1327 |
| Rates Modal | 1405 |
| Rate display card | 1419 |

**services/**

| 函式 | 行號 |
|------|------|
| `createMapService()` | map.js:2 |
| `initMap()` | map.js:174 |
| `ensureMarkers()` | map.js:82 |
| `loadTripState()` | storage.js:61 |
| `saveTripState()`（高風險）| storage.js:135 |
| `getStoredRateState()` | rates.js:45 |
| `fetchRatesOnce()` | rates.js:101 |

> 每次修改後若行號位移，更新此表格。

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

- SW cache: `travel-guide-v44-20260503-1550`
- Asset query version: `20260503d` for trip data files; `20260503c` for `scripts/app.js` and `services/storage.js`; other shell assets keep existing query versions

## Data Shapes

**Trip:** `tripId`, `meta.title`, `meta.country`, `schedule[]`
**Day:** `date`, `title`, `lunch/lunchId`, `tea/teaId`, `dinner/dinnerId`, `notice?`, `events[]`
**Event:** `id`, `time`, `location`, `map_term?`, `category`, `note`, `tags?`, `coords?`

## Rules

1. No `GLOBAL` country code. New country → update `scripts/config.js` first.
2. Changed frontend JS/CSS → update `index.html` asset version AND `sw.js` cache version + shell list.
3. Keep localStorage backward compatibility unless user explicitly asks to break it.
4. Keep each built-in trip in its own data file; register it through `data/trip-catalog.js`.
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

- 2026-05-03 | Codex | Split built-in trip data | Moved Hong Kong into its own data file and added a shared trip catalog registry so each travel data file stays independent. Files: data/trip-catalog.js, data/seoul-2026.js, data/hongkong-2026.js, index.html, sw.js, PROJECT_CONTEXT.md, CHANGELOG.md
- 2026-05-03 | Codex | Built-in trip data refresh | Added Seoul catalog version sync so stale localStorage copies refresh from the built-in schedule and bumped app/storage/data cache. Files: data/seoul-2026.js, scripts/app.js, services/storage.js, index.html, sw.js, PROJECT_CONTEXT.md, CHANGELOG.md
- 2026-05-03 | Codex | Seoul Day 3 subway backup times | Added 18:30 and 18:50 Gimyujeong to Namchuncheon train options and bumped data cache. Files: data/seoul-2026.js, index.html, sw.js, PROJECT_CONTEXT.md, CHANGELOG.md
