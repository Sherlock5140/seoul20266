@AGENTS.md

# Claude Code Adapter

Shared governance comes from the imported `AGENTS.md`. Current routes and versions come from `PROJECT_CONTEXT.md`.

- Use Plan Mode for cross-cutting changes, compatibility-sensitive work, uncertain root causes, or a previously failed approach.
- Use search and targeted reads before opening large files; follow the full call chain when behavior crosses files.
- Canonical project skills live under `.agents/skills/`. When the router selects one, read its complete `SKILL.md`.
- Keep private, machine-specific preferences in `CLAUDE.local.md`, not committed project guidance.

Before compaction, clearing, or transferring unfinished work, preserve the objective, status, changed files, validations performed and not performed, risks, blockers, remaining work, and cache/query versions when deployment assets were touched.

Lead with the conclusion. For bug or architecture work, explain root cause, evidence, impact, and tradeoffs without exposing private chain-of-thought.
