#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
cd "$repo_root"

secret_mode="${1:---tracked}"
shift || true

case "$secret_mode" in
  --staged|--worktree|--tracked)
    test "$#" -eq 0 || {
      echo "Usage: $0 --staged | --worktree | --tracked | --range <base> <head>" >&2
      exit 2
    }
    ;;
  --range)
    test "$#" -eq 2 || {
      echo "Usage: $0 --range <base> <head>" >&2
      exit 2
    }
    ;;
  *)
    echo "Usage: $0 --staged | --worktree | --tracked | --range <base> <head>" >&2
    exit 2
    ;;
esac

bash -n \
  .githooks/pre-commit \
  .githooks/pre-push \
  scripts/check-repository-secrets.sh \
  scripts/validate-agent-docs.sh \
  scripts/validate-agent-routing-fixtures.sh \
  scripts/validate-agent-system.sh

./scripts/validate-agent-docs.sh
./scripts/validate-agent-routing-fixtures.sh
./scripts/check-repository-secrets.sh "$secret_mode" "$@"

case "$secret_mode" in
  --staged)
    git diff --cached --check
    ;;
  --worktree)
    git diff --check
    git diff --cached --check
    ;;
  --tracked)
    ;;
  --range)
    git diff --check "$1" "$2" --
    ;;
esac

echo "AI Agent system validation passed."
