# Codex Project Entry

Before making any analysis or edits:
1. Read `PROJECT_CONTEXT.md`
2. If repo-level coordination, update-log rules, or editor handoff context need reconfirmation, read `AGENTS.md`
3. If the task touches UI, layout, modal behavior, responsive logic, header controls, share mode, or visual bug fixes, also read `SEOUL20266_UI_STYLE_GUIDE.md`

Project facts:
- This is a static PWA travel itinerary app.
- Do not assume React, Next.js, TypeScript, or a build step.
- Use `PROJECT_CONTEXT.md` as the shared source of truth for architecture, recent changes, and update-log rules.

Collaboration rules:
- Claude Code, Codex, and Gemini all follow the same shared rules in `PROJECT_CONTEXT.md`.
- Do not overwrite another editor's update-log entry.
- If you discover a problem in an older change, add a new follow-up entry instead of rewriting history.
- After any meaningful code, UI, trip-data, map, cache, share, or docs change, update `PROJECT_CONTEXT.md`.
- If UI rules changed, also update `SEOUL20266_UI_STYLE_GUIDE.md`.

Update-log rules:
- Before writing `Updated at`, run `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`.
- Never guess the time.
- Write one update-log entry per work session or commit.
- List the files that actually changed.

Token saving:
- Do not read `SEOUL20266_UI_STYLE_GUIDE.md` unless the task is UI-related.
- Do not auto-load `FULL_APP_REVIEW_BUNDLE.md`, `COMPLETE_APP_REVIEW_BUNDLE.md`, or `MULTI_TRIP_REVIEW_BUNDLE.md` unless a full bundled review is explicitly needed.

## Itinerary Edit Workflow

When the user asks to modify itinerary content:

1. Read scope first
- Use `PROJECT_CONTEXT.md` as the primary source of truth
- Only consult `AGENTS.md` or this `CODEX.md` again when coordination rules or workflow rules need reconfirmation
- Only read `SEOUL20266_UI_STYLE_GUIDE.md` for UI / layout / display issues

2. Compare new content against the current trip data
- Check the relevant trip data file first, usually `data/seoul-2026.js`
- Only inspect `data/trip-catalog.js` when the task might affect trip registration
- Verify:
  - dates and Day titles
  - event timing consistency
  - meal summary linkage
  - location / station / route / coordinate sanity
  - whether built-in shared data still stays linked correctly

3. Keep edit scope minimal by default
- Plain itinerary edits should stay in the relevant data file only
- Do not proactively edit:
  - `data/trip-catalog.js`
  - `index.html`
  - `sw.js`
  - unrelated files or folders

4. Expand scope only when necessary
- Data structure changed
  - e.g. new fields, event-shape changes, `spots`-type additions
- Display or interaction is affected
  - e.g. layout breakage, wrong share output, map/summary mismatch
- The user explicitly asks to sync live
  - then commit / push
  - and only bump versions/cache when actually needed

5. Do not add unrequested “helpful” optimizations
- No automatic version bumps for plain data wording edits
- No automatic cache changes for plain data wording edits
- No extra wording / structure / UI polish unless requested or directly required by the change

6. Validate with minimum necessary scope
- Plain data edits: prefer data-file syntax checks first
- UI / logic edits: add only the checks needed for the touched area

One-line rule:
`Plain itinerary content edits should stay in the relevant data file first; only expand into UI, versioning, cache, or other files when the change actually requires it.`
