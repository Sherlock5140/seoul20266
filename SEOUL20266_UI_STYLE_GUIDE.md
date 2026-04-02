# Seoul20266 UI Style Guide

這份文件整理 `seoul20266` 的 UI 語言，目標是讓另一個專案可以直接套用同一套視覺邏輯，而不是只複製幾個顏色或圓角。

## 1. 設計核心

`seoul20266` 的風格不是高對比科技感，也不是花俏旅遊廣告感，而是：

- 柔和中性色底
- 半透明霧面卡片
- 大圓角與膠囊按鈕
- 輕陰影、低壓迫感
- 清楚層級，但避免刺眼色塊
- 行動裝置優先，桌面版再展開

可以把它理解成：

`iOS sheet + travel notebook + calm editorial dashboard`

## 2. 色彩系統

來自 [`index.html`](/Users/peter/Documents/New project/index.html#L46) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L56)。

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

- 大面積一律用低彩度中性色，不要直接整塊用功能色當背景。
- 功能色只拿來做分類、狀態、局部圖示、badge、tag。
- 純黑不用真黑，主深色固定落在 `#2E2E2E` 到 `#484846`。
- 白色多半不是實心白，而是帶透明度的白。

## 3. 字體語言

來自 [`index.html`](/Users/peter/Documents/New project/index.html#L46) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L48)。

- 主字體：`Avenir Next`, `SF Pro Display`, `Segoe UI`, `Noto Sans TC`, `sans-serif`
- 展示字：同主字體
- 手寫點綴：`Nanum Pen Script`

### 排版原則

- 標題偏緊，常用負字距：`letter-spacing: -0.03em ~ -0.05em`
- 小標與 kicker 偏大字距：`0.12em ~ 0.22em`
- 內文行高偏寬鬆：`1.5 ~ 1.85`
- 數字、時間、匯率適合用 `font-mono`

### 套用建議

- App 主標題用英數字體感較強的 sans。
- 中文內容保留 `Noto Sans TC`，避免整體太硬。
- 只有少量情緒化元素才用手寫字，不要大量使用。

## 4. 形狀與空間

可參考 [`index.html`](/Users/peter/Documents/New project/index.html#L658), [`index.html`](/Users/peter/Documents/New project/index.html#L697), [`index.html`](/Users/peter/Documents/New project/index.html#L755)。

### 圓角策略

- 主面板：`2.5rem` 左右
- 區塊卡片：`1.45rem ~ 1.9rem`
- 小卡片：`1.2rem ~ 1.65rem`
- 按鈕與 tabs：`9999px`

### 間距策略

- 區塊之間以 `mb-5 ~ mb-8` 為主
- 卡片內距偏寬：`p-4 ~ p-6`
- 手機版縮但不擠，優先保留留白感

### 套用原則

- 每層容器都應該讓人感覺是「被包起來的 sheet」
- 避免銳角、細碎分隔線、過多邊框
- 靠圓角、淡陰影、透明白去建立層次

## 5. 材質感

重點樣式可看 [`index.html`](/Users/peter/Documents/New project/index.html#L93), [`index.html`](/Users/peter/Documents/New project/index.html#L109), [`index.html`](/Users/peter/Documents/New project/index.html#L226)。

### 視覺質地

- 玻璃感 header：半透明淺底 + 大模糊 + 淡白邊
- 卡片：白色漸層，不用純平面色塊
- 邊框：幾乎都非常淡，接近白霧色
- 陰影：大範圍、低濃度、偏柔軟

### 公式

- 背景多用 `linear-gradient(...)`
- `backdrop-filter: blur(20px~30px) saturate(150%)`
- 邊框常用 `rgba(255,255,255,0.7~0.9)`
- 陰影避免重黑，傾向 `rgba(47,47,45,0.08~0.22)`

### 禁忌

- 不要用厚重投影
- 不要用高飽和霓虹色
- 不要用實心深色大面板壓住整個畫面

## 6. 元件語言

### Header

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L663) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L689)。

- 左側是主品牌與年份
- 右側是膠囊工具列
- 工具按鈕都是圓形、淡白、可縮放
- Header 本身像浮在內容上方的 glass bar

適合移植到：

- Dashboard 頂部
- App overview header
- Mobile 首屏工具列

### Segment / Day Tabs

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L184) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L193) 與 [`index.html`](/Users/peter/Documents/New project/index.html#L689) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L690)。

- Active tab 是亮面膠囊
- Inactive 幾乎透明，只保留文字
- 用 scale 和陰影微幅凸顯 active

適合移植到：

- 切換不同頁籤
- 多步驟流程
- Filter chips

### 資訊摘要卡

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L697) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L711)。

- 標題大、摘要短、狀態 badge 小
- 一個卡片只承載一段主要資訊
- 層級順序非常清楚：日期 > 副標 > 摘要 > badge

適合移植到：

- 專案摘要
- 用戶狀態總覽
- 任務卡片頂部

### 功能小卡

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L716) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L737)。

- 三欄小卡片
- 每張卡只放一個圖示、一個 label、一個簡短值
- hover / active 只做輕縮放

適合移植到：

- 快捷入口
- KPI 縮圖卡
- 操作中心

### Timeline Card

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L750) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L765)。

- 外層有 timeline 線與節點
- 卡片本身是高質感白卡
- 上排放時間與分類
- 中間放主標題
- 下方補充說明與 tags

適合移植到：

- 活動流
- 任務歷史
- 訂單時間軸
- 更新紀錄

### Notice Panel

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L739) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L747)。

- 外框是淺色提醒板
- 內層再包一層白底 notice body
- 警示不是用大紅底，而是低彩暖紅點綴

適合移植到：

- 系統提醒
- 注意事項
- 狀態異常提示

### Modal / Sheet

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L790) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L806)。

- 手機像 bottom sheet
- 桌面版像置中的大圓角面板
- 遮罩用低濃度深色加些微 blur

適合移植到：

- 設定視窗
- 編輯表單
- 詳細資訊面板

## 7. 動效風格

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L265) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L268)。

### 原則

- 動作短、柔和、位移小
- 以 `opacity`、`translateY`、`scale` 為主
- 不做誇張彈跳或旋轉

### 常用效果

- 卡片進場：`fade-in-up`
- Modal：`slide-up`
- 按鈕按下：`scale(0.95 ~ 0.99)`
- 卡片 hover：陰影略增

### 節奏建議

- `0.18s` 給按鈕
- `0.3s` 給 modal / 狀態切換
- `0.5s` 給內容進場

## 8. 版面策略

參考 [`index.html`](/Users/peter/Documents/New project/index.html#L654) 到 [`index.html`](/Users/peter/Documents/New project/index.html#L658)。

### 結構

- 行動版：上方是 map / hero，下方是主要內容 sheet
- 桌面版：左右雙欄
- 主要資訊永遠在一個獨立 panel 裡

### 可複製原則

- 若另一個專案是 dashboard，可改為：
  - 左欄導航或摘要
  - 右欄主內容
- 若另一個專案是 content app，可改為：
  - 上方 hero 或篩選區
  - 下方內容卡片流

## 9. 直接套用規範

另一個專案若要「套這個味道」，請直接遵守下面幾條：

- 背景先換成 `#ECEDEA`
- 所有主卡片改成 `#F4F5F2` 或白色半透明漸層
- 大區塊圓角至少 `24px`
- 按鈕優先做成膠囊或圓形
- 文字顏色改成深灰，不要純黑
- 狀態色只做局部點綴，不做整塊底色
- modal 改成 sheet 感，不要傳統硬框對話框
- 區塊陰影改成柔和、低對比、範圍大
- 手機版保留安全區與底部 sheet 思維

## 10. 可直接複用的 Tailwind Token

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Avenir Next', '-apple-system', 'SF Pro Display', 'Segoe UI', 'Noto Sans TC', 'sans-serif'],
      display: ['Avenir Next', '-apple-system', 'SF Pro Display', 'Segoe UI', 'Noto Sans TC', 'sans-serif'],
      hand: ['Nanum Pen Script', 'cursive'],
    },
    colors: {
      'm-bg': '#ECEDEA',
      'm-card': '#F4F5F2',
      'typo-label': '#B6B8B3',
      'typo-title': '#2E2E2E',
      'typo-accent': '#C9A6A1',
      'm-text': '#484846',
      'm-sub': '#757573',
      'm-border': 'rgba(200,204,199,0.3)',
      's-pin': '#C8A7A1',
      's-alert': '#B0726B',
      's-warn': '#C9B56A',
      's-green': '#8FA39D',
      's-blue': '#8E9AAF',
      's-sand': '#D6C0B3',
    },
    letterSpacing: {
      context: '0.12em',
      calm: '0.03em',
    },
    boxShadow: {
      'ios-card': '0 8px 24px -6px rgba(0, 0, 0, 0.04)',
      'ios-float': '0 20px 40px -12px rgba(47, 47, 45, 0.08)',
      'ios-sheet': '0 -12px 30px rgba(0, 0, 0, 0.06)',
    }
  }
}
```

## 11. 複製時不要一起帶走的東西

- 行程、地圖、旅遊語意本身
- 針對 Seoul 行程的分類命名
- 太多 icon 種類
- 旅遊專屬 wording

要複製的是：

- 色彩邏輯
- 材質感
- 圓角與留白
- 互動節奏
- 卡片層級
- 行動版 sheet 佈局

## 12. 適合拿去優化另一個專案的方式

如果另一個專案是 React / Vue / HTML，都可以照這個順序改：

1. 先替換全域 token：顏色、字體、陰影、圓角
2. 再把 header、button、card、modal 四種核心元件改成這套語言
3. 最後才處理 timeline、tabs、notice 這些次元件

如果你要最快看到效果，優先改這四塊：

- App 背景
- 主卡片
- 頂部 header
- 主操作按鈕

只要先改這四個，整體氣質就會先接近 70%。
