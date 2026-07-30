---
name: maintain-agent-docs
description: Review or improve this repository's AGENTS.md, model adapters, task guides, prompts, skill routing, delegation rules, and Agent Skills. Use for instruction conflicts, duplicated or stale guidance, recurring agent mistakes, skill trigger problems, or verified workflow improvements. Do not use to silently relax security, authorization, release, or data-exposure boundaries.
---

# Maintain Agent Docs

## Ownership Model

- `AGENTS.md`: workspace scope routing plus always-on authorization, quality, delegation, and skill protocol.
- `PROJECT_CONTEXT.md`: Travel app current state, subrouting, versions, and recent handoff; do not load or update it for unrelated artifact/general work.
- `CLAUDE.md`, `CODEX.md`, `GEMINI.md`: tool-specific adapters only.
- Task guides: stable travel, engineering, or UI contracts and validation requirements.
- `SKILL.md`: reusable procedures, tool workflows, and output contracts.
- Hooks, scripts, or CI: deterministic enforcement.
- `CHANGELOG.md`: history, not active instruction.

## Improvement Gate

Promote guidance only when at least one condition is evidenced:

- the same mistake or correction occurred twice;
- recurring review feedback reveals a missing rule;
- a skill misfires, fails to trigger, or repeats an avoidable step;
- a multi-step procedure is being recreated repeatedly;
- a path, command, capability, or contract is demonstrably stale;
- a verified platform or project capability changed.

Keep one-off preferences in the current prompt. Never infer permission to weaken safety, privacy, release, or external-write controls.

This gate applies to AI-proposed durable guidance. An explicit user request to create or update a Skill may proceed through the matching authoring workflow and validation.

## Workflow

1. Inventory the active instruction chain, routed guides, skills, and affected tool adapters.
2. Identify the single owning document for each proposed rule.
3. Remove duplication, circular read instructions, stale fixed line numbers, private absolute paths, unverifiable claims, and obsolete history.
4. Make the smallest complete change. Preserve user-owned worktree edits and keep central logs under one writer. When a canonical Skill is added or removed, synchronize its route, native discovery bridge, privacy allowlist, and validator baseline.
5. Run `scripts/validate-agent-docs.sh`, which validates project Skill frontmatter, metadata, routing, bridges, privacy boundaries, and agent documents.
6. Scenario-test routing with direct, indirect, incomplete, negative, and boundary requests. Include travel wording, runtime/share, UI, audit, deployment, and agent-doc cases when the router changes.
7. Forward-test complex skill changes with fresh read-only agents using raw task prompts; do not leak the intended answer.
8. Inspect the final diff for secrets, personal paths, internal artifacts, widened permissions, and public-repository exposure.
9. Update only the owning context or history. Update `PROJECT_CONTEXT.md` only when Travel current state, routing, versions, or exposure boundaries changed.

## Adoption

Report the observed signal, owning file, changes adopted or rejected, route tests, security review, remaining uncertainty, and rollback path.
