#!/bin/bash
# 執行方式：bash scripts/update-log.sh
# commit 後執行，讓 Gemini Flash 自動更新 PROJECT_CONTEXT.md 的 Update Log

export PATH="$HOME/.npm-global/bin:$PATH"

git diff HEAD --stat | \
~/.npm-global/bin/gemini --approval-mode=auto_edit \
  -p "在 PROJECT_CONTEXT.md 的 Update Log 最上方（## Update Log 下第一條）插入一筆新記錄。
格式完全照現有格式：
- YYYY-MM-DD | Editor | Type | 摘要。Cache vX→vY; asset old→new. Files: list
日期：執行 TZ='Asia/Taipei' date '+%Y-%m-%d' 取得。
Editor = Claude Code。超過 3 筆時刪最舊一筆。只改 PROJECT_CONTEXT.md，不改其他檔案。" \
  -m gemini-2.5-flash
