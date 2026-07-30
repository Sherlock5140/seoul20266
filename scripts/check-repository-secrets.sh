#!/usr/bin/env bash

# Bash 3.2 treats a declared-but-empty array as unbound under `set -u`.
# Keep strict error and pipeline handling while supporting the macOS system Bash.
set -eo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
cd "$repo_root"

usage() {
  echo "Usage: $0 --staged | --worktree | --tracked | --range <base> <head>" >&2
  exit 2
}

mode="${1:-}"
shift || true

scan_paths=()
untracked_paths=()

collect_zero_delimited() {
  local target="$1"
  shift
  local path

  while IFS= read -r -d '' path; do
    if test "$target" = "untracked"; then
      untracked_paths+=("$path")
    else
      scan_paths+=("$path")
    fi
  done < <("$@")
}

case "$mode" in
  --staged)
    test "$#" -eq 0 || usage
    collect_zero_delimited scan git diff --cached --name-only -z --diff-filter=ACMR --
    ;;
  --worktree)
    test "$#" -eq 0 || usage
    collect_zero_delimited scan git diff HEAD --name-only -z --diff-filter=ACMR --
    collect_zero_delimited untracked git ls-files --others --exclude-standard -z
    ;;
  --tracked)
    test "$#" -eq 0 || usage
    collect_zero_delimited scan git ls-files -z
    ;;
  --range)
    test "$#" -eq 2 || usage
    base_revision="$1"
    head_revision="$2"
    git rev-parse --verify "$base_revision^{commit}" >/dev/null
    git rev-parse --verify "$head_revision^{commit}" >/dev/null
    while IFS= read -r commit_revision; do
      test -n "$commit_revision" || continue
      collect_zero_delimited scan \
        git diff-tree -m --root --no-commit-id --name-only -r -z \
        --diff-filter=ACMR "$commit_revision"
    done < <(git rev-list --reverse "$base_revision..$head_revision")
    ;;
  *)
    usage
    ;;
esac

is_sensitive_path() {
  local path="$1"
  local base_name="${path##*/}"

  case "$base_name" in
    .env.example|.npmrc.example|*.pub|*.crt|*.cer)
      return 1
      ;;
    .env|.env.*|.npmrc|.netrc|*.key|*.pem|*.p12|*.pfx|*.jks|*.keystore|id_rsa|id_ed25519|id_ecdsa|age-identity*|*.agekey|credentials*.json|service-account*.json)
      return 0
      ;;
  esac

  return 1
}

for path in "${scan_paths[@]}" "${untracked_paths[@]}"; do
  if is_sensitive_path "$path"; then
    echo "FAIL: sensitive credential or private-key filename is in the candidate change set." >&2
    exit 1
  fi
done

github_pattern='gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}'
aws_pattern='(AKIA|ASIA)[0-9A-Z]{16}'
google_pattern='AIza[0-9A-Za-z_-]{35}'
slack_pattern='xox[baprs]-[0-9A-Za-z-]{20,}'
openai_pattern='sk[-_][A-Za-z0-9_-]{16,}'
private_marker='-----BEGIN [A-Z0-9 ]*PRIVATE'
private_marker+=' KEY-----'
age_marker='AGE-SECRET'
age_marker+='-KEY-1[0-9A-Z]{20,}'
secret_pattern="$github_pattern|$aws_pattern|$google_pattern|$slack_pattern|$openai_pattern|$private_marker|$age_marker"

secret_found=0
scan_error=0

scan_diff() {
  local status

  set +e
  "$@" | awk '
    /^\+\+\+ / { next }
    /^\+/ {
      sub(/^\+/, "")
      print
    }
  ' | rg -q "$secret_pattern"
  status=$?
  set -e

  case "$status" in
    0) secret_found=1 ;;
    1) ;;
    *) scan_error=1 ;;
  esac
}

scan_files() {
  local path
  local status
  shift
  test "$#" -gt 0 || return 0

  for path in "$@"; do
    test -e "$path" || continue

    set +e
    rg -q "$secret_pattern" -- "$path"
    status=$?
    set -e

    case "$status" in
      0) secret_found=1 ;;
      1) ;;
      *) scan_error=1 ;;
    esac
  done
}

case "$mode" in
  --staged)
    scan_diff git diff --cached --no-color --unified=0 --diff-filter=ACMR --
    ;;
  --worktree)
    scan_diff git diff HEAD --no-color --unified=0 --diff-filter=ACMR --
    scan_files untracked "${untracked_paths[@]}"
    ;;
  --tracked)
    scan_files tracked "${scan_paths[@]}"
    ;;
  --range)
    while IFS= read -r commit_revision; do
      test -n "$commit_revision" || continue
      parent_revision="$(git rev-list --parents -n 1 "$commit_revision" | awk '{ print $2 }')"
      if test -n "$parent_revision"; then
        scan_diff git diff "$parent_revision" "$commit_revision" --no-color --unified=0 --diff-filter=ACMR --
      else
        scan_diff git show --root --format= --no-color --unified=0 --diff-filter=ACMR "$commit_revision"
      fi
    done < <(git rev-list --reverse "$base_revision..$head_revision")
    ;;
esac

if test "$scan_error" -ne 0; then
  echo "FAIL: repository secret scan could not inspect the complete candidate change set." >&2
  exit 2
fi

if test "$secret_found" -ne 0; then
  echo "FAIL: possible secret or private-key material found; matched content is intentionally not printed." >&2
  exit 1
fi

echo "Repository secret check passed for $mode."
