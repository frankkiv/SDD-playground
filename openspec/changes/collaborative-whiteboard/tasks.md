## 1. 專案初始化

- [ ] 1.1 建立 whiteboard/ 子專案：Vite + React 樣板，vite.config.js 設定 base 為 `/SDD-playground/whiteboard/`
- [ ] 1.2 安裝 peerjs 依賴，建立基本目錄結構（src/components/, src/）
- [ ] 1.3 建立全域 CSS 變數與深色主題樣式（index.css），與現有專案風格一致
- [ ] 1.4 更新 deploy.yml 的 name_map 加入 `'whiteboard': '電子白板'`

## 2. 資料模型與核心狀態

- [ ] 2.1 定義繪圖物件資料結構（Stroke, Shape, Text）與圖層資料結構（Layer）
- [ ] 2.2 建立 whiteboardStore（React Context 或 useReducer）：管理 objects、layers、activeLayerId、activeTool、color、lineWidth、viewport（pan/zoom）
- [ ] 2.3 實作 undo/redo 歷史系統：undoStack/redoStack，command pattern，支援 author 標記

## 3. Canvas 渲染引擎

- [ ] 3.1 建立 WhiteboardCanvas 元件：雙層 Canvas（靜態層 + 動態層）疊加
- [ ] 3.2 實作物件渲染函式：renderStroke、renderShape（rect/ellipse/arrow）、renderText
- [ ] 3.3 實作靜態層重繪邏輯：按圖層 order 排序，跳過 hidden 圖層，依序繪製所有物件
- [ ] 3.4 實作動態層繪製：繪製中的筆跡/形狀即時預覽

## 4. 繪圖工具實作

- [ ] 4.1 實作畫筆工具：mousedown/mousemove/mouseup 收集座標點，產生 Stroke 物件
- [ ] 4.2 實作螢光筆工具：與畫筆相同邏輯，globalAlpha=0.3，預設較寬筆刷
- [ ] 4.3 實作橡皮擦工具：偵測滑鼠路徑與物件交集，移除觸碰到的物件
- [ ] 4.4 實作矩形工具：mousedown 記錄起點，mousemove 預覽，mouseup 產生 Shape 物件
- [ ] 4.5 實作圓形工具：同矩形邏輯，繪製橢圓
- [ ] 4.6 實作箭頭工具：繪製直線 + 箭頭端點
- [ ] 4.7 實作文字工具：click 顯示 input，確認後產生 Text 物件
- [ ] 4.8 加入觸控事件支援（touchstart/touchmove/touchend），防止 mouse/touch 雙重觸發

## 5. 無限畫布（Viewport）

- [ ] 5.1 實作平移功能：Pan 工具拖曳 + Space 鍵拖曳
- [ ] 5.2 實作縮放功能：滑鼠滾輪縮放，以游標為中心，限制 0.1x~5x
- [ ] 5.3 實作座標轉換函式：screenToCanvas / canvasToScreen，套用到所有繪圖操作
- [ ] 5.4 建立 ZoomIndicator 元件：顯示目前縮放百分比，點擊重置為 100%

## 6. 圖層管理

- [ ] 6.1 建立 LayerPanel 元件：側邊滑出面板，顯示圖層列表
- [ ] 6.2 實作新增/刪除圖層功能，保證至少保留一個圖層
- [ ] 6.3 實作切換 active 圖層、切換圖層可見性
- [ ] 6.4 實作圖層拖曳排序

## 7. 工具列 UI

- [ ] 7.1 建立 Toolbar 元件：底部工具列，工具按鈕（筆/螢光筆/橡皮擦/矩形/圓/箭頭/文字/平移）
- [ ] 7.2 建立 ToolOptions 元件：顏色選擇器（8 色預設 + 自訂色）、筆刷粗細選擇
- [ ] 7.3 建立操作按鈕：Undo/Redo/清空/匯出 PNG/存檔/載入/圖層面板開關
- [ ] 7.4 加入鍵盤快捷鍵：Ctrl+Z（undo）、Ctrl+Y（redo）、1-8 數字鍵切換工具

## 8. 檔案操作

- [ ] 8.1 實作匯出 PNG：合成所有可見圖層到離屏 Canvas，toDataURL 下載
- [ ] 8.2 實作存檔 JSON：序列化所有物件 + 圖層為 JSON，觸發下載
- [ ] 8.3 實作載入 JSON：讀取 JSON 檔案還原白板狀態，驗證格式正確性

## 9. P2P 連線同步

- [ ] 9.1 建立 peerConnection.js：沿用 PeerJS 架構，PREFIX='wb-'，createRoom/joinRoom/sendData/destroy
- [ ] 9.2 建立 OnlineLobby 元件：建立/加入房間 UI，與現有遊戲大廳風格一致
- [ ] 9.3 實作操作同步：所有繪圖操作（stroke/shape/text/undo/redo/clear/layer）透過 DataChannel 發送
- [ ] 9.4 實作初始狀態同步：連線時 host 發送完整 state snapshot 給 guest
- [ ] 9.5 實作斷線偵測與 banner 顯示

## 10. 頁面整合與路由

- [ ] 10.1 建立 App.jsx：畫面切換邏輯（setup → lobby → whiteboard），狀態管理
- [ ] 10.2 建立 SetupScreen：模式選擇（單人/線上），返回首頁連結
- [ ] 10.3 整合所有元件到主畫面：Canvas + Toolbar + LayerPanel + ZoomIndicator

## 11. 驗證與收尾

- [ ] 11.1 測試所有繪圖工具的基本功能
- [ ] 11.2 測試 P2P 連線與即時同步
- [ ] 11.3 測試存檔/載入/匯出功能
- [ ] 11.4 測試無限畫布平移縮放
- [ ] 11.5 Build 驗證，確認部署正常
