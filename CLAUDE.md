# Claude Code Project Entry

This file is the Claude Code-specific entry point for this repository.

Before making any analysis or edits:
1. Read `AGENTS.md`
2. Read `PROJECT_CONTEXT.md`
3. If the task touches UI, layout, modal behavior, responsive logic, header controls, share mode, or visual bug fixes, also read `SEOUL20266_UI_STYLE_GUIDE.md`

Project facts:
- This is a static PWA travel itinerary app.
- Do not assume React, Next.js, TypeScript, or a build step.
- Use `PROJECT_CONTEXT.md` as the shared source of truth for architecture, recent changes, and update-log rules.

Collaboration rules:
- Claude Code, Codex, and Gemini must all use the same shared rules in `PROJECT_CONTEXT.md`.
- Do not overwrite another editor's update-log entry.
- If you discover a problem in an older change, add a new follow-up entry instead of rewriting history.
- After any meaningful code, UI, trip-data, map, cache, share, or docs change, update `PROJECT_CONTEXT.md`.
- If UI rules changed, also update `SEOUL20266_UI_STYLE_GUIDE.md`.

Update-log rules:
- Before writing `Updated at`, run `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'`.
- Never guess the time.
- Write one update-log entry per work session or commit.
- List the files that actually changed.

Suggested task order:
1. Read entry docs
2. Inspect the relevant code
3. Make changes
4. Update `PROJECT_CONTEXT.md`
5. Update `SEOUL20266_UI_STYLE_GUIDE.md` if needed

---

## Gemini CLI 協作規則

Gemini CLI 已安裝於 `~/.npm-global/bin/gemini`（v0.36.0）。
呼叫時永遠使用完整路徑，因為 Claude Code 的 Bash 不繼承系統 PATH。

### 呼叫方式

```bash
export PATH="$HOME/.npm-global/bin:$PATH" && \
~/.npm-global/bin/gemini -p "{{任務描述}}" -m gemini-2.5-flash
```

### 何時使用 Gemini

| 任務 | 模型 |
|------|------|
| 上網查資料、查 API 文件、查套件版本 | `gemini-2.5-flash` |
| 初步整理、快速摘要、比對多份文件 | `gemini-2.5-flash` |
| 需要較強推理的輔助分析（非主要決策） | `gemini-2.5-pro` |

### 不使用 Gemini 的情況

- 主要程式邏輯判斷、架構決策 → 由 Claude 自行處理
- 直接修改本專案程式碼 → 由 Claude 執行，Gemini 不直接寫入
- 使用者明確要求 Claude 自己完成的任務

### 範例：查資料再由 Claude 決策

```bash
export PATH="$HOME/.npm-global/bin:$PATH" && \
~/.npm-global/bin/gemini -p "查詢 Leaflet.js flyTo 的 duration 參數範圍與建議值" -m gemini-2.5-flash
```
Gemini 回傳結果後，由 Claude 判斷如何應用到程式碼。
