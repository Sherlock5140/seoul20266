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
- Gemini

This file is the shared handoff log between Claude Code, Codex, and Gemini.

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
- Service worker cache version is currently `travel-guide-v15`.
- Frontend asset query version is currently `20260402g`.

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
9. Every update-log entry must include the exact update time in addition to the date. The timestamp must be obtained by running `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M'` immediately before writing the entry — never estimate, guess, or use a placeholder time.
10. Every update-log entry must say who made the change and whether it was a bug fix, optimization, UI change, data change, docs update, or infra change.
11. Never overwrite or rewrite an older update-log entry from another editor. If a previous update introduced a bug or needs correction, add a new follow-up entry that states what was wrong and what was fixed.
12. Each update-log entry must list every file that was actually changed. Do not batch multiple separate change rounds into one entry — write one entry per work session/commit.

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
- Read `CLAUDE.md` if you are Claude Code
- Read `GEMINI.md` if you are Gemini
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
  Updated at: YYYY-MM-DD HH:MM TZ
  Updated by: Codex | Claude Code | Gemini | User
  Type: Bug Fix | Optimization | UI | Data | Docs | Infra
  Summary:
  - Short description of what changed
  Files:
  - `path/to/file`

Follow-up rule:
- If an earlier entry later turns out to be wrong, incomplete, or buggy, do not replace that old entry.
- Add a new entry instead, for example:
  - `Updated at: 2026-04-02 21:47 CST`
  - `Updated by: Claude Code`
  - `Type: Bug Fix`
  - `Summary: Fixed issue introduced in the earlier 2026-04-02 Codex entry about share-link handling.`

- 2026-04-03
  Updated at: 2026-04-03 11:15 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Refined map marker centering: direct flyTo(event.coords) placed the popup too close to the top edge (pin tip at 50%, popup extends ~80px above). Added controlled offset: subtract([0, 0.15 * mapH]) shifts the center north so the pin tip lands at ~65% from top — popup has ~30% of map height as clearance above it. Offset uses live getBoundingClientRect().height with mobile fallback.
  - Cache version: `travel-guide-v14` → `travel-guide-v15`; asset version: `20260402i` → `20260402j`.
  Files:
  - `services/map.js`
  - `sw.js`
  - `index.html`
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 11:11 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Follow-up fix for map marker centering. The previous 55%-from-top offset via pixel projection was still placing the marker near the top of the map instead of centered. Root cause was unclear (likely interaction between projection offset and autoPan: false). Fix: removed `getHighlightOffset()` entirely and replaced the project/subtract/unproject pattern with a direct `map.flyTo(event.coords, targetZoom)`. Marker now appears at exact center of map. `autoPan: false` retained on all popups.
  - Cache version: `travel-guide-v13` → `travel-guide-v14`; asset version: `20260402h` → `20260402i`.
  Files:
  - `services/map.js`
  - `sw.js`
  - `index.html`
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:58 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Fixed map marker centering issue affecting all itinerary events on mobile: previous fix placed marker at 38% from top, putting popup (~70px above marker) within 36px of map top edge. Leaflet autoPan with topLeft padding [20, 180] then overrode flyTo by forcing popup 180px from top, pushing marker to map bottom and covering the itinerary panel.
  - `getHighlightOffset()`: changed target position from 38% to 55% from top — marker sits slightly below center, popup opens above with sufficient clearance.
  - `autoPan: false` set on all marker popups: flyTo already handles positioning; autoPan was fighting flyTo and always winning, causing the double-movement symptom.
  - Removed `getPopupPadding()` helper (no longer needed).
  - Cache version: `travel-guide-v12` → `travel-guide-v13`; asset version: `20260402g` → `20260402h`.
  Files:
  - `services/map.js`
  - `sw.js`
  - `index.html`
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:51 CST
  Updated by: Claude Code
  Type: Docs
  Summary:
  - Added transparency rules to `CLAUDE.md`: Claude must announce before and after every Gemini call — which model, why, and how the result was used or rejected.
  Files:
  - `CLAUDE.md`
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:50 CST
  Updated by: Claude Code
  Type: Docs, Infra
  Summary:
  - Rewrote Gemini CLI collaboration rules in `CLAUDE.md` with precise model-selection logic.
  - Added Claude judgment priority order (4-step self-check before calling Gemini).
  - Defined explicit trigger conditions for Flash (lookup/docs/version) vs Pro (complex bug, cross-file analysis, second-opinion review).
  - Added Gemini result handling principles: verify before adopting, project rules override Gemini output.
  - Removed vague "needs stronger reasoning" wording; replaced with concrete task examples for each model.
  Files:
  - `CLAUDE.md`
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:45 CST
  Updated by: Claude Code
  Type: Infra, Docs
  Summary:
  - Gemini CLI (v0.36.0) installed at `~/.npm-global/bin/gemini`; verified callable from Claude Code Bash environment.
  - `CLAUDE.md` updated with Gemini collaboration rules: when to use Gemini, model selection table (Flash for lookup/summarize, Pro for heavier reasoning), call template with full binary path, and cases where Gemini should not be used.
  Files:
  - `CLAUDE.md`
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:42 CST
  Updated by: Codex
  Type: Docs
  Summary:
  - Added `CLAUDE.md` and `GEMINI.md` as AI-specific entry files while keeping `PROJECT_CONTEXT.md` as the single shared source of truth.
  - Updated shared rules so Claude Code, Codex, and Gemini all follow the same handoff and update-log conventions.
  Files:
  - `CLAUDE.md`
  - `GEMINI.md`
  - `AGENTS.md`
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:21 CST
  Updated by: Claude Code
  Type: Docs
  Summary:
  - Corrected placeholder timestamp `00:00` in the 2026-04-03 map fix entry to the actual commit time `10:20 CST` (verified via `git log`).
  - Added Rule 12: each entry must cover one work session/commit and list all changed files.
  - Strengthened Rule 9: timestamp must be obtained by running `TZ='Asia/Taipei' date` immediately before writing — never estimate or use a placeholder.
  Files:
  - `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:20 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Fixed map marker centering offset on mobile: `getHighlightOffset()` in `services/map.js` was returning a fixed +220px (mobile) / +130px (desktop) pixel offset. On mobile the map container is only ~280px tall, so the offset exceeded the container height and pushed the highlighted marker completely out of view — Leaflet's autoPan then snapped it to the top edge, causing the visible position shift.
  - New logic reads the actual map container height via `getBoundingClientRect()` and places the marker at 38% from the top of the map (offset = (0.38 − 0.5) × mapHeight), giving a correct upward nudge that works at any screen size.
  - Cache version bumped: `travel-guide-v11` → `travel-guide-v12`; asset version: `20260402f` → `20260402g`.
  Files:
  - `services/map.js`
  - `sw.js`
  - `index.html`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Optimization, UI, Infra
  Summary:
  - `formattedNotes` computed added to `scripts/app.js`: pre-formats all visible event notes once per `displayEvents` change instead of calling `formatNote()` on every Vue render cycle.
  - `formattedDayNotice` computed added to `scripts/app.js`: same treatment for day-level notice text.
  - `copyEventLocation(location)` added to `scripts/app.js` with 1800ms visual feedback via `copiedEventId` ref; timeline copy button enlarged to 44px touch target (w-11 h-11) and icon switches to green checkmark on copy.
  - `shareLoading` ref added to `scripts/app.js`; share buttons now show spinner and disable during async compression + clipboard write.
  - `closeSettings()` helper added to `scripts/app.js` to centralize Settings modal teardown; backdrop click and close button both call it.
  - Settings modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="settings-dialog-title"` added to `index.html`.
  - Rates modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="rates-dialog-title"` added to `index.html`.
  - Day tabs: `role="tablist"` on container, `role="tab"` + `:aria-selected` on each button in `index.html`.
  - Rate inputs: `type="number"` → `type="text"` + `inputmode="decimal"` + `autocomplete="off"` in `index.html` to fix Android scientific notation and Safari scroll jank.
  - `offline.html` created: branded offline fallback page matching app color scheme (✈️ icon, Chinese copy, reload link).
  - `sw.js`: `offline.html` added to `APP_SHELL`; navigate handler offline path falls back to cached `offline.html` before generic 503.
  - Cache version bumped: `travel-guide-v10` → `travel-guide-v11`; asset query version: `20260402e` → `20260402f`.
  Files:
  - `scripts/app.js`
  - `index.html`
  - `sw.js`
  - `offline.html` (new)

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Docs
  Summary:
  - Audited all Codex changes made after Claude Code's session. Codex's `services/map.js` airport-distance logic (Haversine formula + `shouldKeepAirportInOverview` 12km threshold) verified correct — no bugs found.
  - Backfilled `Updated at` timestamps on the three earlier Claude Code entries that predated the new format requirement.
  - Added this follow-up entry to record the Codex audit result and the format-compliance update, per the new follow-up rule.
  Files:
  - `PROJECT_CONTEXT.md`

- 2026-04-02
  Updated at: 2026-04-02 22:02 CST
  Updated by: Codex
  Type: Bug Fix, Data
  Summary:
  - Day-level map overview now keeps airport markers inside the overview bounds when airport and city stops are far apart, restoring the intended whole-route map effect for travel days such as Seoul Day 1 and Hong Kong airport-transfer days.
  - Hong Kong Day 1 and Day 3 airport-linked coordinates were rechecked during the fix; no coordinate correction was needed.
  Files:
  - `services/map.js`
  - `data/seoul-2026.js`

- 2026-04-02
  Updated at: 2026-04-02 21:47 CST
  Updated by: Codex
  Type: Docs
  Summary:
  - Update-log format now explicitly records who made the change and what kind of change it was, so future handoffs can distinguish bug fixes, optimizations, UI work, docs edits, and user-authored updates.
  - Update-log rules now explicitly forbid overwriting another editor's existing entry; corrections must be recorded as a new follow-up entry instead.
  - Update-log format now also requires an exact timestamp so multiple same-day edits can be distinguished.
  Files:
  - `PROJECT_CONTEXT.md`
  - `AGENTS.md`

- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: Bug Fix, Optimization
  Summary:
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
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Fixed Codex-introduced bug: `applyTripState` was calling `setTripNotice('error', ...)` internally for storage failure, but all callers (switchTrip, createTrip, deleteTrip) immediately overwrote it with a success notice — error was never visible. Removed the internal notice; storage errors surface via `persistTrip` debounce as intended.
  Files:
  - `scripts/app.js`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Optimization
  Summary:
  - Share URL compression added: `scripts/utils.js` now exports `compressToBase64Url` / `decompressFromBase64Url` using browser-native `CompressionStream` (deflate-raw). New share URLs are prefixed `z.` and are ~60-75% smaller. Old plain-base64 URLs remain readable (backward-compatible). Boot IIFE is now async; `buildShareUrl` and `copyShareLink` are async. Falls back to plain base64 on browsers without `CompressionStream` (Safari < 16.4).
  Files:
  - `scripts/utils.js`
  - `scripts/app.js`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Bug Fix, Infra
  Summary:
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
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: Data, Infra
  Summary:
  Multi-country foundation added: `KR`, `HK`, `JP`, `TH`, `INTL`, with legacy `GLOBAL -> HK` normalization.
  Files:
  - `scripts/config.js`
  - `services/storage.js`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: Optimization
  Summary:
  Rate handling generalized to support `HKD`, `JPY`, `THB`, and generic currency-to-TWD storage.
  Files:
  - `services/rates.js`
  - `scripts/app.js`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: Optimization, Infra
  Summary:
  PWA relaunch performance improved. Navigation now favors cached shell behavior. Current versions: `travel-guide-v10` and `20260402e`.
  Files:
  - `sw.js`
  - `scripts/app.js`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: UI
  Summary:
  Settings trip management simplified into direct dropdown switching inside the settings panel.
  Files:
  - `index.html`
  - `scripts/app.js`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: UI
  Summary:
  Mobile settings and shared settings presentation were polished for clearer spacing and hierarchy.
  Files:
  - `index.html`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: Bug Fix, Data
  Summary:
  Airport markers were fixed so airports remain visible on the map while overview fit-bounds can still prefer non-airport points.
  Files:
  - `services/map.js`
  - `data/seoul-2026.js`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: UI
  Summary:
  Header controls were enlarged and rebalanced for safer desktop/mobile tapping.
  Files:
  - `index.html`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: UI
  Summary:
  Settings modal proportions were adjusted multiple times. Current intent is: larger controls, larger typography, better desktop scale, and a mobile layout that does not feel like a shrunken desktop modal.
  Files:
  - `index.html`
- 2026-04-02
  Updated at: (timestamp not recorded — predates format requirement)
  Updated by: Codex
  Type: Docs, UI
  Summary:
  `SEOUL20266_UI_STYLE_GUIDE.md` was expanded into a full UI behavior and bug-fix manual for Claude Code and Codex, not just a visual style memo.
  Files:
  - `SEOUL20266_UI_STYLE_GUIDE.md`
  - `PROJECT_CONTEXT.md`
  - `AGENTS.md`

- 2026-04-02
  Updated at: 2026-04-02 22:19 CST
  Updated by: Codex
  Type: Docs
  Summary:
  - Rechecked the update log and normalized older Codex entries so they now consistently include `Updated at`, `Summary`, and `Files`.
  - Left other editors' entries intact; this pass only fixed log-format completeness.
  Files:
  - `PROJECT_CONTEXT.md`
