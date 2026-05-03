(function attachSEOUL2026TripData(global) {
  const { registerTravelGuideTrip } = global;
  if (typeof registerTravelGuideTrip !== "function") return;
  registerTravelGuideTrip("SEOUL_2026", {
        meta: {
          title: 'Seoul Travel Guide',
          displayName: 'SEOUL',
          country: 'KR',
          catalogVersion: '20260503c',
          dateRange: '【2026 首爾 8 天 7 夜｜最終定案完全體行程 (20260331 航司通知更新版｜Day6冷麵整合版)】',
          hotel: '九樹 ROKAUS 精品飯店首爾龍山',
          hotelAccess: 'Check-in 15:00 / Check-out 11:00｜龍山站 1 號出口步行約 3 分鐘，備援新龍山站',
          pass: '氣候同行卡 7 日券（售價 20,000 韓元）｜Day 2-8 使用',
          passNotice: '不可搭新盆唐線、廣域/機場巴士，離開首爾區域下車可能需補票｜💡 備註：前往金浦機場搭乘地鐵（5號線 / 9號線）或 AREX 一般列車之金浦機場站－首爾站覆蓋區間，皆可使用氣候同行卡',
          transportStrategy: '短程、疲勞、有行李或趕時間搭計程車；中長程與尖峰跨江以地鐵優先'
        },
        schedule: [
          {
            date: "06/01 (一) Day 1",
            title: "高雄➔首爾(移動)＋飯店宵夜(1h) 👥 2人",
            lunch: "_______", lunchId: null, tea: "_______", teaId: null, dinner: "外送 (獵奇年糕/橋村炸雞)", dinnerId: "d1-e8",
            events: [
              { id: "d1-e1", time: "12:00", location: "家裡出發 ➔ 高雄小港機場 (KHH)", category: "transport", note: "🕒 預計 12:00-12:30 出門（保留緩衝）", coords: [22.5768, 120.3478] },
              { id: "d1-e2", time: "13:30", location: "抵達機場 & 辦理登機 (Check-in)", category: "flight", note: "✈️ 航班：台灣虎航 (Tigerair Taiwan) IT662\n   16:00 高雄小港機場 (KHH) 起飛\n   19:45 首爾金浦機場 (GMP) 抵達\n⚠️ 動作：托運行李、領登機證、過安檢", coords: [22.5768, 120.3478] },
              { id: "d1-e3", time: "15:20", location: "登機時間 Boarding（起飛前 40 分鐘）", category: "alert", note: "📍 動作：前往登機門準備排隊\n⚠️ 提醒：請於 15:40 前完成登機", tags: ["死線"], coords: null },
              { id: "d1-e4", time: "19:45", location: "抵達金浦機場 (GMP)", category: "transport", note: "🕒 通關預留 45-50 分鐘", coords: [37.5587, 126.8028] },
              { id: "d1-e5", time: "20:35", location: "交通：金浦機場 ➔ 九樹 ROKAUS 龍山", category: "transport", note: "🚕 【首選】計程車：預估 45-60 分鐘 / 約 20,000-25,000 韓元\n🚇 【備援 A】AREX 一般列車 [金浦機場] ➔ [首爾站]，轉 1號線 ➔ [龍山]\n🚇 【備援 B】5號線 [金浦機場] ➔ [孔德]，轉 京義中央線 ➔ [龍山]", coords: [37.5293, 126.9654] },
              { id: "d1-e6", time: "20:55", location: "外送下單決策", category: "alert", note: "A. 車況順利：在計程車上叫（預估 21:25 抵達）\nB. 車程延誤：抵達飯店再叫（改點橋村炸雞）", tags: ["關鍵"], coords: null },
              { id: "d1-e7", time: "21:25", location: "抵達飯店 Check-in", category: "hotel", note: "", coords: [37.5293, 126.9654] },
              { id: "d1-e8", time: "21:45", location: "大廳取餐吃宵夜", category: "food", note: "【Plan A】獵奇辣炒年糕（需於 21:25 前下單）\n【Plan B】橋村炸雞", coords: [37.5293, 126.9654] }
            ]
          },
          {
            date: "06/02 (二) Day 2",
            title: "龍理團路(1.5h)＋加山Outlet(4h) 👥 2人",
            lunch: "龍理團路早午餐", lunchId: "d2-e2", tea: "_______", teaId: null, dinner: "_______", dinnerId: null,
            events: [
              { id: "d2-e1", time: "10:00", location: "交通：飯店 ➔ 龍理團路", category: "transport", note: "🚇 【首選】4號線 [新龍山] ➔ [三角地]（1站 / 約3分鐘）\n🚌 【備案】藍色巴士 100 / 150 / 151 等", coords: [37.5312, 126.9705] },
              { id: "d2-e2", time: "上午", location: "早午餐名店【三選一】（位於三角地站周邊）", category: "food", note: "🕒 預估停留：約 1.5 小時（含候位與用餐）\n❶ Dotori (橡實)\n❷ SAM SAM SAM\n❸ Teddy Beurre House", coords: [37.5312, 126.9705] },
              { id: "d2-e3", time: "14:00", location: "【空窗期決策：14:00-15:30】", category: "alert", note: "💡 選項 A（需整理物品）：回飯店（15:30 出發前往加山）\n💡 選項 B（無須回防）：前往 Amore Pacific 總部（15:40 前離開）\n💡 選項 C（提早購物）：直接前往 Outlet\n💡 選項 D（車站商圈）：Emart 龍山店 / iPark Mall / 新羅愛寶客免稅店（15:40 前離開）", coords: [37.5293, 126.9654] },
              { id: "d2-e4", time: "16:00", location: "交通：龍山區域 ➔ 加山數碼園區 (Gasan)", category: "transport", note: "🚇 【首選】1號線 [龍山] ➔ [加山數碼園區] 直達\n🕒 全程約 35-40 分鐘（含步行與候車）\n🚕 【不建議】計程車：下班前路況不穩，效率通常不如地鐵", coords: [37.4815, 126.8826] },
              { id: "d2-e5", time: "16:40", location: "【Mario Outlet】(馬里奧 Outlet) 1/2/3館", category: "shopping", note: "🕒 平日（週二）至 21:00 結束營業\n====== 🛍️ 購物動線 ======\n❶ [16:40-17:50] 2館 (Leisure)：機能服飾\n❷ [17:50-19:20] 3館 (Mario Mall)：潮流服飾\n❸ [19:20-20:00] 決策與複驗結帳\n❹ [20:00-20:30] 晚餐（_______）", tags: ["戰力全開"], coords: [37.4784, 126.8887] },
              { id: "d2-e6", time: "20:30", location: "交通：加山數碼園區 ➔ 九樹 ROKAUS 龍山", category: "transport", note: "🚇 【首選】1號線 [加山數碼園區] ➔ [龍山] 直達（車程約 20 分鐘，總時間約 35 分鐘）", coords: [37.5293, 126.9654] },
              { id: "d2-e7", time: "21:15", location: "抵達飯店", category: "hotel", note: "", coords: [37.5293, 126.9654] }
            ]
          },
          {
            date: "06/03 (三) Day 3",
            title: "草原牧場(1.5h)＋雞排午餐(1h)＋鐵道自行車16:30場 👥 2人",
            lunch: "明洞辣炒雞排", lunchId: "d3-e6", tea: "馬鈴薯麵包 (外帶)", teaId: "d3-e5", dinner: "_______", dinnerId: null,
            notice: "====== ✅ Day 3 訂票完成重點（2人主行程） ======\n1. [ITX 去程] 龍山 Yongsan 09:21 ➔ 春川 Chuncheon 10:40｜ITX-Cheongchun 2061｜6號車 7A/7B｜19,600 韓元/2人\n2. [預約完成] 春川外國人觀光計程車｜2026/06/03（三）11:00｜私人旅遊 1 輛 2 人｜3 小時出租車游｜始發/終點：春川站｜34,485 韓元\n3. [體驗完成] 金裕貞鐵道自行車 / 김유정 레일바이크｜16:30 第8次｜2人座 x 1｜40,000 韓元\n4. [ITX 回程] 南春川 Namchuncheon 19:06 ➔ 龍山 Yongsan 20:20｜ITX-Cheongchun 2092｜6號車 6A/6B｜19,600 韓元/2人\n5. [自費提醒] 觀光計程車不含個人物品、餐飲費、門票；請攜帶護照與備用現金",
            events: [
              { id: "d3-e1", time: "09:21", location: "龍山站 (Yongsan)", category: "transport", note: "🚄 ITX-Cheongchun 2061｜龍山 09:21 ➔ 春川 10:40\n💺 座位：6號車 7A / 7B\n💰 票價：19,600 韓元 / 2人\n🍙 建議車上用餐", coords: [37.5298, 126.9647] },
              { id: "d3-e2", time: "10:40", location: "抵達春川站 (Chuncheon)", category: "activity", note: "📍 前往 1 號出口「Travel Island」櫃檯核對護照與資料", coords: [37.8844, 127.7171] },
              { id: "d3-e3", time: "11:00", location: "春川外國人觀光計程車啟動", category: "transport", note: "✅ 已付款完成\n🚕 方案：私人旅遊 / 1輛 / 2人\n🕒 內容：春川旅遊景點 3 小時出租車游（11:00-14:00）\n📍 始發站與終點站：春川站\n💰 價格：34,485 韓元\n⚠️ 不含：個人物品、餐飲費、門票", coords: [37.8844, 127.7171] },
              { id: "d3-e4", time: "11:40", location: "幸福草原牧場", category: "activity", note: "🕒 停留：1.5 小時", coords: [37.9472, 127.6703] },
              { id: "d3-e5", time: "13:35", location: "馬鈴薯麵包", category: "food", note: "🥡 外帶模式（Takeout Only），停留 25 分鐘", coords: [37.9255, 127.7812] },
              { id: "d3-e6", time: "14:20", location: "明洞辣炒雞排街", map_term: "Myeongdong Dakgalbi Street", category: "food", note: "🕒 停留：1 小時\n⚠️ 提醒：15:25 前務必上車離開", tags: ["死線"], coords: [37.8797, 127.7283] },
              { id: "d3-e7", time: "15:25", location: "交通：明洞辣炒雞排街 ➔ 金裕貞站", map_term: "Gimyujeong Station", category: "transport", note: "🚕 / 🚇 前往金裕貞鐵道自行車報到點\n⚠️ 16:10 前抵達搭乘區集合", tags: ["死線"], coords: [37.8164, 127.7135] },
              { id: "d3-e8", time: "15:50", location: "金裕貞鐵道自行車報到緩衝", category: "alert", note: "🚻 換實體票，16:10 前抵達搭乘區集合\n✅ 預約：金裕貞鐵道自行車 / 김유정 레일바이크｜2人座 x 1", coords: [37.8164, 127.7135] },
              { id: "d3-e9", time: "16:30", location: "金裕貞鐵道自行車（第8次）", category: "activity", note: "✅ 已預約完成\n🕒 場次：16:30 第8次\n💺 車型：2人座 x 1\n💰 金額：40,000 韓元\n🕒 體驗：約 1.5 小時（騎行 + 火車 + 接駁車）", coords: [37.8164, 127.7135] },
              { id: "d3-e10", time: "18:26", location: "地鐵移動：金裕貞站 ➔ 南春川站", category: "transport", note: "🚇 京春線 [金裕貞] ➔ [南春川]（1站）\n✅ 推薦兩班（車程 5 分鐘 / 票價 1,550 韓元）\nA. 18:26 出發步行進站 ➔ 18:30 發車 ➔ 18:35 抵達南春川\nB. 18:46 出發步行進站 ➔ 18:50 發車 ➔ 18:55 抵達南春川\n⚠️ 回程 ITX 19:06，建議優先搭 18:30 班次，18:50 為壓線備援", tags: ["關鍵"], coords: [37.8164, 127.7135] },
              { id: "d3-e11", time: "18:35", location: "抵達南春川站", map_term: "Namchuncheon Station", category: "transport", note: "☕ A 班 18:35 抵達，可保留約 31 分鐘候車\n⚠️ B 班 18:55 抵達，距 19:06 ITX 僅約 11 分鐘，僅作備援", coords: [37.8638, 127.7239] },
              { id: "d3-e12", time: "19:06", location: "回程首爾（ITX-Cheongchun 2092）", category: "transport", note: "🚄 南春川 19:06 ➔ 龍山 20:20\n💺 座位：6號車 6A / 6B\n💰 票價：19,600 韓元 / 2人", coords: [37.5298, 126.9647] }
            ]
          },
          {
            date: "06/04 (四) Day 4",
            title: "合井剪髮(3.5h)＋望遠(2h)＋新村/弘大(4.5h) 👥 2人主團＋2人隊友",
            lunch: "望遠市場小吃", lunchId: "d4-e4", tea: "_______", teaId: null, dinner: "新村 奶辣燉排骨", dinnerId: "d4-e6",
            notice: "====== ✈️ 隊友抵達會合動線（隊友 2 人） ======\n07:05 ｜ 隊友去程起飛\n✈️ 航班：中華航空 (China Airlines) CI164\n   07:05 高雄小港機場 (KHH) 起飛\n   11:00 首爾仁川機場 T2 (ICN) 抵達\n11:00 ｜ 隊友抵達仁川機場 T2\n🕒 預估 12:00 完成通關領取行李\n12:00 ｜ 交通：仁川 T2 ➔ 弘大入口站【Plan A / B 二選一】\n🚆 【Plan A】AREX 一般列車：車程約 53 分鐘 ｜ 票價約 4,750 韓元\n🚌 【Plan B】機場巴士 6002：車程約 70-80 分鐘 ｜ 票價 17,000 韓元\n13:10 ｜ 隊友抵達弘大，前往 Nabi Hostel（3號出口）寄放行李\n💡 票券建議：隊友可購買「氣候同行卡 3 日券（10,000 韓元）」\n🕒 預估 13:30 寄放完畢，開始自由活動 / 午餐\n📍 會合時間 A：14:00-14:30 於望遠站會合\n📍 會合時間 B：16:30 於弘大站會合，一同前往新村\n====================================",
            events: [
              { id: "d4-e1", time: "10:20", location: "主團交通：龍山 ➔ 合井", category: "transport", note: "🚇 【主團首選】4號線 [新龍山] ➔ [三角地]，轉 6號線 ➔ [合井]\n🕒 約 20-25 分鐘\n🚕 【主團備案】計程車：約 15-25 分鐘 / 10,000-13,000 韓元", coords: [37.5488, 126.9133] },
              { id: "d4-e2", time: "11:00", location: "合井站髮廊（主團 2 人）", category: "activity", note: "🕒 預估停留：約 3.5 小時（剪+染/燙）", coords: [37.5488, 126.9133] },
              { id: "d4-e3", time: "14:30", location: "交通：合井 ➔ 望遠", category: "transport", note: "🚇 6號線 [合井] ➔ [望遠]（1站）\n🕒 約 2 分鐘 + 步行至市場約 5-8 分鐘", coords: [37.5561, 126.9064] },
              { id: "d4-e4", time: "14:40", location: "望遠市場（主團 2 人＋隊友 2 人會合）", category: "food", note: "🕒 預估停留：約 1 小時 50 分", coords: [37.5561, 126.9064] },
              { id: "d4-e5", time: "16:30", location: "交通：望遠 ➔ 弘大入口站 ➔ 新村", category: "transport", note: "🚇 6號線 [望遠] ➔ [合井]，轉 2號線 ➔ [弘大入口] ➔ [新村]\n📍 於弘大站接應會合時間 B 的隊友，再一起前往新村站", coords: [37.5551, 126.9369] },
              { id: "d4-e6", time: "17:00", location: "晚餐：新村 奶辣燉排骨（4 人）", map_term: "소신이쏘", category: "food", note: "🕒 預估停留：約 1.5 小時", coords: [37.5551, 126.9369] },
              { id: "d4-e7", time: "18:30", location: "交通：新村 ➔ 弘大（逛街）", category: "transport", note: "🚶 步行：沿京義線書街約 15-20 分鐘\n🚇 備案：2號線 [新村] ➔ [弘大入口]（1站）", coords: [37.5575, 126.9245] },
              { id: "d4-e8", time: "19:00", location: "弘大商圈逛街（4 人）", category: "shopping", note: "🕒 預估停留：約 2.5 小時", coords: [37.5575, 126.9245] },
              { id: "d4-e9", time: "21:30", location: "交通：返回各自住宿點", category: "transport", note: "🚇 主團：京義中央線 [弘大入口] ➔ [용산 / 龍山] 直達；若班次不順則改搭 2號線轉回龍山區\n🚕 主團備案：計程車約 20 分鐘 / 10,000-15,000 韓元\n🚶 隊友：直接步行返回弘大 Nabi Hostel", coords: [37.5293, 126.9654] }
            ]
          },
          {
            date: "06/05 (五) Day 5",
            title: "夢碳(2h)＋新羅免稅店(2h)＋聖水洞(3.5h) 👥 4人",
            lunch: "夢碳 (燒肉)", lunchId: "d5-e4", tea: "_______", teaId: null, dinner: "烤黨 / 馬鈴薯排骨湯（二選一）", dinnerId: "d5-e9",
            events: [
              { id: "d5-e1", time: "10:00", location: "交通：各自出發 ➔ 夢碳 (Mongtan / 몽탄)", category: "transport", note: "🚌 主團：由龍山出發，藍色巴士 100 / 150 / 151 等，約 11 分鐘 ➔ [三角地站] 下車\n🚇 隊友：由弘大出發，2號線 [弘大入口] ➔ [合井]，轉 6號線 ➔ [三角地] 周邊步行會合", coords: [37.5372, 126.9698] },
              { id: "d5-e2", time: "10:40", location: "主團抵達現場準備候位", category: "alert", note: "⚠️ 11:00 開放現場機台登記\n📋 主團操作機台，直接登記 4 位用餐", tags: ["關鍵"], coords: [37.5372, 126.9698] },
              { id: "d5-e3", time: "上午", location: "附近咖啡廳等待（_______）", map_term: "Approach Coffee", category: "food", note: "", coords: [37.5288, 126.9715] },
              { id: "d5-e4", time: "午餐", location: "夢碳（4 人）", map_term: "몽탄", category: "food", note: "🕒 12:00 開始叫號入座\n⚠️ 提醒：4 人需到齊方可入座\n🕒 預估停留：約 1.5 - 2 小時", coords: [37.5372, 126.9698] },
              { id: "d5-e5", time: "14:10", location: "交通：夢碳 ➔ 新羅免稅店首爾店", category: "transport", note: "🚕 【首選】計程車：約 15-25 分鐘 / 8,000-12,000 韓元\n🚇 【備案】地鐵＋接駁車\n   1. 先搭地鐵前往 3號線 [東國大入口站 / Dongguk University]\n   2. 由 5 號出口出站\n   3. 步行前往新羅酒店正門（Hotel Shilla main gate）\n   4. 轉搭新羅酒店接駁車前往免稅店\n   5. 全程時間需另加出站步行、等車與接駁時間，依現場狀況浮動\n💡 建議：若是 4 人同行且有明確購物時段，仍以計程車最省事", coords: [37.5562, 127.0084] },
              { id: "d5-e6", time: "14:40", location: "新羅免稅店首爾店 / 彈性購物（4 人）", category: "shopping", note: "🕒 預估停留：約 2 小時", coords: [37.5562, 127.0084] },
              { id: "d5-e7", time: "16:40", location: "交通：新羅免稅店 ➔ 聖水", category: "transport", note: "🚕 【首選】計程車：約 20-30 分鐘 / 12,000-16,000 韓元\n🚇 【備案】3號線 [東國大入口] ➔ [乙支路3街]，轉 2號線 ➔ [聖水]\n🕒 地鐵總時間約 35-40 分鐘（含轉乘步行）", coords: [37.5445, 127.0560] },
              { id: "d5-e8", time: "17:10", location: "聖水洞逛街（4 人）", category: "shopping", note: "🕒 可用時間約 1 小時 20 分（晚餐前）", coords: [37.5445, 127.0560] },
              { id: "d5-e9", time: "18:30", location: "晚餐決策：【Plan A / B 二選一】", category: "food", note: "🍽️ 【Plan A】烤黨 聖水店\n🥣 【Plan B】聖水馬鈴薯排骨湯\n🕒 預估停留：約 1.5 小時", coords: [37.5428, 127.0543] },
              { id: "d5-e10", time: "20:00", location: "晚餐結束後於聖水周邊短暫整理 / 補逛", category: "shopping", note: "🕒 約 30-40 分鐘", coords: [37.5445, 127.0560] },
              { id: "d5-e11", time: "20:40", location: "交通：聖水 ➔ 龍山 / 弘大（各自回防）", category: "transport", note: "🚇 主團【首選】2號線 [聖水] ➔ [往十里]，轉 京義中央線 ➔ [龍山]\n🕒 主團約 35-45 分鐘（含轉乘與步行）\n🚕 主團【備案】計程車：若路況順暢再考慮\n🚇 隊友【首選】2號線 [聖水] ➔ [弘大入口] 直達\n🕒 隊友約 35-40 分鐘\n💡 原則：週五晚間跨江回程，地鐵時間最穩", coords: [37.5293, 126.9654] }
            ]
          },
          {
            date: "06/06 (六) Day 6",
            title: "首爾中央區域：安國/益善洞(4.5h) 👥 白天 4人 ➔ 晚上主團 2人",
            lunch: "益善翠響 / 無招牌 / 雞林食堂", lunchId: "d6-e4", tea: "_______", teaId: null, dinner: "乙支精肉 / 自理", dinnerId: "d6-e7",
            notice: "====== ✈️ 隊友回程航班（隊友 2 人） ======\n✈️ 航班：台灣虎航 (Tigerair Taiwan) IT663\n   ｜ 20:35 首爾金浦機場 (GMP) 起飛\n   ｜ 22:40 高雄小港機場 (KHH) 抵達\n====================================\n\n====== ✈️ 隊友撤離動線（隊友 2 人） ======\n💡 撤離決策：依是否回弘大拿行李，分 A / B 方案\n* 💰 交通備註：前往金浦機場時，5號線直達與 AREX 金浦機場站－首爾站覆蓋區間可用氣候同行卡\n\n▼ 【Plan A：需回弘大拿行李】\n17:00 ｜ 隊友脫隊：從益善洞 / 鐘路3街返回弘大\n17:30 ｜ 抵達 Nabi Hostel 取行李\n17:40 ｜ 隊友前往弘大入口站\n18:00 ｜ 隊友搭乘 AREX 一般列車 ➔ 金浦機場站\n18:30 ｜ 抵達金浦機場航廈，準備辦理 20:35 虎航 IT663 報到\n\n▼ 【Plan B：無大型托運行李，市區直達】\n17:30 ｜ 隊友脫隊：鐘路3街直接前往金浦機場\n      ｜ 🚇 【首選】5號線 [鐘路3街] ➔ [金浦機場] 直達（約 43 分鐘）\n      ｜ 🚇 【備案】1號線 / 4號線接首爾站，再轉 AREX 一般列車到金浦機場\n18:30 ｜ 抵達金浦機場航廈，準備辦理 20:35 虎航 IT663 報到\n====================================\n\n15:30 ｜ 暫定加入：正宗平壤冷麵\n      ｜ 時段：中午或下午\n      ｜\n      ｜ （共用交通條件）\n      ｜ 吃飽後可接五號線 → 直達金浦機場\n      ｜\n      ｜ 優選1｜又來屋（우래옥，1946年｜米其林 必比登推薦）\n      ｜ 定位：首爾代表老字號，初訪首選\n      ｜ 特色：代表性強，冷麵＋烤牛肉組合完整\n      ｜ 風險：熱門需排隊\n      ｜ 交通補充：另可利用 2 號線返回弘大\n      ｜ 營業時間：11:30–21:00（週一休｜無午休）\n      ｜\n      ｜ 2｜平壤麵屋（평양면옥｜米其林 入選餐廳）\n      ｜ 定位：老派正統風格\n      ｜ 特色：冷麵本味明確，偏行家取向\n      ｜ 風險：口味偏淡\n      ｜ 營業時間：11:00–21:30（週一休｜無午休）\n      ｜\n      ｜ 💡 動線原則：冷麵安排在安國／益善洞下方段落，吃完後隊友可順接五號線前往金浦機場；主團則可視情況回到鐘路／乙支路晚餐區域或直接收尾",
            events: [
              { id: "d6-e1", time: "09:00", location: "Catchtable 遠端取號（Artist Bakery）", category: "alert", note: "", coords: null },
              { id: "d6-e2", time: "10:00", location: "交通：龍山 / 弘大 ➔ 安國站", category: "transport", note: "🚇 主團：4號線 [新龍山] ➔ [忠武路]，轉 3號線 ➔ [安國]\n🚇 隊友：2號線 [弘大入口] ➔ [乙支路3街]，轉 3號線 ➔ [安國]\n🕒 時間：主團約 25 分鐘；隊友約 25-30 分鐘（含轉乘與步行）\n💡 建議：安國站集合後再一起步行前往 Artist Bakery", coords: [37.5766, 126.9854] },
              { id: "d6-e3", time: "10:30", location: "【Artist Bakery】（鹽麵包外帶）", map_term: "Artist Bakery", category: "food", note: "📍 安國站 1 號出口\n🕒 預估停留：約 1 小時", coords: [37.5768, 126.9850] },
              { id: "d6-e4", time: "12:00", location: "午餐：人氣美食【三選一】（4 人）", category: "food", note: "🕒 預估停留：約 1.5 小時\n❶ Ikseon Chwihyang（益善翠響）\n❷ Ganpan Eopneun Gage（無招牌店）\n❸ 雞林食堂 本店（계림식당）", coords: [37.5744, 126.9905] },
              { id: "d6-e5", time: "13:30", location: "【益善洞韓屋村】（4 人）", category: "activity", note: "🕒 預估停留：約 1.5 小時", coords: [37.5744, 126.9905] },
              { id: "d6-e5b", time: "15:30", location: "正宗平壤冷麵【二選一】", category: "food", note: "【優選 1】又來屋（우래옥，1946年｜米其林 必比登推薦）\n定位：首爾代表老字號，初訪首選\n特色：代表性強，冷麵＋烤牛肉組合完整\n風險：熱門需排隊\n交通補充：另可利用 2 號線返回弘大\n營業時間：11:30–21:00（週一休｜無午休）\n\n【優選 2】平壤麵屋（평양면옥｜米其林 入選餐廳）\n定位：老派正統風格\n特色：冷麵本味明確，偏行家取向\n風險：口味偏淡\n營業時間：11:00–21:30（週一休｜無午休）\n\n💡 交通：吃飽後隊友可順接 5 號線直達金浦機場；主團可視情況回鐘路／乙支路晚餐區域或直接收尾", coords: [37.5728, 126.9890] },
              { id: "d6-e6", time: "15:30", location: "交通：主團周邊彈性逛街 / 前往晚餐區域", category: "transport", note: "🚶 步行：益善洞周邊至鐘路3街 / 乙支路3街商圈", coords: [37.5714, 126.9915] },
              { id: "d6-e7", time: "18:00", location: "晚餐：乙支精肉（韓式烤肉）或周邊自理（主團 2 人）", category: "food", note: "🕒 預估停留：約 1.5 小時", coords: [37.5674, 126.9921] },
              { id: "d6-e8", time: "20:00", location: "交通：鐘路3街（或乙支路3街）➔ 九樹 ROKAUS 龍山（主團 2 人）", category: "transport", note: "🚇 1號線 [鐘路3街] ➔ [龍山]\n🕒 約 12-15 分鐘 + 步行回飯店 5 分鐘", coords: [37.5293, 126.9654] }
            ]
          },
          {
            date: "06/07 (日) Day 7",
            title: "舍堂醫美(3.5h)＋狎鷗亭/羅德奧(3.5h)＋漢南洞(3h) 👥 2人",
            lunch: "_______", lunchId: null, tea: "Milestone Coffee", teaId: "d7-e6", dinner: "漢南洞 24H 馬鈴薯湯", dinnerId: "d7-e8",
            events: [
              { id: "d7-e1", time: "10:15", location: "交通：龍山 ➔ 舍堂（主團 2 人）", category: "transport", note: "🚇 【首選】4號線 [新龍山] ➔ [舍堂]\n🕒 約 13 分鐘 + 步行約 5 分鐘", coords: [37.4765, 126.9816] },
              { id: "d7-e2", time: "11:00", location: "舍堂醫美療程", category: "activity", note: "🕒 預估停留：3 ~ 3.5 小時（含諮詢、麻醉、施作、修復）", coords: [37.4765, 126.9816] },
              { id: "d7-e3", time: "14:45", location: "交通：舍堂 ➔ 狎鷗亭 / 羅德奧", category: "transport", note: "🚕 【首選】計程車：約 25-35 分鐘 / 12,000-16,000 韓元\n🚇 【備案】地鐵：依最終目的地是「狎鷗亭站」或「狎鷗亭羅德奧站」再決定轉乘", coords: [37.5273, 127.0392] },
              { id: "d7-e4", time: "15:15", location: "狎鷗亭 / 羅德奧（島山公園周邊）", category: "shopping", note: "🕒 預估停留：約 3.5 - 4 小時", coords: [37.5273, 127.0392] },
              { id: "d7-e5", time: "18:30", location: "交通：狎鷗亭 ➔ 漢南洞", category: "transport", note: "🚌 【首選】公車 142 / 144 / 472（約 15-20 分鐘）\n🚕 【備案】計程車：約 5-10 分鐘 / 6,000-8,000 韓元", coords: [37.5348, 127.0012] },
              { id: "d7-e6", time: "19:00", location: "漢南洞逛街", category: "shopping", note: "🕒 預估停留：約 3 小時\n☕ 推薦：Milestone Coffee Hannam", coords: [37.5348, 127.0012] },
              { id: "d7-e7", time: "20:20", location: "步行前往：漢南洞 24小時馬鈴薯排骨湯", category: "transport", note: "", coords: [37.5332, 127.0028] },
              { id: "d7-e8", time: "20:30", location: "晚餐：漢南洞 24小時馬鈴薯排骨湯", map_term: "24시뼈다귀감자탕", category: "food", note: "", coords: [37.5332, 127.0028] },
              { id: "d7-e9", time: "21:50", location: "交通：漢南洞 ➔ 九樹 ROKAUS 龍山", category: "transport", note: "🚌 【首選】公車 400 / 110B（約 20-25 分鐘）\n🚕 【備案】計程車：約 10-15 分鐘 / 8,000-11,000 韓元", coords: [37.5293, 126.9654] }
            ]
          },
          {
            date: "06/08 (一) Day 8",
            title: "龍山最後掃貨(4h)＋金浦機場(3h) 👥 2人",
            lunch: "_______", lunchId: null, tea: "_______", teaId: null, dinner: "_______", dinnerId: null,
            events: [
              { id: "d8-e1", time: "10:00", location: "整理行李 & 準備 Check-out", category: "hotel", note: "", coords: [37.5293, 126.9654] },
              { id: "d8-e2", time: "11:00", location: "辦理退房（Check-out）", category: "hotel", note: "🧳 行李寄放在飯店櫃台", coords: [37.5293, 126.9654] },
              { id: "d8-e3", time: "11:15", location: "【空窗期：11:15-17:00】（最後掃貨）", category: "shopping", note: "🕒 可用時間：約 5.5 小時\n💡 選項 A：Emart 龍山店（步行可達）\n💡 選項 B：iPark Mall", coords: [37.5286, 126.9640] },
              { id: "d8-e4", time: "17:00", location: "回到飯店領取行李", category: "hotel", note: "", coords: [37.5293, 126.9654] },
              { id: "d8-e5", time: "17:30", location: "交通：九樹 ROKAUS 龍山 ➔ 金浦機場 (GMP)", category: "transport", note: "🚕 【首選】計程車：17:30 逢下班尖峰，預估 50-70 分鐘 / 約 25,000-30,000 韓元\n🚇 【強力備援】1號線 / 京義中央線接首爾站，再轉 AREX 一般列車 ➔ 金浦機場\n💡 若 17:00-17:15 即時地圖顯示全線紅塞，直接改搭地鐵保到達時間", coords: [37.5587, 126.8028] },
              { id: "d8-e6", time: "18:30", location: "抵達金浦機場 & 辦理登機", category: "flight", note: "✈️ 航班：台灣虎航 (Tigerair Taiwan) IT663\n   20:35 首爾金浦機場 (GMP) 起飛\n   22:40 高雄小港機場 (KHH) 抵達\n1. 航空公司櫃檯：託運行李（報到開櫃時間依航空公司當日公告）\n2. 退稅 / 海關查驗：依金浦機場當日現場導引處理", coords: [37.5587, 126.8028] },
              { id: "d8-e7", time: "19:00", location: "通過安全檢查 & 證照查驗（Immigration）", category: "alert", note: "🕒 預估約 20-30 分鐘", coords: null },
              { id: "d8-e8", time: "19:20", location: "領取線上免稅品 & 領取退稅金", category: "shopping", note: "🕒 免稅品點交確認\n📍 提貨位置：通過安檢後依現場指示牌前往", coords: null },
              { id: "d8-e9", time: "19:55", location: "登機時間 Boarding（起飛前 40 分鐘）", category: "alert", note: "📍 前往登機門準備排隊\n⚠️ 優先完成免稅品提貨與登機準備", coords: null },
              { id: "d8-e10", time: "20:35", location: "起飛返程（Tigerair IT663 to KHH）", category: "flight", note: "", coords: null },
              { id: "d8-e11", time: "22:40", location: "抵達高雄小港機場 (KHH)", category: "transport", note: "", coords: [22.5768, 120.3478] }
            ]
          }
        ]
  });
})(window);
