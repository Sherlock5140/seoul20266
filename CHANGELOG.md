# Changelog Archive

Older update-log entries moved here to keep `PROJECT_CONTEXT.md` lean.
For recent entries see the Update Log section in `PROJECT_CONTEXT.md`.

---

- 2026-04-03
  Updated at: 2026-04-03 13:47 CST
  Updated by: Codex
  Type: Docs
  Summary: Added CODEX.md; all three AIs now have dedicated entry files.
  Files: `CODEX.md`, `AGENTS.md`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 11:15 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary: Map marker: 15% offset via project/subtract/unproject, pin at ~65% from top.
  Cache: v14 → v15; asset: 20260402i → 20260402j.
  Files: `services/map.js`, `sw.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 11:11 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary: Removed getHighlightOffset(); replaced with direct flyTo(event.coords). autoPan: false retained.
  Cache: v13 → v14; asset: 20260402h → 20260402i.
  Files: `services/map.js`, `sw.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:58 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary:
  - Fixed map marker centering issue affecting all itinerary events on mobile: previous fix placed marker at 38% from top, putting popup (~70px above marker) within 36px of map top edge. Leaflet autoPan with topLeft padding [20, 180] then overrode flyTo by forcing popup 180px from top, pushing marker to map bottom and covering the itinerary panel.
  - `getHighlightOffset()`: changed target position from 38% to 55% from top.
  - `autoPan: false` set on all marker popups. Removed `getPopupPadding()`.
  - Cache: v12 → v13; asset: 20260402g → 20260402h.
  Files: `services/map.js`, `sw.js`, `index.html`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:51 CST
  Updated by: Claude Code
  Type: Docs
  Summary: Added transparency rules to `CLAUDE.md`.
  Files: `CLAUDE.md`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:50 CST
  Updated by: Claude Code
  Type: Docs, Infra
  Summary: Rewrote Gemini CLI rules in CLAUDE.md with precise Flash/Pro model-selection logic.
  Files: `CLAUDE.md`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:45 CST
  Updated by: Claude Code
  Type: Infra, Docs
  Summary: Gemini CLI (v0.36.0) installed and configured in CLAUDE.md.
  Files: `CLAUDE.md`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:42 CST
  Updated by: Codex
  Type: Docs
  Summary: Added CLAUDE.md and GEMINI.md as AI-specific entry files.
  Files: `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`, `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:21 CST
  Updated by: Claude Code
  Type: Docs
  Summary: Corrected placeholder timestamp in map fix entry. Added Rules 9 and 12.
  Files: `PROJECT_CONTEXT.md`

- 2026-04-03
  Updated at: 2026-04-03 10:20 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary: Fixed map marker centering offset on mobile (fixed px → dynamic % of container height, 38% from top).
  Cache: v11 → v12; asset: 20260402f → 20260402g.
  Files: `services/map.js`, `sw.js`, `index.html`

- 2026-04-02
  Updated at: 2026-04-02 22:19 CST
  Updated by: Codex
  Type: Docs
  Summary: Normalized older Codex entries to include Updated at, Summary, and Files.
  Files: `PROJECT_CONTEXT.md`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Optimization, UI, Infra
  Summary:
  - `formattedNotes` / `formattedDayNotice` computed added.
  - `copyEventLocation` with 1800ms visual feedback; 44px touch target.
  - `shareLoading` ref with spinner.
  - `closeSettings()` helper.
  - Settings/Rates modal ARIA. Day tabs role="tablist/tab". Rate inputs type="text" + inputmode="decimal".
  - `offline.html` created; sw.js navigate handler falls back to it.
  - Cache: v10 → v11; asset: 20260402e → 20260402f.
  Files: `scripts/app.js`, `index.html`, `sw.js`, `offline.html`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Docs
  Summary: Audited Codex changes; verified airport-distance Haversine logic correct.
  Files: `PROJECT_CONTEXT.md`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Bug Fix
  Summary: Fixed Codex bug where applyTripState storage errors were silently overwritten by success notices.
  Files: `scripts/app.js`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Optimization
  Summary: Share URL compression via CompressionStream (deflate-raw), ~60–75% smaller. Backward-compatible.
  Files: `scripts/utils.js`, `scripts/app.js`

- 2026-04-02
  Updated at: 2026-04-02 22:04 CST
  Updated by: Claude Code
  Type: Bug Fix, Infra
  Summary: localStorage wrapped in safe wrappers. rates.js SecurityError protection. sw.js skipWaiting moved inside waitUntil.
  Files: `services/storage.js`, `services/rates.js`, `services/map.js`, `sw.js`, `scripts/app.js`

- 2026-04-02
  Updated at: 2026-04-02 22:02 CST
  Updated by: Codex
  Type: Bug Fix, Data
  Summary: Day-level map overview keeps airport markers when airport/city stops are far apart (12km threshold).
  Files: `services/map.js`, `data/seoul-2026.js`

- 2026-04-02
  Updated at: 2026-04-02 21:47 CST
  Updated by: Codex
  Type: Docs
  Summary: Update-log format now records editor, change type, exact timestamp, and forbids overwriting other editors' entries.
  Files: `PROJECT_CONTEXT.md`, `AGENTS.md`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: Bug Fix, Optimization
  Summary: storage.js returns success booleans; app.js surfaces storage failures; utils.js clipboard returns success/failure; rates.js precision fix.
  Files: `services/storage.js`, `scripts/app.js`, `scripts/utils.js`, `services/rates.js`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: Data, Infra
  Summary: Multi-country foundation: KR, HK, JP, TH, INTL. Legacy GLOBAL → HK normalization.
  Files: `scripts/config.js`, `services/storage.js`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: Optimization
  Summary: Rate handling generalized for HKD, JPY, THB.
  Files: `services/rates.js`, `scripts/app.js`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: Optimization, Infra
  Summary: PWA relaunch favors cached shell. Versions: travel-guide-v10 / 20260402e.
  Files: `sw.js`, `scripts/app.js`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: UI
  Summary: Settings trip management simplified into direct dropdown switching.
  Files: `index.html`, `scripts/app.js`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: UI
  Summary: Mobile/desktop settings spacing and hierarchy polished.
  Files: `index.html`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: Bug Fix, Data
  Summary: Airport markers visible in overview with fit-bounds preferring non-airport points.
  Files: `services/map.js`, `data/seoul-2026.js`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: UI
  Summary: Header controls enlarged for safer tapping.
  Files: `index.html`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: UI
  Summary: Settings modal: larger controls, larger typography, better desktop/mobile scale.
  Files: `index.html`

- 2026-04-02
  Updated at: (predates format requirement)
  Updated by: Codex
  Type: Docs, UI
  Summary: SEOUL20266_UI_STYLE_GUIDE.md expanded into full UI behavior and bug-fix manual.
  Files: `SEOUL20266_UI_STYLE_GUIDE.md`, `PROJECT_CONTEXT.md`, `AGENTS.md`
