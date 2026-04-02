# PROJECT_CONTEXT

## Start Here For Any AI

Read this file before:
- editing code
- changing trip data
- changing service worker cache versions
- changing country, map, or currency behavior

If you are continuing work in this repo, use this file as the first source of truth.

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
- Service worker cache version is currently `travel-guide-v9`.
- Frontend asset query version is currently `20260402d`.

## Rules Future AI Should Follow

1. Do not reintroduce `GLOBAL` as a real country code.
2. If adding a new country, update `scripts/config.js` first.
3. If adding a new currency, make sure `services/rates.js` supports it.
4. If changing frontend JS/CSS assets, also update:
- `index.html` asset query version
- `sw.js` cache version and shell asset list
5. Keep backward compatibility for existing localStorage data unless the user explicitly asks to break/reset it.
6. Do not assume `data/seoul-2026.js` only contains Seoul.

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
