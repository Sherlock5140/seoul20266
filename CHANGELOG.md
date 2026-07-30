# Changelog Archive

Historical record only. This file is not active agent instruction.
For current state and the three most recent handoffs, use `PROJECT_CONTEXT.md`.

Detailed personal itinerary timings, reservations, lodging, and group movement
are intentionally excluded from this public archive.

---

## 2026-07

- Added a report-only Codex Security pull-request workflow and setup guidance.
- Split travel-data rules from engineering/runtime rules and reduced the shared
  context file to current state and routing.
- Centralized task modes, evidence gates, scope boundaries, and audit/fix
  authorization across the AI entry documents.

## 2026-05

- Generalized browser globals to `TravelGuide*` while retaining compatibility
  aliases.
- Separated built-in trips into independent data files and a shared catalog.
- Added catalog-version synchronization for stale saved built-in trips.
- Added optional area `spots` support in itinerary data, UI, and map consumers.
- Refined itinerary content, travel wording, and timeline wrapping without
  changing the data contract.
- Refreshed code-navigation and map/data validation guidance.

## 2026-04

- Added the multi-country configuration foundation and legacy country-code
  normalization.
- Hardened localStorage, rate persistence, clipboard fallback, and error
  reporting.
- Added direct, day-filtered, and compressed-snapshot sharing with readonly and
  manual-copy fallbacks.
- Improved share loading feedback, mobile action layout, responsive settings,
  accessibility labels, and offline fallback.
- Corrected airport-marker visibility and map focus behavior.
- Added Claude, Codex, and Gemini project adapters plus the original UI guide
  and review prompt.
- Introduced the compact recent-log/archive model for project handoff.
