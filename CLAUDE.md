# Claude Code Project Entry

Before any edit: read `PROJECT_CONTEXT.md`. Read `SEOUL20266_UI_STYLE_GUIDE.md` **only if task is UI/layout/modal/share-mode**.
After changes: update `PROJECT_CONTEXT.md`. Timestamp: `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'` — never guess.

## Token-Saving Workflow

**Reading code — never read whole files blindly:**
- Use `Grep` to find the function/section first → get line number → `Read` with `offset` + `limit`
- `app.js` and `index.html` are 1000+ lines — always use targeted reads
- Line numbers for key functions are in `PROJECT_CONTEXT.md` Code Navigation table

**Version bumps — use Grep not Read:**
```bash
grep -n "CACHE_NAME\|20260403" sw.js   # find exact line before editing
```

**During a session:**
- Use `/compact` when the conversation gets long (after 3+ back-and-forth exchanges with code)
- New unrelated task → new session (`/clear`) to avoid stale context

**Update log — keep it to 1 line per entry:**
`- YYYY-MM-DD | Editor | Type | One-sentence summary. Cache vX→vY; asset old→new. Files: list`

---

## Gemini CLI 協作

Binary: `~/.npm-global/bin/gemini` (full path — Claude Code Bash does not inherit PATH)

```bash
export PATH="$HOME/.npm-global/bin:$PATH" && ~/.npm-global/bin/gemini -p "{{任務}}" -m {{模型}}
```

**先問自己，再叫 Gemini：**
1. 我已知答案 / 是本專案邏輯 → 直接讀程式碼執行
2. 查外部文件/版本/API → `gemini-2.5-flash`
3. 複雜分析/第二意見/跨檔追蹤 → `gemini-2.5-pro`

| 模型 | 適用 |
|------|------|
| `gemini-2.5-flash` | API 文件、版本號、語法相容性、快速比較 |
| `gemini-2.5-pro` | 跨檔 bug 根因、架構比較、Code Review |

不用 Gemini：本專案邏輯、修改檔案、commit/push、更新 PROJECT_CONTEXT.md

**透明度：** 呼叫前說明「呼叫 Flash/Pro — 原因」；呼叫後說明結果與是否採用。
