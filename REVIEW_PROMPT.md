# Review Prompt Compatibility Entry

Canonical audit workflow: `.agents/skills/audit-travel-app/SKILL.md`.

Use this file only when the current tool cannot invoke `$audit-travel-app` directly.

```text
MODE: AUDIT
FIX_SCOPE: none

Read AGENTS.md and PROJECT_CONTEXT.md, then read
.agents/skills/audit-travel-app/SKILL.md and the guides routed for this scope.

AUDIT is read-only. FIX is allowed only when the user explicitly sets MODE to
FIX and names FIX_SCOPE. Collect reproducible evidence, mark unrun checks as
NOT RUN, and do not invent findings, scores, or release readiness.
```
