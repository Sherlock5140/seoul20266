# Claude Code Project Entry

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

**先問自己，再叫 Gemini：**
1. 已知答案 / 本專案邏輯 → 直接讀程式碼執行
2. 查外部文件/版本/API → `gemini-2.5-flash`
3. 複雜分析/第二意見/跨檔追蹤 → `gemini-2.5-pro`

| 模型 | 適用 |
|------|------|
| `gemini-2.5-flash` | API 文件、版本號、語法相容性、快速比較、寫 log |
| `gemini-2.5-pro` | 跨檔 bug 根因、架構比較、Code Review |

**不用 Gemini：** 本專案邏輯判斷、修改功能程式碼、commit/push、更新 `SEOUL20266_UI_STYLE_GUIDE.md`

**透明度：** 呼叫前說明「呼叫 Flash/Pro — 原因」；呼叫後說明結果與是否採用。
