# AI Start Here

This repository is primarily maintained with:
- Claude Code
- Codex

If you are Claude Code or Codex, read `PROJECT_CONTEXT.md` before doing anything else.

Priority order:
- `PROJECT_CONTEXT.md` for current rules, recent changes, and update log requirements
- `SEOUL20266_UI_STYLE_GUIDE.md` for UI behavior, layout rules, responsive logic, and bug-fix expectations
- `scripts/config.js` for country and map behavior
- `scripts/app.js` for app flow
- `services/map.js` for marker and map behavior
- `services/rates.js` for currency logic
- `sw.js` for cache and version behavior

Working rules:
- Do not start editing until you have read `PROJECT_CONTEXT.md`.
- If the task involves layout, modal behavior, header controls, share mode, or visual bug fixes, also read `SEOUL20266_UI_STYLE_GUIDE.md`.
- After any meaningful UI, logic, trip-data, cache, map, or sharing change, update `PROJECT_CONTEXT.md`.
- If the UI rules or interaction expectations changed, also update `SEOUL20266_UI_STYLE_GUIDE.md`.
- Keep `PROJECT_CONTEXT.md` concise but current. It is the shared handoff file for future Claude Code and Codex sessions.
- Every new `PROJECT_CONTEXT.md` update-log entry must include:
  - `Updated at:` in `YYYY-MM-DD HH:MM TZ` format
  - `Updated by:` `Claude Code`, `Codex`, or `User`
  - `Type:` `Bug Fix`, `Optimization`, `UI`, `Data`, `Docs`, or `Infra`
  - a short summary of what changed
  - key files touched when relevant
- Do not overwrite, rewrite, or relabel another editor's existing update-log entry.
- If you find a problem in a previous change, add a new follow-up entry that references it instead of replacing the old entry.

## Claude Code / Codex Review Prompt

Use this prompt when asking Claude Code or Codex to audit or repair the app:

```text
這是一套旅遊 APP 使用程式，裡面可以切換不同旅遊地點使用。

先讀專案根目錄這 3 份檔案，再開始任何分析或修改：
1. AGENTS.md
2. PROJECT_CONTEXT.md
3. SEOUL20266_UI_STYLE_GUIDE.md

這是 Travel Guide 靜態 PWA 專案，不要假設有 React、Next.js、TypeScript 或 build step。
如果任務涉及 UI、比例、modal、header、share mode、trip 切換、地圖呈現或畫面 bug，請以 SEOUL20266_UI_STYLE_GUIDE.md 為主。

幫我完整檢查主程式邏輯及問題，並進行優化修正。
你是資深前端工程師，請用延伸思考模式，仔細審查這份旅遊 App 代碼。

【必查項目】
□ JavaScript 邏輯錯誤（列出行號）
□ XSS / 輸入注入風險
□ 搜尋空結果 / 網路失敗的邊緣案例
□ RWD 斷點是否完整（375px / 768px / 1280px）
□ 費用數字計算精度（浮點數問題）
□ TypeScript / JS 型別一致性
□ 未處理的 Promise reject

【輸出格式】
1. 🔴 嚴重問題（必修，含行號）
2. 🟡 中等問題（建議修）
3. 🟢 代碼品質評分 /10
4. ⚡ 最優先修正的 3 個改善點

如果有修改功能、邏輯、trip data、map、cache、share 或 UI，完成後請同步更新 PROJECT_CONTEXT.md。
如果 UI 規則或互動邏輯有變，也請同步更新 SEOUL20266_UI_STYLE_GUIDE.md。
```
