# Travel Data Guide

This is the source of truth for itinerary content, country metadata, and trip data integrity.
Use `$edit-itinerary-data` for the change workflow and this guide for the stable data contract and validation requirements.

This guide does not own application code, storage/share internals, service-worker behavior, or UI styling. Use `ENGINEERING_GUIDE.md` and `SEOUL20266_UI_STYLE_GUIDE.md` for those areas.

## Data Sources

| File | Purpose |
|------|---------|
| `data/trip-catalog.js` | Built-in trip registry and default trip |
| `data/seoul-2026.js` | Seoul built-in itinerary |
| `data/hongkong-2026.js` | Hong Kong built-in itinerary |
| `scripts/config.js` | Country labels, map provider, center, and currency mapping |

Keep every built-in trip in its own data file and register it through `data/trip-catalog.js`.

## Country Model

| Code | Country | Map | Currency |
|------|---------|-----|----------|
| `KR` | Korea | NAVER Map | KRW |
| `HK` | Hong Kong | Google Maps | HKD |
| `JP` | Japan | Google Maps | JPY |
| `TH` | Thailand | Google Maps | THB |
| `INTL` | Generic | Google Maps | USD |

- Never add new data with the legacy `GLOBAL` code; runtime normalization maps it to `HK`.
- Add a new country in `scripts/config.js` before referencing it in trip metadata.
- A country change must keep map-provider, map center, external-map URL, and currency behavior aligned.

## Data Shapes

**Trip:** `tripId`, `meta.title`, `meta.country`, `schedule[]`

**Day:** `date`, `title`, `lunch/lunchId`, `tea/teaId`, `dinner/dinnerId`, `notice?`, `events[]`

**Event:** `id`, `time`, `location`, `map_term?`, `category`, `note`, `tags?`, `coords?`, `spots?`

**Spot:** `name`, `type?`, `priority?`, `note?`, `coords?`

Coordinates use `[latitude, longitude]` or `null`. `map_term` is optional and should be used when the display name is not the best external-map search term.

## Data Integrity Rules

1. Keep `tripId` stable and unique; changing it creates a different storage namespace and share identity.
2. Keep event IDs unique within a trip and stable when an existing event is edited.
3. `lunchId`, `teaId`, and `dinnerId` must reference the intended event ID or be `null`.
4. Preserve the written Day number when filtering or sharing selected days.
5. Verify dates, weekdays, event order, transition time, meal summary, route wording, station names, and coordinates affected by an edit.
6. Use `spots` for optional area-level sublocations; do not replace the main event identity with an unstructured list.
7. Plain wording edits stay in the relevant trip data file. Do not change UI, catalog, cache, or unrelated code unless the data shape or requested deployment requires it.
8. Local-only content edits do not trigger version changes automatically. For deployment, follow `ENGINEERING_GUIDE.md`.

## Travel Data Validation

| Change | Minimum validation |
|--------|--------------------|
| Plain wording | Run `node --check` on the edited data file; verify the touched Day, event, meal summary, and location text. |
| Time / route / location | Check sequence consistency, realistic transition windows, station/route wording, and affected coordinates or `map_term`. |
| Meal linkage | Confirm every touched meal ID resolves to the intended food event and the summary matches the event content. |
| New or moved event | Check unique/stable ID, chronological placement, category, notes, coordinates, and dependent meal IDs. |
| Data shape / `spots` | Syntax-check the file and verify code consumers in `scripts/app.js` and `services/map.js`; then use the engineering validation matrix. |
| Catalog / new trip | Verify registration, unique `tripId`, metadata, country mapping, trip switching, and storage namespace. |
| New country | Verify `scripts/config.js`, map provider/center, external-map link behavior, currency mapping, and fallback behavior. |
