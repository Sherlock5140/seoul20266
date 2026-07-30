#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
cd "$repo_root"

fixture="tests/agent-routing-cases.tsv"
test -f "$fixture" || {
  echo "FAIL: missing routing fixture: $fixture" >&2
  exit 1
}

failures=0
case_count=0
seen_ids=" "
seen_categories=" "
seen_scopes=" "
seen_modes=" "
seen_project_skills=" "

fail() {
  echo "FAIL: $1" >&2
  failures=$((failures + 1))
}

append_seen() {
  local variable_name="$1"
  local value="$2"
  local current="${!variable_name}"

  if [[ "$current" != *" $value "* ]]; then
    printf -v "$variable_name" '%s%s ' "$current" "$value"
  fi
}

line_number=0
while IFS='|' read -r id category scopes mode skills context external clarify prompt extra; do
  line_number=$((line_number + 1))

  if test "$line_number" -eq 1; then
    test "$id|$category|$scopes|$mode|$skills|$context|$external|$clarify|$prompt" = \
      "id|category|scope|mode|skills|context|external|clarify|prompt" \
      || fail "routing fixture header drift"
    continue
  fi

  test -n "$id$category$scopes$mode$skills$context$external$clarify$prompt$extra" || continue
  [[ "$id" == \#* ]] && continue
  case_count=$((case_count + 1))

  test -z "$extra" || fail "line $line_number contains an extra field"
  test -n "$prompt" || fail "line $line_number has an empty prompt"

  if [[ "$seen_ids" == *" $id "* ]]; then
    fail "duplicate routing case id: $id"
  fi
  append_seen seen_ids "$id"

  case "$category" in
    direct|indirect|incomplete|negative|cross-scope|boundary) ;;
    *) fail "line $line_number has unknown category: $category" ;;
  esac
  append_seen seen_categories "$category"

  IFS='+' read -r -a selected_scopes <<< "$scopes"
  for scope in "${selected_scopes[@]}"; do
    case "$scope" in
      travel-app|travel-artifact|general-artifact|external|governance|general)
        append_seen seen_scopes "$scope"
        ;;
      *)
        fail "line $line_number has unknown scope: $scope"
        ;;
    esac
  done

  case "$mode" in
    review|diagnose|change|release) ;;
    *) fail "line $line_number has unknown mode: $mode" ;;
  esac
  append_seen seen_modes "$mode"

  case "$external" in
    yes|no) ;;
    *) fail "line $line_number has invalid external-state flag: $external" ;;
  esac
  case "$clarify" in
    yes|no) ;;
    *) fail "line $line_number has invalid clarification flag: $clarify" ;;
  esac
  if test "$mode" = "release" && test "$external" != "yes"; then
    fail "line $line_number marks a release without external state"
  fi
  if test "$external" = "yes" && test "$mode" != "release"; then
    fail "line $line_number authorizes external state outside Release / sync mode"
  fi
  if test "$category" = "incomplete" && test "$clarify" != "yes"; then
    fail "line $line_number has incomplete input without a clarification gate"
  fi

  IFS='+' read -r -a selected_skills <<< "$skills"
  for skill in "${selected_skills[@]}"; do
    case "$skill" in
      audit-travel-app|change-travel-app|edit-itinerary-data|maintain-agent-docs)
        test -f ".agents/skills/$skill/SKILL.md" \
          || fail "line $line_number references missing project Skill: $skill"
        append_seen seen_project_skills "$skill"
        ;;
      artifact|connector|git-release|github-release|none)
        ;;
      *)
        fail "line $line_number has unknown Skill/capability class: $skill"
        ;;
    esac
  done
done < "$fixture"

test "$case_count" -ge 24 || fail "routing fixture needs at least 24 cases"

for category in direct indirect incomplete negative cross-scope boundary; do
  [[ "$seen_categories" == *" $category "* ]] || fail "missing routing category: $category"
done

for scope in travel-app travel-artifact general-artifact external governance general; do
  [[ "$seen_scopes" == *" $scope "* ]] || fail "missing routing scope: $scope"
done

for mode in review diagnose change release; do
  [[ "$seen_modes" == *" $mode "* ]] || fail "missing task mode: $mode"
done

for skill in audit-travel-app change-travel-app edit-itinerary-data maintain-agent-docs; do
  [[ "$seen_project_skills" == *" $skill "* ]] || fail "project Skill has no routing case: $skill"
done

if test "$failures" -ne 0; then
  echo "Agent routing fixture validation failed with $failures issue(s)." >&2
  exit 1
fi

echo "Agent routing fixture validation passed: $case_count contract cases."
