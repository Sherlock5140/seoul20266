---
name: change-travel-app
description: Implement and validate scoped Travel Guide runtime, JavaScript, storage, share, map, rates, UI, service-worker, or cache changes. Use for application behavior or presentation changes; do not use for plain itinerary wording that has no runtime or UI impact.
---

# Change Travel App

## Workflow

1. Read `PROJECT_CONTEXT.md` and `ENGINEERING_GUIDE.md`.
2. Add `SEOUL20266_UI_STYLE_GUIDE.md` for visual, responsive, modal, map-panel, or interaction work. Add `TRAVEL_DATA_GUIDE.md` when trip semantics or data shapes are involved.
3. Identify the task mode and authorization boundary before editing. Diagnose first when the root cause is uncertain.
4. Search by the stable symbols in the engineering guide and trace the complete local call chain.
5. Make the smallest complete change while preserving storage, share, country/map/rates, and offline compatibility.
6. Keep parallel agents read-only unless they own disjoint files. Use one writer for central runtime or documentation files.
7. Run the affected engineering validation rows. Capture browser evidence for UI behavior when a browser is available.
8. Change query versions, `APP_SHELL`, and `CACHE_NAME` only when the deployment-sensitive rule in the engineering guide applies.
9. Update `PROJECT_CONTEXT.md` once after meaningful changes. Update a task guide only when its owned contract changes.

## Handoff

Report behavioral impact, files changed, validation evidence, checks not run, compatibility risks, cache/version changes, and remaining work.

Do not commit, push, deploy, or publish unless the user explicitly authorizes release or sync work.
