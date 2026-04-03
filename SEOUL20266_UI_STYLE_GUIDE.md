# Seoul20266 UI Style Guide

這份文件不是單純的視覺備忘錄。

它是給 Claude Code 與 Codex 使用的 UI / interaction / bug-fix 說明書，用來回答三件事：

1. 這個 app 的畫面應該長什麼樣
2. 這個 app 的 UI 應該怎麼運作
3. 當 UI 跑掉、比例怪、功能錯位時，應該先檢查哪裡

如果另一個 AI 要修這個專案的 UI、互動、版面比例、modal、header、map 面板、trip 切換、share mode，它不能只看畫面，必須同時讀這份文件與 `PROJECT_CONTEXT.md`。

## 1. 文件定位

這份檔案負責：

- UI 視覺語言
- 元件比例
- 響應式規則
- 互動邏輯預期
- 常見 UI bug 的排查方向
- 哪些檔案才是 UI 真正來源

這份檔案不負責：

- trip data 詳細內容本身
- 匯率 API 細節
- localStorage schema 全文說明
- service worker 技術細節

那些內容請回頭看 `PROJECT_CONTEXT.md`。

## 2. AI 使用規則

如果你是 Claude Code 或 Codex，遇到以下任務時要先讀這份檔案：

- UI 跑版
- 桌機 / 手機比例不對
- header 太小或太大
- 設定視窗、分享視窗、notes modal 排版異常
- trip 切換後畫面狀態不一致
- map 與 itinerary panel 的比例怪異
- 想做視覺優化，但不能破壞現有產品語言

如果任務涉及 UI 改動，完成後要同步更新：

- `PROJECT_CONTEXT.md`
- 本檔案中對應的「Recent UI Logic Changes」或「Update Notes」

## 3. Source Of Truth

UI 真正來源檔案如下：

- `index.html`
  單頁 UI、CSS、template 幾乎都在這裡
- `scripts/app.js`
  Vue app 狀態、modal 開關、trip 切換、share mode、notes、rates
- `services/map.js`
  Leaflet marker、focus、fitBounds、外部地圖打開方式
- `scripts/config.js`
  不同國家對應的地圖供應商、幣別、中心點

如果畫面看起來有 bug，不要只改 CSS class 名稱，要先確認：

1. 是純視覺比例問題
2. 是 template 結構問題
3. 是 state / computed / data flow 導致顯示錯誤
4. 是不同模式共用同一組樣式而互相污染

## 4. 產品 UI 核心

`seoul20266` 的風格不是高對比科技感，也不是花俏旅遊廣告感，而是：

- 柔和中性色底
- 半透明霧面卡片
- 大圓角與膠囊按鈕
- 輕陰影、低壓迫感
- 清楚層級，但避免刺眼色塊
- 行動裝置優先，桌面版再展開

一句話定義：

`iOS sheet + travel notebook + calm editorial dashboard`

如果之後另一個 AI 做出：

- 太像 SaaS 後台
- 太像暗色科技產品
- 太像旅遊廣告 landing page
- 太多高彩功能色塊

那就是偏離原始方向。

## 5. 色彩系統

來源大致在 [`index.html`](/Users/peter/Documents/New%20project/index.html#L46) 到 [`index.html`](/Users/peter/Documents/New%20project/index.html#L56)。

### 基礎色

- 背景 `m-bg`: `#ECEDEA`
- 卡片 `m-card`: `#F4F5F2`
- 主文字 `typo-title`: `#2E2E2E`
- 內文 `m-text`: `#484846`
- 次文字 `m-sub`: `#757573`
- 標籤淡字 `typo-label`: `#B6B8B3`
- 邊框 `m-border`: `rgba(200,204,199,0.3)`

### 功能色

- 柔粉重點 `typo-accent`: `#C9A6A1`
- 活動 / pin `s-pin`: `#C8A7A1`
- 警示 `s-alert`: `#B0726B`
- 暖黃 `s-warn`: `#C9B56A`
- 綠灰 `s-green`: `#8FA39D`
- 藍灰 `s-blue`: `#8E9AAF`
- 沙色 `s-sand`: `#D6C0B3`

### 使用原則

- 大面積以低彩度中性色為主
- 功能色只拿來做分類、狀態、圖示、badge、局部提示
- 主深色固定落在 `#2E2E2E` 到 `#484846`
- 白色通常帶透明度與漸層，而不是死白

## 6. 字體語言

來源大致在 [`index.html`](/Users/peter/Documents/New%20project/index.html#L46) 到 [`index.html`](/Users/peter/Documents/New%20project/index.html#L48)。

- 主字體：`Avenir Next`, `SF Pro Display`, `Segoe UI`, `Noto Sans TC`, `sans-serif`
- 展示字：同主字體
- 手寫點綴：`Nanum Pen Script`

### 排版原則

- 標題偏緊，常用負字距：`-0.03em ~ -0.06em`
- kicker / label 偏大字距：`0.12em ~ 0.22em`
- 內文行高偏寬：`1.5 ~ 1.85`
- 時間、代碼、trip id 適合用 `font-mono`

## 7. 比例原則

這一段是修 bug 最常用的，不只是設計規則。

### Header 比例

Header 必須符合：

- 左側品牌區要有明確主次：`year -> destination -> TRAVEL GUIDE`
- 右側工具列不能比左側品牌小到像附件
- 按鈕命中區必須可點，不可只剩 icon 大小
- `Notes` 不能小到像文字標籤，它是主操作之一

如果看到以下狀況，就是 bug：

- 右上按鈕太小，容易誤觸其他區域
- `Notes` 看起來像小字而不是按鈕
- `year` 太大把主標題壓縮
- header 左右視覺重量失衡

### Settings Modal 比例

設定視窗應該：

- 桌機版像置中的大面板，但不是超寬白板
- 手機版像大型 sheet，而不是縮小版桌機視窗
- 內容本身要有足夠字級與控制尺寸，不可只放大外框
- `目前行程` 卡片要是主視覺重點
- `地圖區域` / `行程切換` 應該一眼可操作
- 底部 `新增行程` 應該像主要 CTA

如果看到以下狀況，就是 bug：

- modal 外框很大，但內容很小
- 桌機版左右空白過多，像表單被縮在中間
- 手機版字太小、按鈕太擠、像桌機縮圖
- `YEAR` badge 過大或過小，把卡片比例拉壞

### Action Button 比例

可操作按鈕至少要滿足：

- 主要按鈕比次要按鈕更重
- 同一排按鈕高度一致
- 文字不能小到像備註
- 手機上要優先確保命中區，再談精緻

## 8. 材質感

重點樣式可看 [`index.html`](/Users/peter/Documents/New%20project/index.html#L93), [`index.html`](/Users/peter/Documents/New%20project/index.html#L112), [`index.html`](/Users/peter/Documents/New%20project/index.html#L350) 附近。

### 視覺質地

- glass header：半透明淺底 + 大模糊 + 淡白邊
- card：白色漸層，不用純平色塊
- border：很淡，接近霧白色
- shadow：大範圍、低濃度、柔軟

### 禁忌

- 厚重黑影
- 高飽和霓虹色
- 大面積深色實心面板
- 為了「看起來明顯」而把邊框拉很黑

## 9. 主要元件語言

### Header

來源大致在 [`index.html`](/Users/peter/Documents/New%20project/index.html#L832) 到 [`index.html`](/Users/peter/Documents/New%20project/index.html#L862)。

規則：

- 左側是品牌 / trip identity
- 右側是主操作群
- 工具按鈕都是圓形
- `Notes` 是大型膠囊主操作
- 整組 header 是浮在內容上的 glass bar

### Day Tabs

來源大致在 [`index.html`](/Users/peter/Documents/New%20project/index.html#L864) 到 [`index.html`](/Users/peter/Documents/New%20project/index.html#L866)。

規則：

- active 是亮面膠囊
- inactive 幾乎透明
- 用 scale 和陰影做微小差異
- tabs 必須可滑動，不應壓縮到擠在一起

### Day Meta Card

來源大致在 [`index.html`](/Users/peter/Documents/New%20project/index.html#L870) 之後。

規則：

- 日期最大
- day title 與 crowd badge 次之
- 摘要要易讀，不可壓太窄

### Settings Modal

來源大致在 [`index.html`](/Users/peter/Documents/New%20project/index.html#L1029) 之後。

規則：

- `目前行程` 卡片固定為第一層焦點
- `地圖區域` 與 `行程切換` 都是直接操作
- 分享模式與一般模式視覺上要有差異，但不能像兩個產品
- `新增行程` 是底部主 CTA

### Share Settings

分享版設定不是一般設定去掉功能而已。

它應該：

- 明確顯示唯讀狀態
- 讓使用者知道目前連結固定在某個 trip
- 主操作是複製分享連結，而不是編輯
- 一般分享應優先使用可連動更新的 direct share URL
- 若使用者只想分享某幾天，應使用 `days=` 參數式分享，而不是手動複製或拆資料
- 分享按鈕按下後要立刻有可見回饋，不可卡住數秒像沒反應
- 如果分享連結需要壓縮或組裝較大的 payload，必須先讓 loading 狀態成功渲染，再執行重工作
- 成功後按鈕應短暫顯示 `已複製` 或等價成功狀態，而不只靠遠處通知訊息
- 若自動複製失敗，畫面仍必須直接顯示可手動複製的分享連結，不能只留下失敗提示

### Notebook / Notes

規則：

- Notes 是主要功能，不是附屬功能
- modal 要像筆記本，不是普通 textarea dialog
- 唯讀模式與可編輯模式需有清楚差異

## 10. 響應式邏輯

### 手機版

- 主內容像 sheet 疊在地圖之上
- Header 比例要緊湊但不能小氣
- 設定 modal 要優先保證按得到與讀得懂
- 設定 modal 應像高品質產品卡片，不可只有白底加細框；要有清楚的 surface hierarchy、主次 CTA、說明文字與選擇器節奏
- 三個次要按鈕可用等寬排列，但不可因此縮成小貼紙
- 若某顆按鈕文案較長，例如分享按鈕，手機版應允許它獨占一整排，而不是硬塞進三等分格線造成互相擠壓

### 桌機版

- 左右雙欄清楚
- 設定 modal 不能過度貼近手機比例，也不能寬到像空白簡報
- 內容欄寬應有 readable max-width
- 分享指定日期區要像完整功能卡，而不是一塊臨時拼上的表單；需有標題、說明、狀態摘要與清楚主按鈕

## 11. 功能與 UI 的對應邏輯

這一段是讓 AI 修 bug 時知道哪些畫面不是純裝飾。

### Trip 切換

UI 上的 `行程切換`：

- 不是單純切 label
- 必須同步切換 active trip state
- 必須帶出該 trip 的 country / map config / notes / schedule

如果切換行程後只是標題改了，但地圖、內容、筆記沒換，那是 bug。

### 地圖區域

UI 上的 `地圖區域`：

- 是目前 trip 的屬性
- 不是全域設定
- 切到另一個 trip 時，應該回到該 trip 自己的 country 設定

### Share Mode

分享模式：

- 是唯讀視圖
- 不應讓使用者誤以為能改資料
- 但可以複製 share link
- 若 URL 含 `days=1,3,5` 這類參數，畫面只顯示指定日期，且 Day tab 要維持原本的日序編號
- 分享互動若偏慢，優先檢查 `scripts/app.js` 的 share URL 生成、快取、預熱與 clipboard 流程，而不是先調 CSS

### Airport Marker Logic

地圖邏輯目前已修正成：

- 有座標的機場事件也要顯示 marker
- 但 fitBounds 可以優先用非機場點位，避免畫面被拉太遠

如果之後機場又消失，先查 `services/map.js`，不要先改 trip data。

## 12. 常見 Bug 排查指南

### A. Modal 太大但內容太小

先檢查：

- `.settings-shell`
- `.settings-body`
- `.settings-current-card`
- `.sync-input`
- `.trip-inline-action`
- template 裡的 `text-*` class 是否仍太小

### B. 手機版像桌機縮圖

先檢查：

- `@media (max-width: 767px)`
- 是否只調整外框、沒調文字與按鈕
- action buttons 是否仍沿用桌機 padding / font-size

### C. 桌機版太空、像白板

先檢查：

- `.settings-shell` 是否過寬
- `.settings-body` 是否缺少 max-width
- 內容區是否沒有主次層級

### D. Header 按鈕難按

先檢查：

- `.header-icon-button`
- `.notes-button`
- `.header-toolbar`

不要只放大 icon，命中區要一起放大。

### E. Share Mode 視覺混亂

先檢查：

- `isShareMode` 分支
- `.share-settings-banner`
- `.share-settings-copy`
- 是否把一般模式按鈕殘留在 share mode

### F. Map 看起來錯，但其實是 state 錯

先檢查：

- `scripts/app.js` trip switching
- `services/map.js` marker render / fitBounds
- `scripts/config.js` country config

## 13. 修改 UI 時的原則

如果你要改 UI：

1. 先判斷是比例問題、階層問題、還是狀態問題
2. 優先修結構，不要只靠單點字級補救
3. 桌機與手機都要檢查
4. 保持這個 app 的 calm / soft / sheet-based 語言
5. 改完後要同步更新 `PROJECT_CONTEXT.md`
6. 如果規則本身變了，也要更新本檔

## 14. Recent UI Logic Changes

- Header controls and `Notes` button were enlarged so they are easier to tap on both desktop and mobile.
- Settings modal was changed from a tiny-content layout to a larger content-scale layout.
- Settings content now aims for:
  - larger typography
  - larger form controls
  - larger action buttons
  - better desktop readable width
  - mobile sheet proportions instead of desktop shrinkage
- Share settings and normal settings should still feel like the same product, but with different interaction permissions.

## 15. Update Notes

Whenever Claude Code or Codex changes:

- header layout
- modal proportions
- settings flow
- share mode UI
- map presentation
- trip management UI

update this file with:

1. what changed
2. which rule changed
3. whether the change was desktop only, mobile only, or both
