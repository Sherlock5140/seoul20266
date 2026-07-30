---
name: maintain-agent-docs
description: Review or improve this repository's AGENTS.md, model adapters, task guides, prompts, skill routing, delegation rules, and Agent Skills. Use for instruction conflicts, duplicated or stale guidance, recurring agent mistakes, skill trigger problems, or verified workflow improvements. Do not use to silently relax security, authorization, release, or data-exposure boundaries.
---

# Maintain Agent Docs

## Ownership Model

- `AGENTS.md`: always-on governance, authorization, quality, delegation, and skill protocol.
- `PROJECT_CONTEXT.md`: current state, document/skill routing, versions, and recent handoff.
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

## Workflow

1. Inventory the active instruction chain, routed guides, skills, and affected tool adapters.
2. Identify the single owning document for each proposed rule.
3. Remove duplication, circular read instructions, stale fixed line numbers, private absolute paths, unverifiable claims, and obsolete history.
4. Make the smallest complete change. Preserve user-owned worktree edits and keep central logs under one writer.
5. Validate every skill with the repository's skill validator and validate all agent documents with `scripts/validate-agent-docs.sh`.
6. Scenario-test routing with direct, indirect, incomplete, negative, and boundary requests. Include travel wording, runtime/share, UI, audit, deployment, and agent-doc cases when the router changes.
7. Forward-test complex skill changes with fresh read-only agents using raw task prompts; do not leak the intended answer.
8. Inspect the final diff for secrets, personal paths, internal artifacts, widened permissions, and public-repository exposure.
9. Update `PROJECT_CONTEXT.md` once. Update history only when a completed change needs archival.

## Adoption

Report the observed signal, owning file, changes adopted or rejected, route tests, security review, remaining uncertainty, and rollback path.

Require explicit user approval before committing, pushing, publishing, installing external dependencies, or changing security/release policy.
