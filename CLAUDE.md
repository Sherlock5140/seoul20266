# Claude Code Project Entry

Before any edit: read `AGENTS.md` → `PROJECT_CONTEXT.md` → if UI task, also `SEOUL20266_UI_STYLE_GUIDE.md`

Project: Static PWA (HTML + Vue 3 CDN + Tailwind + Leaflet + SW). No build step.

**After changes:** update `PROJECT_CONTEXT.md` (and `SEOUL20266_UI_STYLE_GUIDE.md` if UI changed).
**Before writing timestamp:** run `TZ='Asia/Taipei' date '+%Y-%m-%d %H:%M CST'` — never guess.
**One log entry per session/commit. List all changed files.**
**Token saving:** do not read `SEOUL20266_UI_STYLE_GUIDE.md` unless the task is UI-related, and do not auto-load any `*_REVIEW_BUNDLE.md` file unless a full bundled review is explicitly needed.

---

## Gemini CLI 協作

Binary: `~/.npm-global/bin/gemini` (use full path — Claude Code Bash does not inherit PATH)

```bash
export PATH="$HOME/.npm-global/bin:$PATH" && ~/.npm-global/bin/gemini -p "{{任務}}" -m {{模型}}
```

**先問自己，再叫 Gemini：**
1. 我已知答案 → 直接執行
2. 是本專案程式邏輯 → 讀程式碼自行判斷
3. 查外部文件/版本/API → Gemini Flash
4. 複雜分析/第二意見/跨檔追蹤 → Gemini Pro

| 模型 | 適用情境 |
|------|---------|
| `gemini-2.5-flash` | API 文件、版本號、語法/瀏覽器相容性、快速選項比較 |
| `gemini-2.5-pro` | 跨檔 bug 根因、架構比較、Code Review、第二意見 |

**不用 Gemini：** 本專案邏輯判斷、修改檔案、commit/push、更新 PROJECT_CONTEXT.md

**透明度（必須遵守）：**
- 呼叫前：說明「呼叫 Flash/Pro — 原因」
- 呼叫後：說明結果與是否採用
- 結果與專案規則衝突 → 以專案規則為準，告知使用者差異
