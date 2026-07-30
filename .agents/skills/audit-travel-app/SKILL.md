---
name: audit-travel-app
description: Run an evidence-based Travel Guide audit covering selected or full travel-data, runtime, security, PWA, UI, accessibility, or browser behavior. Use for reviews, readiness checks, risk assessments, and full audits. Default to read-only; fixes require explicit FIX authorization and scope.
---

# Audit Travel App

## Authorization

- Treat every invocation as `AUDIT` unless the user explicitly authorizes `FIX` and names `FIX_SCOPE`.
- In `AUDIT`, do not modify files, bump versions, commit, push, deploy, or change external state.
- A full review is not permission to repair unrelated findings.

## Workflow

1. Read only the guides covering the requested audit scope. `REVIEW_PROMPT.md` is only a compatibility entry for tools that cannot invoke this skill.
2. For a full audit, read the travel, engineering, and UI guides. Do not load bundled review files unless explicitly requested.
3. Split independent read-heavy areas among read-only subagents when useful. Keep requirements, severity decisions, and final integration in the main agent.
4. Collect reproducible code, command, test, console, or visual evidence before confirming a finding.
5. Use current symbols and file locations. Mark unexecuted or inconclusive checks as `NOT RUN` or `Needs verification`.
6. Separate defects, security hardening, and maintainability suggestions. Do not invent findings or use subjective scores.
7. In authorized `FIX` mode, repair only confirmed findings inside `FIX_SCOPE`, using the routed change skill, then rerun the failing case and affected validation rows.

## Review Baseline

Select only categories in scope:

- Travel data: IDs, meal linkage, dates/order, route/location, coordinates, country metadata, and share identity.
- Runtime: initialization, state transitions, errors, storage migration/isolation, share modes, map/rates fallbacks, and async cleanup.
- Security/privacy: untrusted URL/hash/share payloads, HTML/URL sinks, external links, secrets/logs, personal data, and public-repository exposure.
- PWA/offline: manifest, service-worker install/activate/update, app-shell/version alignment, first/repeat offline load, and CDN/network failure.
- UI/accessibility: affected breakpoints, overflow, keyboard/focus/Escape, labels/ARIA, zoom/contrast, touch targets, and reduced-motion behavior.
- Browser compatibility: feature detection and fallback for Clipboard, Web Share, compression, storage, and service workers.

## Output

Report scope and mode, validations performed, release readiness, findings ordered by severity, a PASS/FAIL/NOT RUN ledger, priority fixes, needs-verification items, and residual risks.
