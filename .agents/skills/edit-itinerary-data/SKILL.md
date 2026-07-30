---
name: edit-itinerary-data
description: Safely edit Travel Guide itinerary wording, days, events, meals, routes, coordinates, trip catalog entries, or country metadata. Use for changes centered on trip data; do not use for runtime-only, UI-only, cache-only, or deployment-only work.
---

# Edit Itinerary Data

## Workflow

1. Read `PROJECT_CONTEXT.md` and `TRAVEL_DATA_GUIDE.md`.
2. Classify the request as wording, timing, route/location, meal linkage, event movement, schema/catalog, or country metadata.
3. Read only the relevant trip data and consumers. Add `ENGINEERING_GUIDE.md` when schema, catalog, country, map, share, storage, or deployment behavior is affected.
4. Verify unstable travel facts with current authoritative sources. Mark uncertain facts instead of guessing.
5. Preserve stable trip/event IDs, meal linkage, original Day numbering, coordinate order, and storage/share identity.
6. Make the smallest complete data edit. Do not add UI polish, cache changes, or unrelated itinerary restructuring.
7. Run the matching validation row in `TRAVEL_DATA_GUIDE.md`; use the engineering matrix when consumers are affected.
8. Update `PROJECT_CONTEXT.md` once for a meaningful completed change. Update the travel guide only when its data contract changes.

## Delegation

- Delegate independent route, date, station, or coordinate research as read-only work when it saves time.
- Keep one writer for each trip data file.
- Recheck delegated facts against the edited data before accepting them.

## Handoff

Report the trip and Day/event scope, files changed, facts and linkages verified, checks not run, uncertainty, and whether engineering, UI, version, or deployment follow-up remains.

Do not commit, push, or deploy unless the user explicitly authorizes release or sync work.
