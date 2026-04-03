# Claude Code Project Entry

This file is the Claude Code-specific entry point for this repository.

Before making any analysis or edits:
1. Read `AGENTS.md`
2. Read `PROJECT_CONTEXT.md`
3. If the task touches UI, layout, modal behavior, responsive logic, header controls, share mode, or visual bug fixes, also read `SEOUL20266_UI_STYLE_GUIDE.md`

Project facts:
- This is a static PWA travel itinerary app.
- Do not assume React, Next.js, TypeScript, or a build step.
- Use `PROJECT_CONTEXT.md` as the shared source of truth for architecture, recent changes, and update-log rules.

Collaboration rules:
- Claude Code, Codex, and Gemini must all use the same shared rules in `PROJECT_CONTEXT.md`.
- Do not overwrite another editor's update-log entry.
- If you discover a problem in an older change, add a new follow-up entry instead of rewriting history.
- After any meaningful code, UI, trip-data, map, cache, share, or docs change, update `PROJECT_CONTEXT.md`.
- If UI rules changed, also update `SEOUL20266_UI_STYLE_GUIDE.md`.

Update-log rules:
- Before writing `Updated at`, run `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`.
- Never guess the time.
- Write one update-log entry per work session or commit.
- List the files that actually changed.

Suggested task order:
1. Read entry docs
2. Inspect the relevant code
3. Make changes
4. Update `PROJECT_CONTEXT.md`
5. Update `SEOUL20266_UI_STYLE_GUIDE.md` if needed

