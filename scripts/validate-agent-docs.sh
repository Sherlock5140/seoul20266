#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
cd "$repo_root"

failures=0

fail() {
  echo "FAIL: $1" >&2
  failures=$((failures + 1))
}

required_files=(
  AGENTS.md
  PROJECT_CONTEXT.md
  CLAUDE.md
  CODEX.md
  GEMINI.md
  TRAVEL_DATA_GUIDE.md
  ENGINEERING_GUIDE.md
  SEOUL20266_UI_STYLE_GUIDE.md
  REVIEW_PROMPT.md
  SECURITY.md
  CHANGELOG.md
)

for file in "${required_files[@]}"; do
  test -f "$file" || fail "missing required document: $file"
done

agent_paths=(
  "${required_files[@]}"
  .agents/skills
)

if rg -q '(/Users/[^/]+/|/home/[^/]+/|[A-Z]:\\Users\\)' "${agent_paths[@]}"; then
  fail "private absolute path found in agent documentation"
fi

if rg -q '#L[0-9]+' AGENTS.md PROJECT_CONTEXT.md TRAVEL_DATA_GUIDE.md ENGINEERING_GUIDE.md SEOUL20266_UI_STYLE_GUIDE.md REVIEW_PROMPT.md; then
  fail "fixed line-number link found in active guidance"
fi

if rg -q '\[TODO|TODO:' .agents/skills; then
  fail "unfinished skill template content found"
fi

for bundle in FULL_APP_REVIEW_BUNDLE.md COMPLETE_APP_REVIEW_BUNDLE.md MULTI_TRIP_REVIEW_BUNDLE.md; do
  test ! -e "$bundle" || fail "generated review bundle must not live in the repository root: $bundle"
done

skill_count=0
for skill_dir in .agents/skills/*; do
  test -d "$skill_dir" || continue
  skill_count=$((skill_count + 1))
  skill_file="$skill_dir/SKILL.md"
  metadata_file="$skill_dir/agents/openai.yaml"
  folder_name="$(basename "$skill_dir")"

  test -f "$skill_file" || {
    fail "missing SKILL.md: $folder_name"
    continue
  }
  test -f "$metadata_file" || fail "missing agents/openai.yaml: $folder_name"

  skill_name="$(sed -n 's/^name: //p' "$skill_file" | head -n 1)"
  description="$(sed -n 's/^description: //p' "$skill_file" | head -n 1)"

  test "$skill_name" = "$folder_name" || fail "skill name does not match folder: $folder_name"
  test -n "$description" || fail "skill description is empty: $folder_name"
  rg -Fq "\$$folder_name" PROJECT_CONTEXT.md || fail "skill is not routed in PROJECT_CONTEXT.md: $folder_name"
  rg -Fq "\$$folder_name" "$metadata_file" || fail "default prompt does not name the skill: $folder_name"
done

test "$skill_count" -gt 0 || fail "no project skills found"

log_count="$(
  awk '
    /^## Update Log/ { in_log = 1; next }
    in_log && /^## / { in_log = 0 }
    in_log && /^- 20[0-9][0-9]-/ { count++ }
    END { print count + 0 }
  ' PROJECT_CONTEXT.md
)"
test "$log_count" -le 3 || fail "PROJECT_CONTEXT.md has more than three recent log entries"

rg -Fq '| `INTL` | Generic | Google Maps | USD |' TRAVEL_DATA_GUIDE.md \
  || fail "TRAVEL_DATA_GUIDE.md INTL currency is not USD"
rg -Fq "currency: 'USD'" scripts/config.js \
  || fail "scripts/config.js INTL currency mapping is not USD"

security_scan_paths=(
  "${agent_paths[@]}"
  .github
  scripts/validate-agent-docs.sh
)

if rg -q '(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|(AKIA|ASIA)[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|xox[baprs]-[0-9A-Za-z-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk[-_][A-Za-z0-9_-]{16,})' "${security_scan_paths[@]}"; then
  fail "possible secret found in governed files"
fi

if ! git diff --check || ! git diff --cached --check; then
  fail "git diff check failed"
fi

if test "$failures" -ne 0; then
  echo "Agent documentation validation failed with $failures issue(s)." >&2
  exit 1
fi

echo "Agent documentation validation passed: $skill_count skills, $log_count recent log entries."
