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
- `tests/agent-routing-cases.tsv`: routing expectations for structural validation and model forward tests.
- Hooks, scripts, or CI: deterministic enforcement; they must not silently widen release or external-write authority.
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
5. Run `scripts/validate-agent-system.sh`, which composes document, routing-fixture, shell, diff, and repository secret checks.
6. Scenario-test routing against `tests/agent-routing-cases.tsv`. Maintain direct, indirect, incomplete, negative, cross-scope, and boundary coverage, including travel wording, runtime/share, UI, audit, deployment, artifacts, external actions, and agent governance.
7. Treat fixture validation as contract validation, not proof of model judgment. Forward-test material routing or Skill-trigger changes with fresh read-only agents using raw task prompts; do not leak the intended answer.
8. Inspect the final diff for secrets, personal paths, internal artifacts, widened permissions, public-repository exposure, and hook or CI side effects.
9. Update only the owning context or history. Update `PROJECT_CONTEXT.md` only when Travel current state, routing, versions, or exposure boundaries changed.

When an adapter command, discovery path, or capability changes, record the installed CLI version and verify the claim against bundled or current official documentation. Treat unverified interactive behavior as `NOT RUN`, not as fact.

## Completion and Stop Conditions

- Complete only when the owning documents are consistent, deterministic checks pass, representative routing cases are evaluated, and unrun model/tool checks are disclosed.
- Stop before changing branch protection, repository settings, hooks outside the tracked hook path, secrets, external services, commits, pushes, or deployments unless the user explicitly authorizes that state change.
- If a proposed control relies only on model compliance, identify the missing script, CI, permission, or human-review gate instead of calling it enforced.

## Adoption

Report the observed signal, owning file, changes adopted or rejected, route tests, security review, remaining uncertainty, and rollback path.
