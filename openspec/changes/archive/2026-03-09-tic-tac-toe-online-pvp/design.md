## Context

井字棋已有 PvP 和 PvE 模式。現要加入線上對戰，使用 WebRTC P2P 連線，不需後端伺服器，相容 GitHub Pages 靜態部署。PeerJS 提供免費雲端信令伺服器，簡化 WebRTC 連線建立。

## Goals / Non-Goals

**Goals:**
- 透過 PeerJS 建立 WebRTC P2P 連線，實現即時棋步同步
- 簡單的房間機制：建立方產生 6 碼代碼，加入方輸入代碼連線
- 處理連線狀態：等待、已連線、斷線
- 沿用現有 SetupScreen 的 tab 模式，新增「線上對戰」tab

**Non-Goals:**
- 不做配對系統（matchmaking）
- 不做聊天功能
- 不做多局計分（線上模式每次只打一局）
- 不做斷線重連（斷線即結束）
- 不做觀戰模式

## Decisions

### PeerJS 連線管理模組

新增 `peerConnection.js` 封裝所有 PeerJS 邏輯。提供：
- `createRoom()` → 建立 Peer，回傳房間代碼（取 Peer ID 後 6 碼）
- `joinRoom(code)` → 連線到指定 Peer
- `sendMove(index)` → 透過 DataChannel 發送棋步
- `onReceiveMove(callback)` → 接收對方棋步
- `onDisconnect(callback)` → 對手斷線回呼
- `destroy()` → 清除連線

Peer ID 格式：`ttt-<6位隨機英數>`，用前綴避免與其他應用衝突。房間代碼就是後面的 6 碼部分。

替代方案：直接在 App.jsx 使用 PeerJS API — 會讓元件邏輯太複雜，抽成獨立模組較乾淨。

### 訊息協議

透過 DataChannel 傳送 JSON 訊息：
```
{ type: "move", index: 0-8 }
{ type: "restart" }       // 對手要求再來一局
{ type: "restart_ack" }   // 同意再來一局
```

替代方案：傳送完整 board state — 浪費頻寬且需要衝突處理，棋步同步更簡單。

### 角色分配

建立房間的人 (host) 固定為 X 先手，加入的人 (guest) 為 O。簡化設計，不需額外協商。

替代方案：隨機分配 — 需要額外的握手協議，增加複雜度。

### 線上模式遊戲流程

1. SetupScreen 選「線上對戰」→ 進入 OnlineLobby
2. OnlineLobby 提供兩個選項：建立房間 / 加入房間
3. 建立房間後顯示代碼等待對手
4. 加入房間後自動進入遊戲
5. 遊戲中棋步透過 DataChannel 同步
6. 遊戲結束後可「再來一局」（雙方都同意才重開）或「離開」
7. 任一方斷線 → 顯示提示 → 回到 SetupScreen

### OnlineLobby 為獨立元件

OnlineLobby 負責連線建立階段的 UI（建立/加入/等待），連線成功後由 App 切換到 GameScreen。

替代方案：把 lobby 嵌入 SetupScreen — 會讓 SetupScreen 過於複雜。

## Risks / Trade-offs

- **PeerJS 雲端信令伺服器穩定性** → 免費服務可能偶有不穩。可接受的 trade-off，未來可自架信令伺服器。
- **嚴格 NAT 環境** → 少數情況 P2P 連不上。PeerJS 預設使用 Google STUN，大部分情況可穿透。
- **作弊可能** → P2P 架構下客戶端可以修改訊息。對休閒遊戲可接受。
