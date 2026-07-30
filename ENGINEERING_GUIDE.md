# Engineering Guide

This is the source of truth for application architecture, runtime compatibility, validation, and deployment-sensitive assets.
Use `$change-travel-app` for the change workflow and this guide for stable engineering contracts and validation requirements.

Trip content and country/data semantics live in `TRAVEL_DATA_GUIDE.md`. Visual language and component behavior live in `SEOUL20266_UI_STYLE_GUIDE.md`.

## Architecture

| File | Purpose |
|------|---------|
| `index.html` | Single-page UI, CSS, template, and CDN/script entrypoints |
| `scripts/config.js` | Country config, labels, map provider, center, and currency |
| `scripts/utils.js` | Formatting, cloning, compression, comparison, and shared helpers |
| `scripts/app.js` | Vue state, trip switching, share flow, notes, rates, and UI actions |
| `services/storage.js` | localStorage access, legacy migration, and trip index |
| `services/map.js` | Leaflet map, markers, bounds, and external map links |
| `services/rates.js` | Exchange-rate storage, refresh, and fallback |
| `data/trip-catalog.js` | Built-in trip registry |
| `data/*.js` | Built-in itinerary data |
| `sw.js` | App-shell and CDN caching |

## Code Navigation

Use current symbols instead of copied line numbers:

| Area | Search |
|------|--------|
| App shell / timeline | `rg -n 'id="app"|glass-header|timeline-container' index.html` |
| Modals | `rg -n 'Notebook Modal|Settings Modal|Rates Modal' index.html` |
| Share flow | `rg -n 'buildShareUrl|copyShareLink|sharedTripSnapshot' scripts/app.js` |
| Trip switching | `rg -n 'activeTripId|switchTrip|selectTrip' scripts/app.js` |
| Storage | `rg -n 'loadTripState|saveTripState|getTripStorageKey' services/storage.js` |
| Map | `rg -n 'createMapService|initMap|ensureMarkers' services/map.js` |
| Rates | `rg -n 'getStoredRateState|fetchRatesOnce' services/rates.js` |
| Cache | `rg -n 'CACHE_NAME|APP_SHELL|activate|fetch' sw.js` |

## Implementation Conventions

- The app uses Vue 3 Composition API through a CDN-loaded global build; there are no SFCs or build step.
- Prefer Tailwind utilities. Use custom CSS only when the existing design system or effect cannot be expressed clearly with utilities.
- Use `camelCase` for variables/functions and `PascalCase` only where a component or constructor name requires it.
- Preserve the existing browser-global module boundaries, including `TravelGuideConfig`, `TravelGuideStorage`, and compatibility aliases.
- Follow the full call chain when behavior crosses `scripts/app.js`, a service, trip data, template, and service worker.

## Compatibility Invariants

### Storage

- Trip data is isolated by `${tripId}_data`.
- Preserve migration from `seoul2026_data` and legacy `activeTripId`.
- Keep current saved data and legacy data readable unless a breaking migration is explicitly authorized.
- Readonly share views must not persist state.

### Share

- An unchanged built-in trip may use a direct URL.
- A modified or custom trip requires a compressed snapshot.
- Day-filtered share links preserve original Day numbering.
- Validate clipboard, native-share, URL/hash parsing, invalid payload, and browser fallback only when those paths are affected.

### Country / Map / Rates

- Runtime still normalizes legacy `GLOBAL` to `HK`.
- Country metadata, map provider/center, external link, and currency mapping must stay aligned with `TRAVEL_DATA_GUIDE.md`.
- Network failure must retain usable map/rate fallback behavior where one exists.

### App Shell / Service Worker

- `index.html` asset query URLs and matching `sw.js` `APP_SHELL` URLs must be identical.
- Local-only edits do not trigger cache changes automatically.
- Before deploying an affected app-shell JS/CSS/data asset, update its query URL, matching `APP_SHELL` entry, and `CACHE_NAME`.
- Review recovery and backward compatibility before changing storage formats or service-worker cache deletion.

## Engineering Validation Matrix

| Change | Minimum validation |
|--------|--------------------|
| Docs only | Review the diff, links, read order, duplicated rules, and referenced paths. No cache/version bump. |
| JavaScript logic | Run `node --check` on touched JS; reproduce the target behavior and inspect affected state/error paths. |
| Data shape / catalog / country | Use `TRAVEL_DATA_GUIDE.md`; syntax-check touched JS and verify consumers, trip switching, map, and currency behavior. |
| UI / layout / interaction | Read the UI guide; test affected flows on mobile and desktop. Add 768px when breakpoint behavior is touched and capture visual evidence when a browser is available. |
| Storage | Verify current and legacy loading, corrupt/missing values, reload persistence, trip switching, deletion, and cross-trip isolation as applicable. |
| Share | Test only affected direct/full, day-filtered, snapshot, readonly, clipboard/native-share, and invalid-payload paths. |
| Map | Verify touched marker replacement/removal, coordinates, bounds, provider URL, airport points, and network failure. |
| Rates | Verify API payload, abort/error handling, stored fallback, country/currency mapping, NaN/Infinity/division-by-zero, and display precision as applicable. |
| App shell / service worker | Keep query URLs and `APP_SHELL` aligned, bump `CACHE_NAME` for deployment, then smoke-test update and offline loading. |

Never claim an unrun check passed. A directly related failure blocks completion; disclose unrelated pre-existing failures without expanding scope automatically.
