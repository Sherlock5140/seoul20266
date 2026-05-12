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
| `index.html` | Single-page UI (1547 lines) |
| `scripts/config.js` | Country config, labels, map provider, currency (83 lines) |
| `scripts/app.js` | Vue app logic (1481 lines) — see Code Nav below |
| `services/storage.js` | localStorage read/write, trip index (191 lines) |
| `services/map.js` | Leaflet map + external map links (376 lines) |
| `services/rates.js` | Exchange-rate storage and refresh (149 lines) |
| `data/trip-catalog.js` | Built-in trip catalog registry (15 lines) |
| `data/seoul-2026.js` | Seoul built-in trip only (162 lines) |
| `data/hongkong-2026.js` | Hong Kong built-in trip only (92 lines) |
| `sw.js` | Service worker cache shell |

## Code Navigation（Grep 前先查這裡）

**index.html**

| 區域 | 行號 |
|------|------|
| App root (#app) | 1081 |
| Header JSX (.glass-header) | 1088 |
| Main content (#timeline-container) | 1122 |
| Notebook Modal | 1238 |
| Settings Modal | 1254 |
| Trip selector | 1303 |
| Rates Modal | 1442 |
| Rate display card | 1459 |

**services/**

| 函式 | 行號 |
|------|------|
| `createMapService()` | map.js:2 |
| `initMap()` | map.js:204 |
| `ensureMarkers()` | map.js:113 |
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

- SW cache: `travel-guide-v58-20260512-1831`
- Asset query version: `20260503h` for core app/config/service/catalog files; `20260512j` for Seoul trip data; `20260503d` for Hong Kong trip data; other shell assets keep existing query versions

## Data Shapes

**Trip:** `tripId`, `meta.title`, `meta.country`, `schedule[]`
**Day:** `date`, `title`, `lunch/lunchId`, `tea/teaId`, `dinner/dinnerId`, `notice?`, `events[]`
**Event:** `id`, `time`, `location`, `map_term?`, `category`, `note`, `tags?`, `coords?`, `spots?`
**Spot:** `name`, `type?`, `priority?`, `note?`, `coords?`

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

- 2026-05-12 | Codex | Day 6 structure rewrite | Rebuilt Day 6 around Anguk plus Chicken Restaurant, supermarket transfer and shopping as separate blocks, Hongdae shopping plus dinner, and explicit 17:16/17:31 AREX airport departure plans with tax-refund and check-in reminders. Files: data/seoul-2026.js, index.html, sw.js, PROJECT_CONTEXT.md, CHANGELOG.md
- 2026-05-12 | Codex | Day 4 airport transfer update | Updated the teammate Incheon T2 to Hongdae transfer options with revised AREX and airport-bus durations, fare, and recommendation wording. Files: data/seoul-2026.js, index.html, sw.js, PROJECT_CONTEXT.md, CHANGELOG.md
- 2026-05-12 | Codex | Day 5 dinner priority update | Switched the Seongsu dinner summary and decision card so potato back-bone soup is the primary choice after the Day 5 lunch barbecue, with the grill place kept as backup. Files: data/seoul-2026.js, index.html, sw.js, PROJECT_CONTEXT.md, CHANGELOG.md
