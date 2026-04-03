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

### 呼叫模板

```bash
export PATH="$HOME/.npm-global/bin:$PATH" && \
~/.npm-global/bin/gemini -p "{{任務描述}}" -m {{模型}}
```

---

### 角色分工（核心原則）

| 角色 | 職責 |
|------|------|
| **Claude** | 主判斷、讀專案規則、修改程式碼、commit/push、更新 PROJECT_CONTEXT.md |
| **Gemini Flash** | 快速查詢助手（查資料、查文件、查版本） |
| **Gemini Pro** | 分析顧問（複雜分析、第二意見、跨檔邏輯） |

Gemini 只提供資訊，最終決策與所有檔案修改一律由 Claude 執行。

---

### Claude 的判斷優先順序

呼叫 Gemini 之前，Claude 先自問：

1. **我已知答案嗎？** → 直接執行，不叫 Gemini
2. **這是本專案的程式邏輯問題？** → 讀程式碼自行判斷，不叫 Gemini
3. **這需要查外部資料（文件/版本/API）？** → 叫 Gemini Flash
4. **這需要複雜分析或第二意見？** → 叫 Gemini Pro

不確定要叫哪個：先問自己「這個任務是查資料還是深度分析？」
- 查資料 → Flash
- 深度分析 → Pro

---

### 使用 Gemini Flash 的明確條件

以下情況才呼叫 `gemini-2.5-flash`：

- 查套件 / 函式庫的 API 文件或參數說明
- 查最新版本號或相容性資訊
- 快速摘要一段官方文件
- 比對 1–2 個簡單選項的差異
- 確認某語法、某 CSS 屬性的瀏覽器支援度

**不符合以上條件時不使用 Flash。**

### 使用 Gemini Pro 的明確條件

以下情況才呼叫 `gemini-2.5-pro`：

- 分析複雜 bug 的可能根因（跨多個檔案）
- 對 Claude 自己的方案做第二意見審查
- 架構或方案比較（需要長鏈推理）
- Review Codex 或其他 AI 修改的程式碼是否有漏洞
- 跨檔案邏輯追蹤（如 storage → app.js → index.html 的資料流）

**Gemini Pro 的結果只作為參考，Claude 仍需獨立判斷後再決定是否採用。**

---

### 不使用 Gemini 的情況

- 本專案的程式邏輯判斷（直接讀 code）
- 修改任何專案檔案（只有 Claude 動手）
- commit / push 操作
- 更新 PROJECT_CONTEXT.md
- 使用者明確要求 Claude 自行完成的任務
- 任何 Claude 已有足夠資訊可以直接回答的問題

---

### Gemini 結果的處理原則

- Gemini 回傳的資訊 Claude 需自行驗證，不可盲目採用
- 若 Gemini 結果與專案現有架構或 PROJECT_CONTEXT.md 規則衝突，以專案規則為準
- 若 Gemini Pro 的分析與 Claude 判斷不同，Claude 應說明差異後由使用者決定

---

### 範例

**查 API（Flash）**
```bash
export PATH="$HOME/.npm-global/bin:$PATH" && \
~/.npm-global/bin/gemini -p "Leaflet.js flyTo() 的 duration 和 easeLinearity 參數說明與建議值" -m gemini-2.5-flash
```

**第二意見審查（Pro）**
```bash
export PATH="$HOME/.npm-global/bin:$PATH" && \
~/.npm-global/bin/gemini -p "以下是修改 Leaflet highlightEvent 的程式碼，請分析是否有邏輯錯誤或邊界案例遺漏：\n{{程式碼}}" -m gemini-2.5-pro
```
