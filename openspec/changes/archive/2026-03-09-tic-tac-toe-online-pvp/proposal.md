## Why

井字棋目前只有本機雙人和 AI 單機模式，無法與遠端朋友對戰。利用 WebRTC (PeerJS) 實現瀏覽器端 P2P 連線，不需要後端伺服器，完全相容 GitHub Pages 靜態部署。

## What Changes

- 新增 PeerJS 依賴，建立 WebRTC P2P 連線模組
- SetupScreen 新增第三個模式 tab「線上對戰」
- 新增 OnlineLobby 元件：建立房間（產生短代碼）/ 輸入代碼加入房間
- 連線建立後進入遊戲，棋步透過 PeerJS DataChannel 即時雙向同步
- 處理連線狀態：等待中、已連線、對手斷線提示
- 線上模式下不計分、不支援多局（斷線即結束 session）

## Capabilities

### New Capabilities
- `online-pvp`: WebRTC P2P 連線對戰，包含房間建立/加入、棋步同步、連線狀態管理

### Modified Capabilities
- `game-session`: SetupScreen 加入線上對戰模式 tab，App 新增 online 模式的遊戲流程

## Impact

- `tic-tac-toe/package.json` — 新增 `peerjs` 依賴
- `tic-tac-toe/src/peerConnection.js` — 新增 PeerJS 連線管理模組
- `tic-tac-toe/src/components/SetupScreen.jsx` + CSS — 新增線上對戰 tab
- `tic-tac-toe/src/components/OnlineLobby.jsx` + CSS — 建立/加入房間 UI
- `tic-tac-toe/src/App.jsx` — 新增 online 模式狀態與棋步同步邏輯
