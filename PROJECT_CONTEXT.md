# PROJECT_CONTEXT

## Start Here For Any AI

Read this file before:
- editing code
- changing trip data
- changing service worker cache versions
- changing country, map, or currency behavior

If you are continuing work in this repo, use this file as the first source of truth.

Primary AI editors for this repo:
- Claude Code
- Codex

This file is the shared handoff log between Claude Code and Codex.

UI-specific source of truth:
- `SEOUL20266_UI_STYLE_GUIDE.md`
  Use this when the task involves layout, modal proportions, responsive behavior, header controls, share mode, visual hierarchy, or UI bug fixing.

Last updated: 2026-04-02
Project: Travel Guide
Type: Static PWA travel itinerary app
Stack: HTML + Vue 3 CDN + Tailwind CDN + Leaflet + Service Worker

## What This App Is

This project is a local-first multi-trip travel itinerary web app.

Core capabilities:
- Day-by-day itinerary timeline
- Map markers for events
- Trip switching and local storage persistence
- Share-link snapshot mode
- Exchange-rate calculator
- PWA install/offline shell support

Current built-in trips:
- `SEOUL_2026`
- `HONGKONG_2026`

## Current Architecture

Main files:
- `index.html`
  Single-page UI, all layout and component templates live here.
- `scripts/config.js`
  Global app config, country config, labels, map provider, currency defaults.
- `scripts/app.js`
  Main Vue app logic.
- `services/storage.js`
  LocalStorage read/write, trip index, active trip state.
- `services/map.js`
  Leaflet map service and external map opening logic.
- `services/rates.js`
  Exchange-rate storage and refresh logic.
- `data/seoul-2026.js`
  Built-in trip catalog data. Despite the filename, it currently contains both Seoul and Hong Kong trips.
- `sw.js`
  Service worker cache shell.

## Important Recent Changes

The project was just refactored to remove the old fake `GLOBAL = Hong Kong` behavior.

New country model:
- `KR` = Korea
- `HK` = Hong Kong
- `JP` = Japan
- `TH` = Thailand
- `INTL` = generic international fallback

Compatibility layer:
- Legacy saved data using `GLOBAL` is automatically normalized to `HK`.
- New data should not use `GLOBAL` anymore.

Map logic:
- External map routing now depends on `mapProvider`, not currency.
- `KR` uses NAVER Map.
- Other current country configs use Google Maps.

Rate logic:
- Rates are now stored as a general currency-to-TWD object.
- Existing legacy keys for KRW/HKD/USD are still read for backward compatibility.
- Added support for `JPY` and `THB`.

UI logic:
- Country dropdowns are now generated from config instead of hardcoded options.

Cache:
- Service worker cache version is currently `travel-guide-v10`.
- Frontend asset query version is currently `20260402e`.

Recent UI changes:
- Header toolbar buttons and `Notes` control were enlarged for safer tapping.
- Settings modal was reworked several times to improve desktop and mobile proportions.
- Current settings modal should now use a larger content scale, larger controls, and a centered content column instead of tiny controls inside a wide shell.

## Rules Future AI Should Follow

1. Do not reintroduce `GLOBAL` as a real country code.
2. If adding a new country, update `scripts/config.js` first.
3. If adding a new currency, make sure `services/rates.js` supports it.
4. If changing frontend JS/CSS assets, also update:
- `index.html` asset query version
- `sw.js` cache version and shell asset list
5. Keep backward compatibility for existing localStorage data unless the user explicitly asks to break/reset it.
6. Do not assume `data/seoul-2026.js` only contains Seoul.
7. If you change UI proportions, modal layout, header controls, trip management flow, map behavior, share behavior, cache behavior, or trip data, update this file before finishing.
8. When updating this file, prefer editing the relevant section plus the update log below instead of dumping a long changelog.
9. Every update-log entry must say who made the change and whether it was a bug fix, optimization, UI change, data change, docs update, or infra change.

## Known Project Conventions

Trip data shape:
- `tripId`
- `meta.title`
- `meta.country`
- `schedule[]`

Day shape:
- `date`
- `title`
- `lunch`, `lunchId`
- `tea`, `teaId`
- `dinner`, `dinnerId`
- optional `notice`
- `events[]`

Event shape:
- `id`
- `time`
- `location`
- optional `map_term`
- `category`
- `note`
- optional `tags`
- optional `coords`

## Current Practical Limitations

- Built-in country list is ready for Japan and Thailand, but there are not yet built-in JP/TH trip templates.
- `data/seoul-2026.js` filename is misleading and may eventually need splitting into multiple catalog files.
- No formal build step or test runner exists yet.
- Visual/browser interaction should be manually checked after UI changes.

## Good Next Steps

Useful next improvements:
- Split catalog data into separate files by destination
- Add built-in Tokyo/Bangkok sample trips
- Add a dedicated `country`/`destination` management note in settings
- Add lightweight validation tooling for trip data

## If Another AI Is Continuing Work

Before editing:
- Read `scripts/config.js`
- Read `scripts/app.js`
- Read `services/rates.js`
- Read `services/storage.js`
- Read `sw.js`

Before editing UI:
- Read `SEOUL20266_UI_STYLE_GUIDE.md`
- Treat it as the UI logic + style + bug-fix reference, not just a design note

If the user mentions share mode or sync problems:
- Check trip snapshot handling in `scripts/app.js`
- Check localStorage normalization in `services/storage.js`
- Check cache invalidation in `sw.js`

If the user mentions maps or wrong destination behavior:
- Check `meta.country` in trip data
- Check `COUNTRY_CONFIG` in `scripts/config.js`
- Check map provider routing in `services/map.js`

If the user mentions exchange rates:
- Check `services/rates.js`
- Confirm the trip country maps to the expected currency

## Update Log

Preferred entry format:
- YYYY-MM-DD
  Updated by: Codex | Claude Code | User
  Type: Bug Fix | Optimization | UI | Data | Docs | Infra
  Summary:
  - Short description of what changed
  Files:
  - `path/to/file`

- 2026-04-02
  Updated by: Codex
  Type: Docs
  Summary:
  - Update-log format now explicitly records who made the change and what kind of change it was, so future handoffs can distinguish bug fixes, optimizations, UI work, docs edits, and user-authored updates.
  Files:
  - `PROJECT_CONTEXT.md`
  - `AGENTS.md`

- 2026-04-02
  Updated by: Codex
  Type: Bug Fix, Optimization
  Audit-driven robustness fixes:
  - `services/storage.js` now returns write/remove success booleans so UI no longer reports save/create/rename/delete success when storage actually failed.
  - `scripts/app.js` now surfaces storage failure messages for save, create, rename, delete, and share-copy actions.
  - `scripts/utils.js` clipboard copy now returns success/failure instead of assuming success, and compression/decompression now await writer promises to avoid ignored promise failures.
  - `services/rates.js` conversion formatting no longer drops fractional precision for large non-integer values by rounding everything above 1000 to an integer.
  Files:
  - `services/storage.js`
  - `scripts/app.js`
  - `scripts/utils.js`
  - `services/rates.js`

- 2026-04-02
  Updated by: Codex
  Type: Optimization
  Share URL compression added: `scripts/utils.js` now exports `compressToBase64Url` / `decompressFromBase64Url` using browser-native `CompressionStream` (deflate-raw). New share URLs are prefixed `z.` and are ~60-75% smaller. Old plain-base64 URLs remain readable (backward-compatible). Boot IIFE is now async; `buildShareUrl` and `copyShareLink` are async. Falls back to plain base64 on browsers without `CompressionStream` (Safari < 16.4).
  Files:
  - `scripts/utils.js`
  - `scripts/app.js`

- 2026-04-02
  Updated by: Codex
  Type: Bug Fix, Infra
  Code audit and robustness fixes applied:
  - `services/storage.js`: All `localStorage` calls wrapped in safe wrappers (get/set/remove) to prevent crash from SecurityError in private browsing or storage-blocked environments.
  - `services/rates.js`: Same localStorage SecurityError protection added. Redundant `USD` check in rate payload validation removed (USD is always the base currency from the endpoint).
  - `services/map.js`: Hangul-extraction logic in `getCleanQuery` changed from `currency === 'KRW'` to `mapProvider === 'naver'` for correctness.
  - `sw.js`: `skipWaiting()` moved inside `waitUntil` chain to prevent takeover before shell cache completes. Both `cache.put` fire-and-forget calls now have `.catch()` error logging.
  - `scripts/app.js`: Global `unhandledrejection` handler now active in production (console.warn) not only in debug mode.
  Files:
  - `services/storage.js`
  - `services/rates.js`
  - `services/map.js`
  - `sw.js`
  - `scripts/app.js`

- 2026-04-02
  Updated by: Codex
  Type: Data, Infra
  Multi-country foundation added: `KR`, `HK`, `JP`, `TH`, `INTL`, with legacy `GLOBAL -> HK` normalization.
- 2026-04-02
  Updated by: Codex
  Type: Optimization
  Rate handling generalized to support `HKD`, `JPY`, `THB`, and generic currency-to-TWD storage.
- 2026-04-02
  Updated by: Codex
  Type: Optimization, Infra
  PWA relaunch performance improved. Navigation now favors cached shell behavior. Current versions: `travel-guide-v10` and `20260402e`.
- 2026-04-02
  Updated by: Codex
  Type: UI
  Settings trip management simplified into direct dropdown switching inside the settings panel.
- 2026-04-02
  Updated by: Codex
  Type: UI
  Mobile settings and shared settings presentation were polished for clearer spacing and hierarchy.
- 2026-04-02
  Updated by: Codex
  Type: Bug Fix, Data
  Airport markers were fixed so airports remain visible on the map while overview fit-bounds can still prefer non-airport points.
- 2026-04-02
  Updated by: Codex
  Type: UI
  Header controls were enlarged and rebalanced for safer desktop/mobile tapping.
- 2026-04-02
  Updated by: Codex
  Type: UI
  Settings modal proportions were adjusted multiple times. Current intent is: larger controls, larger typography, better desktop scale, and a mobile layout that does not feel like a shrunken desktop modal.
- 2026-04-02
  Updated by: Codex
  Type: Docs, UI
  `SEOUL20266_UI_STYLE_GUIDE.md` was expanded into a full UI behavior and bug-fix manual for Claude Code and Codex, not just a visual style memo.
