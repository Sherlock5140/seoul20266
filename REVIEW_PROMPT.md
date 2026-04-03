# Review Prompt

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
