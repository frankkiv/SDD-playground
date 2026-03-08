## Context

SDD-playground 已有 tic-tac-toe 和 gomoku 兩個遊戲專案，皆用 React + Vite 建構，PeerJS 做 P2P 連線，部署到 GitHub Pages。現在要新增電子白板應用，技術棧相同但繪圖引擎是全新的領域。

白板與棋類遊戲的關鍵差異：棋類是離散回合制（每次傳一個落子座標），白板是連續串流（每秒可能傳數十到數百個座標點）。這影響資料結構和同步策略的設計。

## Goals / Non-Goals

**Goals:**
- 流暢的繪圖體驗（60fps 渲染，低延遲筆跡）
- 雙人即時協作，所有操作雙向同步
- 完整的繪圖工具組：畫筆、螢光筆、橡皮擦、形狀、文字
- 無限畫布支援平移與縮放
- 圖層管理（新增/刪除/切換/排序/可見性）
- Undo/Redo 歷史
- 存檔（JSON 下載/上傳）與匯出 PNG

**Non-Goals:**
- 三人以上多人協作（僅支援雙人 P2P）
- 雲端儲存或帳號系統
- 手寫文字辨識
- 壓力感應/傾斜感應（需要特殊硬體 API）
- 即時語音/視訊通話
- 移動/選取/變形已繪製的物件（物件不可在繪製後移動）

## Decisions

### 1. 繪圖資料模型：物件導向（Object-based）

**選擇**：每個繪製動作產生一個物件（stroke/shape/text），存入陣列。渲染時依序重繪所有物件。

**替代方案**：
- 像素陣列（Bitmap）：直接操作像素，但無法支援 undo/redo、圖層、匯出 JSON
- 即時像素合成：效能好但失去編輯彈性

**理由**：物件模型天然支援 undo（pop 最後物件）、圖層（物件標記所屬圖層）、存檔（序列化物件陣列）、同步（傳送物件即可）。

### 2. Canvas 渲染策略：多層 Canvas 疊加

**選擇**：
- **底層 Canvas**：渲染所有已完成的物件（靜態層）
- **頂層 Canvas**：渲染正在繪製中的物件（動態層）
- 完成繪製後將物件加入底層，清空頂層

**理由**：避免每次 mousemove 都重繪所有歷史物件。只有頂層需要高頻重繪，底層只在物件增減時重繪。

### 3. 無限畫布：CSS transform + 座標轉換

**選擇**：用一個 wrapper div 套用 CSS `transform: translate(x, y) scale(z)`，Canvas 本身保持固定大小（如 4000x4000）。滑鼠座標透過逆變換映射到畫布座標。

**替代方案**：
- 動態調整 Canvas 大小：效能差，context 會被清空
- 虛擬座標 + viewport 裁切：實作複雜

**理由**：CSS transform 由 GPU 加速，平移/縮放流暢。座標轉換邏輯集中在一個函式，容易維護。

### 4. 同步策略：操作同步（Operation-based）

**選擇**：同步繪圖操作而非像素資料。

訊息類型：
```
{ type: "stroke-start", id, tool, color, width, layerId, point }
{ type: "stroke-move", id, point }
{ type: "stroke-end", id }
{ type: "shape", id, shapeType, layerId, ... }
{ type: "text", id, layerId, x, y, content, fontSize, color }
{ type: "undo" }
{ type: "redo" }
{ type: "clear" }
{ type: "layer-add", layerId, name }
{ type: "layer-remove", layerId }
{ type: "layer-toggle", layerId }
{ type: "layer-reorder", order: [layerId...] }
```

**理由**：操作訊息很小（幾十 bytes），傳輸快。接收端重播操作即可還原狀態。也能直接整合進 undo/redo 歷史。

### 5. 連線後狀態同步：Full State Snapshot

**選擇**：連線建立時，房主發送完整狀態快照（所有圖層 + 所有物件 + undo 歷史）。之後用增量操作同步。

**理由**：確保雙方狀態一致。白板不像棋局有固定初始狀態，連線時可能已有大量內容。

### 6. 圖層模型

**選擇**：每個圖層有 id、name、visible、order。物件透過 layerId 歸屬於某圖層。渲染時按圖層 order 排序，跳過 visible=false 的圖層。

預設有一個「圖層 1」，使用者可新增/刪除/重新排序。

### 7. Undo/Redo 架構

**選擇**：Command pattern。每個操作封裝為 command 物件，包含 execute 和 undo 方法。

- 操作堆疊（undoStack）和重做堆疊（redoStack）
- 新操作 push 到 undoStack，清空 redoStack
- Undo：從 undoStack pop 並執行反向操作，push 到 redoStack
- 線上模式：undo/redo 操作也同步給對方

### 8. 工具列 UI 佈局

**選擇**：底部水平工具列（類似 Excalidraw）。

左側：工具選擇（畫筆/螢光筆/橡皮擦/形狀/文字/平移）
中間：當前工具的選項（顏色、粗細、形狀類型）
右側：操作按鈕（undo/redo/清空/匯出/存檔/載入）

圖層面板：右側可展開的側邊面板。

## Risks / Trade-offs

- **[大量物件時效能下降]** → 當物件超過一定數量時，將舊物件烘焙（rasterize）到離屏 Canvas，減少重繪數量
- **[無限畫布 Canvas 大小限制]** → 瀏覽器 Canvas 最大約 16384x16384，超過會失敗。設定合理上限（4000x4000）並在 UI 提示
- **[P2P 高頻傳輸延遲]** → stroke-move 訊息可能很密集。做 throttle（每 16ms 最多一次）或批次傳送（累積點後一次送出）
- **[連線中 undo 的一致性]** → 雙方各自 undo 只影響自己的操作，需要為每個操作標記 author。Undo 只回退自己的最近操作
- **[JSON 存檔大小]** → 大量筆跡的 JSON 可能很大。可考慮壓縮，但第一版先不做
- **[手機觸控支援]** → touch 事件和 mouse 事件需同時處理，防止 double-fire
