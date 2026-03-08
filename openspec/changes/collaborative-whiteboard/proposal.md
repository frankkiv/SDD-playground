## Why

現有的 SDD-playground 只有棋類遊戲，缺少創作/工具類應用。電子白板是最直覺的協作工具，能展示 WebRTC P2P 連線不只能用於回合制遊戲，也能處理高頻即時資料同步（筆跡串流）。同時滿足使用者對「畫畫寫字、標示重點」的需求。

## What Changes

- 新增 `whiteboard/` 子專案，獨立的 React + Vite 應用
- Canvas 繪圖引擎：自由繪圖、螢光筆、橡皮擦、形狀工具（矩形/圓形/箭頭）、文字工具
- 筆刷控制：顏色選擇器、粗細調整
- 畫布操作：無限畫布（平移/縮放）、圖層管理
- 編輯功能：Undo/Redo、清空畫布
- 檔案功能：匯出 PNG、存檔/載入（JSON 格式下載/上傳）
- P2P 連線：沿用 PeerJS 架構，建立/加入房間，所有繪圖操作即時雙向同步
- 工具列 UI：底部或側邊工具列，深色主題，與現有專案風格一致
- 部署：自動被 GitHub Actions workflow 偵測並部署到 `/SDD-playground/whiteboard/`

## Capabilities

### New Capabilities
- `drawing-engine`: Canvas 繪圖核心，包含畫筆、螢光筆、橡皮擦、形狀、文字等工具的繪製邏輯
- `canvas-viewport`: 無限畫布的平移與縮放，座標系統轉換
- `layer-management`: 圖層建立、切換、可見性控制、順序調整
- `toolbar-ui`: 工具列介面，工具切換、顏色/粗細選擇、圖層面板
- `history-system`: Undo/Redo 操作歷史管理
- `file-operations`: 匯出 PNG、存檔（JSON 下載）、載入（JSON 上傳）
- `realtime-sync`: P2P 連線同步所有繪圖操作，包含房間建立/加入、斷線處理

### Modified Capabilities
- `auto-deploy-workflow`: 新增 whiteboard 專案到 name_map（顯示名稱：電子白板）
- `landing-page`: 自動偵測新專案，無需改動

## Impact

- 新增 `whiteboard/` 子專案目錄，包含完整 React 應用
- 新增 `peerjs` 依賴（同現有專案）
- `.github/workflows/deploy.yml` 的 name_map 需加入 whiteboard 對應中文名
- 不影響現有 tic-tac-toe 和 gomoku 專案
