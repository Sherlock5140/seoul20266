# Security checks

This repository has two complementary security layers:

- `.github/workflows/agent-governance.yml` runs deterministic Agent-document,
  routing-contract, diff, shell, and high-confidence secret checks without an
  external AI service.
- `.github/workflows/codex-security.yml` is an optional report-only semantic
  security scan. Same-repository pull requests are scanned only after its
  package variable and API-key secret are configured. Current enablement has
  not been verified.

Run the deterministic gate locally with:

```bash
./scripts/validate-agent-system.sh --worktree
```

The tracked `.githooks/pre-commit` runs the staged form of the same gate.
Install the tracked hook path explicitly with:

```bash
git config --local core.hooksPath .githooks
```

The tracked hook is local-only: it does not push, publish, call an external AI
service, or edit files. Commit, push, PR, and deployment remain separately
authorized release actions.

## Enable the workflow

Codex Security CLI and SDK access is currently limited to approved customers
and partners. After access is granted, configure these GitHub repository or
organization settings:

1. Add the secret `CODEX_SECURITY_API_KEY`.
2. Add the variable `CODEX_SECURITY_PACKAGE` with the approved package source
   supplied with the access instructions.
3. For a private or internal repository, enable GitHub Code Security if SARIF
   results should appear in code scanning.

The workflow intentionally:

- scans only trusted, same-repository pull requests;
- skips Dependabot because normal Actions secrets are unavailable there;
- installs the scanner outside the checked-out repository;
- scans the committed pull-request diff;
- uploads SARIF when available;
- does not publish raw scan artifacts.

The initial policy is report-only. After reviewing scan quality and runtime,
add `--fail-on-severity high` to the `Scan the pull request` step to make high
and critical findings fail the check. Then make `Codex Security scan` a
required branch-protection check if it should block merging.

`CODEOWNERS` assigns governance and workflow review to the maintainer, but it
does not enforce approval by itself. Enable branch protection with
**Require review from Code Owners** before treating that ownership as a merge
control.

## Run a local scan

Local scans require Node.js 22 or later, Python 3.10 or later, Codex Security
access, and the approved package:

```bash
npm install --prefix /tmp/codex-security "$CODEX_SECURITY_PACKAGE"
/tmp/codex-security/node_modules/.bin/codex-security login
/tmp/codex-security/node_modules/.bin/codex-security scan .
```

Keep generated scan results outside the repository because they can contain
source snippets, vulnerability evidence, and remediation details.

## Public repository boundary

This repository is public. Do not commit credentials, private reservations,
contact details, nonpublic travel notes, local scan results, or generated work
artifacts. Secret and variable names may be documented; their values must stay
in GitHub secret storage and must not be printed in logs.

Passwords, decryption secrets, private keys, recovery codes, session tokens,
and credential values must never be committed. A public encryption recipient
key may be tracked when needed; its corresponding private identity must remain
outside Git, task logs, generated artifacts, and repository backups.

`scripts/check-repository-secrets.sh` is a high-confidence safeguard, not a
complete credential classifier. Keep GitHub push protection or an equivalent
secret-scanning control enabled, and review staged filenames before every
release.

Changing or deleting a public file does not remove it from Git history. Treat
previously committed sensitive data as exposed and use a private, sanitized
backup strategy before publishing additional trip details.

Official documentation:

- <https://learn.chatgpt.com/docs/security/cli>
- <https://learn.chatgpt.com/docs/security/cli/ci>
- <https://github.com/openai/codex-security>
