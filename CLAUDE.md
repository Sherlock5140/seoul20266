# Claude Code Project Entry

## 推薦模型設定

在 Claude Code `settings.json` 加入：
```json
{ "model": "opusplan" }
```
- Plan Mode → 自動使用 Opus 4.6（架構推理）
- 執行模式 → 自動切換 Sonnet 4.6（寫程式碼）

## 自動 Plan Mode（全自動，不需手動 Shift+Tab）

以下情況 Claude 必須主動呼叫 `EnterPlanMode` 工具，不等使用者觸發：
- 任務涉及 **2 個以上檔案**同時修改
- 任務描述含「重構」、「架構」、「全面」、「優化」、「新增功能」
- bug 根因不明，需要跨檔追蹤
- 上一個修法失敗，需要重新設計方案

Plan Mode 內：列出計劃步驟、確認影響範圍、再呼叫 `ExitPlanMode` 開始執行。
單純的一行修正、版本 bump、log 更新 → 不進 Plan Mode，直接執行。

## Session Start (讀一次，同 session 內不重複讀)

1. Read `PROJECT_CONTEXT.md`
2. If UI/layout/modal/share-mode task → also read `SEOUL20266_UI_STYLE_GUIDE.md`
3. Do NOT auto-load `*_REVIEW_BUNDLE.md` unless explicitly requested

Project: Static PWA (HTML + Vue 3 CDN + Tailwind + Leaflet + SW). No build step.

## After Changes

**SEOUL20266_UI_STYLE_GUIDE.md** — update manually if UI rules changed (requires judgment).

**PROJECT_CONTEXT.md log** — delegate to Gemini Flash:
```bash
export PATH="$HOME/.npm-global/bin:$PATH" && \
git diff HEAD --stat | \
~/.npm-global/bin/gemini --approval-mode=auto_edit \
  -p "在 PROJECT_CONTEXT.md 的 Update Log 最上方（## Update Log 下第一條）插入一筆新記錄，格式完全照現有格式：
- YYYY-MM-DD | Editor | Type | 摘要。Cache vX→vY; asset old→new. Files: list
日期時間執行：TZ='Asia/Taipei' date '+%Y-%m-%d'
Editor = Claude Code。超過 3 筆時刪最舊一筆。只改 PROJECT_CONTEXT.md，不改其他檔案。" \
  -m gemini-2.5-flash
```

## Token-Saving Workflow

**讀程式碼 — 用行號，不讀整個檔案：**
- 先用 `Grep` 找函式 → 取得行號 → `Read` with `offset` + `limit`
- `app.js`（1056行）和 `index.html`（1262行）禁止全讀
- 常用行號在 `PROJECT_CONTEXT.md` Code Navigation 表格

**版本 bump：**
```bash
grep -n "CACHE_NAME\|v=20260" sw.js   # 找確切行再 Edit
```

**對話管理：**
- 3+ 來回且涉及大量程式碼 → `/compact`
- 新的不相關任務 → 新 session (`/clear`)

**Update log 格式（1行）：**
`- YYYY-MM-DD | Editor | Type | 摘要。Cache vX→vY; asset old→new. Files: list`

---

## Gemini CLI 協作

Binary: `~/.npm-global/bin/gemini` (full path — Claude Code Bash 不繼承 PATH)

```bash
export PATH="$HOME/.npm-global/bin:$PATH" && ~/.npm-global/bin/gemini -p "{{任務}}" -m {{模型}}
```

**加入 opusplan 後的新分工：**

| 誰 | 職責 |
|----|------|
| Opus 4.6（Plan Mode） | 複雜推理、跨檔架構、bug 根因分析 |
| Sonnet 4.6（執行） | 寫程式碼、修改檔案 |
| Gemini Flash | 查外部文件/版本/API、自動寫 log |
| Gemini Pro | 審查**其他 AI（Codex）寫的程式碼**、需要完全獨立第二意見時 |

**呼叫判斷：**
1. 本專案邏輯 / 複雜分析 → Opus Plan Mode（不叫 Gemini）
2. 查外部資料 → Gemini Flash
3. 審查 Codex 修改 / 真正獨立視角 → Gemini Pro

**Gemini Flash — 固定觸發（commit 後自動執行）：**
```bash
export PATH="$HOME/.npm-global/bin:$PATH" && \
git diff HEAD --stat | \
~/.npm-global/bin/gemini --approval-mode=auto_edit \
  -p "在 PROJECT_CONTEXT.md 的 Update Log 最上方插入一筆，格式：
- YYYY-MM-DD | Editor | Type | 摘要。Cache vX→vY; asset old→new. Files: list
執行 TZ='Asia/Taipei' date '+%Y-%m-%d' 取得日期。Editor=Claude Code。超過 3 筆刪最舊。只改 PROJECT_CONTEXT.md。" \
  -m gemini-2.5-flash
```

**不用 Gemini：** 本專案邏輯、修改程式碼、commit/push、更新 `SEOUL20266_UI_STYLE_GUIDE.md`

**透明度：** 呼叫前說明「呼叫 Flash/Pro — 原因」；呼叫後說明結果與是否採用。
