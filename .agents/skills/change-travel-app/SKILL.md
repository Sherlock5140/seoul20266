---
name: change-travel-app
description: Implement and validate scoped Travel Guide runtime, JavaScript, storage, share, map, rates, UI, service-worker, or cache changes. Use when the Travel Guide app's behavior or visual interface must change; do not use for plain itinerary wording, slide decks, documents, or other artifacts that do not modify the app.
---

# Change Travel App

## Workflow

1. Read `ENGINEERING_GUIDE.md`.
2. Add `SEOUL20266_UI_STYLE_GUIDE.md` for visual, responsive, modal, map-panel, or interaction work. Add `TRAVEL_DATA_GUIDE.md` when trip semantics or data shapes are involved.
3. Diagnose first when the root cause is uncertain, then search by stable symbols and trace the complete local call chain.
4. Make the smallest complete change while preserving storage, share, country/map/rates, and offline compatibility.
5. Run the affected engineering validation rows. Capture browser evidence for UI behavior when a browser is available.
6. Change query versions, `APP_SHELL`, and `CACHE_NAME` only when the deployment-sensitive rule in the engineering guide applies.

## Handoff

Report behavioral impact, files changed, validation evidence, checks not run, compatibility risks, cache/version changes, and remaining work.
