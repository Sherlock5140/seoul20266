# Claude Code — Seoul Travel Guide

## Session Start（每 session 讀一次，不重複）
1. Read `PROJECT_CONTEXT.md`
2. UI/layout/modal 任務才讀 `SEOUL20266_UI_STYLE_GUIDE.md`

Stack: HTML + Vue 3 CDN + Tailwind + Leaflet + SW. No build step.

## 模型選擇（省 token 關鍵）

**settings.json：** `{ "model": "opusplan" }` — Plan Mode 用 Opus，執行用 Sonnet

| 任務類型 | 用法 |
|---------|------|
| 複雜 bug / 多檔修改 / 架構 | `opusplan`（自動）|
| 簡單修正 / 版本 bump / typo | 啟動時加 `--model haiku` |

## 自動 Plan Mode
Claude 遇到以下情況**主動呼叫 EnterPlanMode**（不等使用者觸發）：
- 同時修改 2+ 檔案、功能重構、bug 根因不明、上次修法失敗
- 計劃確認後呼叫 ExitPlanMode 再執行

一行修正 / 版本 bump / log 更新 → 不進 Plan Mode，直接執行。

## Token 節省規則
- `app.js`（1056行）`index.html`（1262行）**禁止全讀** → 用 Grep 找行號再 `Read offset+limit`
- Key function 行號在 `PROJECT_CONTEXT.md` Code Navigation 表格
- 3+ 來回涉及大量程式碼 → `/compact`
- 不相關的新任務 → 新 session（`/clear`）

## After Changes
- commit 後執行 `bash scripts/update-log.sh`（Gemini Flash 自動寫 log）
- UI 規則改變才手動更新 `SEOUL20266_UI_STYLE_GUIDE.md`

## Gemini CLI
Binary: `~/.npm-global/bin:$PATH`（全路徑，Claude Code Bash 不繼承 PATH）

| 模型 | 用途 |
|------|------|
| `gemini-2.5-flash` | 外部文件 / 版本號 / 寫 log（scripts/update-log.sh）|
| `gemini-2.5-pro` | 審查 Codex 寫的程式碼 / 獨立第二意見 |

**不用 Gemini：** 本專案邏輯、修改程式碼、commit/push、更新 UI Guide
**透明度：** 呼叫前說原因，呼叫後說結果與是否採用。
