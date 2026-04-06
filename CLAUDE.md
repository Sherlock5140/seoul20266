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
| 版本 bump / typo / 文案改字 / log 更新 | `--model haiku` 啟動 |

## Plan Mode
主動呼叫 `EnterPlanMode` 的時機：同時修改 2+ 檔案、功能重構、bug 根因不明、上次修法失敗。
計劃確認後呼叫 `ExitPlanMode`。一行修正直接執行，跳過 Plan Mode。

---

## Token 策略
- 大檔讀取：用 Grep 找行號後，僅讀 `offset+limit` 範圍
  - `index.html`（1506 行）、`services/map.js`（344 行）、`services/storage.js`（189 行）
- Key function 行號查 `PROJECT_CONTEXT.md` Code Navigation 表格（最高回報槓桿點）
- 跨檔呼叫時追蹤完整呼叫鏈，不限於初始 Grep 行號範圍
- Context ≥ 60% → `/compact`
- Context ≥ 85% → `/clear`，移交摘要需包含：
  - 本輪改了哪些檔案（路徑 + 行號）
  - 未完成任務
  - 當前 SW 版本號
- 不相關新任務 → `/clear` 開新 session

---

## 程式碼慣例
- Vue：Composition API（`setup()`）；Options API 不適用本專案
- Tailwind：utility-first；自訂 CSS 僅用於動畫、複雜漸層等 utility 無法表達的場合
- 命名：camelCase 變數與函式、PascalCase 元件檔名
- SW：UI/邏輯修改皆 bump `CACHE_NAME`，格式 `travel-guide-vN-YYYYMMDD-HHMM`
  - Patch（`v40→v41`）：UI 微調、typo、文案
  - Minor（`v40→v50`）：功能增減、bugfix
  - Major（`v40→v100`）：架構變更、資料格式異動
- Commit：`feat/fix/chore/ui:` 前綴格式

---

## 高風險區域（修改前需使用者確認）
- `services/storage.js:135` `saveTripState()` — 寫入 localStorage，格式錯誤會清除行程
- `services/storage.js:61` `loadTripState()` — 讀取邏輯，改錯會讓行程消失
- SW cache 清除策略 — 影響所有使用者快取

## 改後驗證清單
- [ ] 確認地圖 marker 正常顯示
- [ ] 切換行程確認資料正確
- [ ] SW `CACHE_NAME` 已 bump
- [ ] 離線模式可正常載入

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

## 回答原則
分析類問題：結論 + 排序，不展開說明除非被要求。
例外：bug 根因分析 / 架構決策 → 主動展開推理鏈。
