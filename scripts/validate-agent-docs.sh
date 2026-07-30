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

required_project_skills=(
  audit-travel-app
  change-travel-app
  edit-itinerary-data
  maintain-agent-docs
)

for file in "${required_files[@]}"; do
  test -f "$file" || fail "missing required document: $file"
done

for required_skill in "${required_project_skills[@]}"; do
  test -d ".agents/skills/$required_skill" || fail "missing required project skill: $required_skill"
done

agent_paths=(
  "${required_files[@]}"
  .agents/skills
  .claude/skills
)

if rg -q '(/Users/[^/]+/|/home/[^/]+/|[A-Z]:\\Users\\)' "${agent_paths[@]}"; then
  fail "private absolute path found in agent documentation"
fi

if rg -q '#L[0-9]+' "${agent_paths[@]}"; then
  fail "fixed line-number link found in active guidance"
fi

if rg -q '\[TODO|TODO:' .agents/skills; then
  fail "unfinished skill template content found"
fi

for bundle in FULL_APP_REVIEW_BUNDLE.md COMPLETE_APP_REVIEW_BUNDLE.md MULTI_TRIP_REVIEW_BUNDLE.md; do
  test ! -e "$bundle" || fail "generated review bundle must not live in the repository root: $bundle"
done

skill_is_actively_routed() {
  local skill_name="$1"

  if rg -Fq "\$$skill_name" AGENTS.md; then
    return 0
  fi

  awk '/^## Update Log/ { exit } { print }' PROJECT_CONTEXT.md | rg -Fq "\$$skill_name"
}

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

  test "$(sed -n '1p' "$skill_file")" = '---' || fail "invalid Skill frontmatter start: $folder_name"
  test "$(sed -n '2p' "$skill_file")" = "name: $skill_name" || fail "invalid Skill name field: $folder_name"
  test "$(sed -n '3p' "$skill_file")" = "description: $description" || fail "invalid Skill description field: $folder_name"
  test "$(sed -n '4p' "$skill_file")" = '---' || fail "Skill frontmatter must contain only name and description: $folder_name"
  test "$skill_name" = "$folder_name" || fail "skill name does not match folder: $folder_name"
  test -n "$description" || fail "skill description is empty: $folder_name"
  if ! [[ "$skill_name" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]] || test "${#skill_name}" -gt 64; then
    fail "skill name is not valid hyphen-case or exceeds 64 characters: $folder_name"
  fi
  if test "${#description}" -gt 1024 || [[ "$description" == *'<'* || "$description" == *'>'* ]]; then
    fail "skill description exceeds 1024 characters or contains angle brackets: $folder_name"
  fi
  if ! skill_is_actively_routed "$folder_name"; then
    fail "skill is not routed in AGENTS.md or active PROJECT_CONTEXT.md: $folder_name"
  fi
  rg -Fq "\$$folder_name" "$metadata_file" || fail "default prompt does not name the skill: $folder_name"

  shim_file=".claude/skills/$folder_name/SKILL.md"
  test -f "$shim_file" || {
    fail "missing Claude Skill shim: $folder_name"
    continue
  }
  shim_name="$(sed -n 's/^name: //p' "$shim_file" | head -n 1)"
  shim_description="$(sed -n 's/^description: //p' "$shim_file" | head -n 1)"
  test "$shim_name" = "$skill_name" || fail "Claude shim name drift: $folder_name"
  test "$shim_description" = "$description" || fail "Claude shim description drift: $folder_name"
  test "$(wc -l < "$shim_file" | tr -d ' ')" -eq 8 \
    || fail "Claude shim must remain an eight-line discovery adapter: $folder_name"
  test "$(sed -n '1p' "$shim_file")" = '---' \
    || fail "Claude shim frontmatter start drift: $folder_name"
  test "$(sed -n '2p' "$shim_file")" = "name: $skill_name" \
    || fail "Claude shim name field drift: $folder_name"
  test "$(sed -n '3p' "$shim_file")" = "description: $description" \
    || fail "Claude shim description field drift: $folder_name"
  test "$(sed -n '4p' "$shim_file")" = '---' \
    || fail "Claude shim must not add frontmatter fields: $folder_name"
  test -z "$(sed -n '5p' "$shim_file")" \
    || fail "Claude shim layout drift: $folder_name"
  test "$(sed -n '6p' "$shim_file")" = '# Claude Code Skill Bridge' \
    || fail "Claude shim heading drift: $folder_name"
  test -z "$(sed -n '7p' "$shim_file")" \
    || fail "Claude shim layout drift: $folder_name"
  test "$(sed -n '8p' "$shim_file")" = "This is a discovery adapter only. Before acting, read and follow \`../../../.agents/skills/$folder_name/SKILL.md\` completely. Resolve any resources relative to that canonical Skill directory. The canonical file governs, and this shim grants no authority." \
    || fail "Claude shim body or target drift: $folder_name"
  if git check-ignore -q "$shim_file"; then
    fail "Claude Skill shim is still ignored: $folder_name"
  fi
done

test "$skill_count" -gt 0 || fail "no canonical project skills found"

shim_count="$(find .claude/skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')"
test "$shim_count" -eq "$skill_count" || fail "Claude shim set does not match canonical skills"

for private_path in .claude/settings.json .claude/settings.local.json .claude/launch.json .claude/worktrees; do
  git check-ignore -q "$private_path" || fail "Claude local path is not ignored: $private_path"
done

test "$(sed -n '1p' CLAUDE.md)" = '@AGENTS.md' || fail "CLAUDE.md must import AGENTS.md first"
test "$(sed -n '1p' GEMINI.md)" = '@AGENTS.md' || fail "GEMINI.md must import AGENTS.md first"

rg -Fq '## Scope Router' AGENTS.md || fail "AGENTS.md is missing the workspace Scope Router"
for route_term in 'Travel Guide app' 'Travel-derived artifact' 'General artifact' 'External data or action' 'Agent governance' 'General or unknown'; do
  rg -Fq "| $route_term |" AGENTS.md || fail "Scope Router table is missing: $route_term"
done
rg -Fq 'Read each routed guide or reference at most once' AGENTS.md \
  || fail "AGENTS.md is missing the single-pass guide-loading rule"
rg -Fq 'let that selected Skill load each guide once' PROJECT_CONTEXT.md \
  || fail "PROJECT_CONTEXT.md does not delegate guide loading to the selected Skill"

rg -Fq 'Do not read this file during normal task startup.' CODEX.md \
  || fail "CODEX.md is not marked as an optional compatibility note"
rg -Fq '## Compact Instructions' CLAUDE.md \
  || fail "CLAUDE.md is missing official compaction guidance"
rg -Fq 'When `AGENTS.md` requires a plan, use Claude Plan Mode.' CLAUDE.md \
  || fail "CLAUDE.md does not map the shared plan rule to Claude Plan Mode"
rg -Fq 'reread its canonical `.agents/skills` workflow after compaction' CLAUDE.md \
  || fail "CLAUDE.md does not preserve active canonical Skills across compaction"
rg -Fq '/memory reload' GEMINI.md || fail "GEMINI.md is missing /memory reload"
rg -Fq '/skills reload' GEMINI.md || fail "GEMINI.md is missing /skills reload"
if rg -Fq '/memory refresh' GEMINI.md; then
  fail "GEMINI.md still uses the stale /memory refresh command"
fi
if rg -Fq 'Use the Scope Router before reading `PROJECT_CONTEXT.md`.' CLAUDE.md GEMINI.md; then
  fail "model adapter duplicates the imported workspace Scope Router"
fi

if rg -n 'PROJECT_CONTEXT\.md' \
  .agents/skills/audit-travel-app/SKILL.md \
  .agents/skills/change-travel-app/SKILL.md \
  .agents/skills/edit-itinerary-data/SKILL.md; then
  fail "Travel task Skill duplicates the workspace context-loading rule"
fi
if rg -n '\.claude/skills' .agents/skills/*/SKILL.md; then
  fail "canonical Skill must not depend on a Claude discovery shim"
fi

if rg -Fq 'allow_implicit_invocation: false' .agents/skills/maintain-agent-docs/agents/openai.yaml; then
  fail "maintain-agent-docs must remain available for implicit routing"
fi

rg -Fq 'slide decks, documents, or other artifacts' .agents/skills/change-travel-app/SKILL.md \
  || fail "change-travel-app is missing its artifact negative trigger"

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

cache_version="$(sed -n 's/^- SW cache: `\([^`]*\)`/\1/p' PROJECT_CONTEXT.md)"
core_query="$(sed -n 's/^- Core app\/config\/service\/catalog query: `\([^`]*\)`/\1/p' PROJECT_CONTEXT.md)"
seoul_query="$(sed -n 's/^- Seoul trip data query: `\([^`]*\)`/\1/p' PROJECT_CONTEXT.md)"
hongkong_query="$(sed -n 's/^- Hong Kong trip data query: `\([^`]*\)`/\1/p' PROJECT_CONTEXT.md)"

test -n "$cache_version" || fail "PROJECT_CONTEXT.md SW cache is empty"
test -n "$core_query" || fail "PROJECT_CONTEXT.md core query is empty"
test -n "$seoul_query" || fail "PROJECT_CONTEXT.md Seoul query is empty"
test -n "$hongkong_query" || fail "PROJECT_CONTEXT.md Hong Kong query is empty"

rg -Fq "const CACHE_NAME = '$cache_version';" sw.js \
  || fail "PROJECT_CONTEXT.md SW cache does not match sw.js"
for runtime_file in sw.js index.html; do
  rg -Fq "scripts/app.js?v=$core_query" "$runtime_file" \
    || fail "PROJECT_CONTEXT.md core query does not match $runtime_file"
  rg -Fq "data/seoul-2026.js?v=$seoul_query" "$runtime_file" \
    || fail "PROJECT_CONTEXT.md Seoul query does not match $runtime_file"
  rg -Fq "data/hongkong-2026.js?v=$hongkong_query" "$runtime_file" \
    || fail "PROJECT_CONTEXT.md Hong Kong query does not match $runtime_file"
done

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
