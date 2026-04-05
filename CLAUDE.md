# Claude Code — Seoul Travel Guide

## Session Start（每 session 讀一次）
1. Read `PROJECT_CONTEXT.md`
2. UI/layout/modal 任務才讀 `SEOUL20266_UI_STYLE_GUIDE.md`

**Stack:** HTML + Vue 3 CDN + Tailwind + Leaflet + SW（no build step）

---

## 模型策略
`settings.json: { "model": "opusplan" }` — Plan 用 Opus，執行用 Sonnet

| 任務 | 做法 |
|------|------|
| 複雜 bug / 多檔修改 / 架構 | `opusplan` → 自動進 Plan Mode |
| 一行修正 / 版本 bump / typo | `--model haiku` 啟動 |

## Plan Mode
主動呼叫 `EnterPlanMode` 的時機：同時修改 2+ 檔案、功能重構、bug 根因不明、上次修法失敗。
計劃確認後呼叫 `ExitPlanMode`。一行修正直接執行，跳過 Plan Mode。

---

## Token 策略
- 大檔讀取：用 Grep 找行號後，僅讀 `offset+limit` 範圍
  - `index.html`（1506 行）、`services/map.js`（344 行）、`services/storage.js`（189 行）
- Key function 行號查 `PROJECT_CONTEXT.md` Code Navigation 表格（最高回報槓桿點）
- Context 使用率 ≥ 60% → `/compact`
- 不相關新任務 → `/clear` 開新 session

---

## 程式碼慣例
- Vue：Composition API（`setup()`）；Options API 不適用本專案
- Tailwind：utility-first；自訂 CSS 僅用於動畫、複雜漸層等 utility 無法表達的場合
- 命名：camelCase 變數與函式、PascalCase 元件檔名
- SW：每次 UI/邏輯有意義修改皆 bump `CACHE_NAME` 版本號
- Commit：`feat/fix/chore/ui:` 前綴格式

---

## After Changes
- commit 後執行 `bash scripts/update-log.sh`（Gemini Flash 自動寫 log）
- UI 規則改變才手動更新 `SEOUL20266_UI_STYLE_GUIDE.md`

---

## Gemini CLI
Binary 路徑：`~/.npm-global/bin`（Bash 不繼承 PATH，需指定全路徑）

| 模型 | 用途 |
|------|------|
| `gemini-2.5-flash` | 外部文件查詢 / 版本號確認 / 寫 Update Log |
| `gemini-2.5-pro` | 審查 Codex 寫的程式碼 / 獨立第二意見 |

Gemini 用途：外部查詢與程式碼審查。本專案邏輯、修改程式碼、commit/push 由 Claude 負責。
呼叫前說明原因，呼叫後說明結果與是否採用。

→ 詳細設定見 `GEMINI.md`
