## 1. Dependencies

- [x] 1.1 安裝 peerjs 套件 (`npm install peerjs`)

## 2. PeerJS Connection Module

- [x] 2.1 新增 `src/peerConnection.js`：建立 Peer 實例，Peer ID 格式 `ttt-<6碼隨機英數>`
- [x] 2.2 實作 `createRoom()` — 建立 Peer 並監聯連線，回傳 Promise 包含 roomCode 和連線事件
- [x] 2.3 實作 `joinRoom(code)` — 連線到指定 Peer ID (`ttt-<code>`)
- [x] 2.4 實作 `sendData(data)` — 透過 DataChannel 傳送 JSON 訊息
- [x] 2.5 實作事件回呼：onData、onConnect、onDisconnect、onError
- [x] 2.6 實作 `destroy()` — 關閉連線並清除 Peer 實例

## 3. OnlineLobby Component

- [x] 3.1 新增 `OnlineLobby.jsx` — 兩個選項：建立房間 / 加入房間
- [x] 3.2 建立房間流程：呼叫 createRoom()，顯示房間代碼 + 複製按鈕 + 等待狀態
- [x] 3.3 加入房間流程：輸入 6 碼代碼，呼叫 joinRoom()，顯示連線中狀態
- [x] 3.4 連線失敗顯示錯誤訊息「無法連線，請確認房間代碼」
- [x] 3.5 連線成功後呼叫 `onConnected(role)` 回呼通知 App
- [x] 3.6 新增 `OnlineLobby.module.css`

## 4. SetupScreen Update

- [x] 4.1 在 SetupScreen 新增第三個 tab「線上對戰」
- [x] 4.2 選擇線上對戰時呼叫 `onOnline()` 回呼（不顯示名稱/難度輸入）

## 5. App Integration

- [x] 5.1 新增 screen 狀態 `'lobby'`，選線上對戰時導向 OnlineLobby
- [x] 5.2 連線成功後切換到 GameScreen，設定 players（host=X, guest=O）
- [x] 5.3 線上模式下 handleCellClick 只允許本地玩家的回合點擊，並透過 sendData 發送 move
- [x] 5.4 接收對方 move 時呼叫 placeMove 更新棋盤
- [x] 5.5 對手斷線時顯示提示並提供返回按鈕

## 6. Online Play Again

- [x] 6.1 線上模式下「再來一局」發送 restart 訊息，顯示「等待對手同意...」
- [x] 6.2 收到 restart 訊息時自動同意（發送 restart_ack），雙方重置棋盤

## 7. Verification

- [x] 7.1 驗證建立房間產生代碼並等待
- [x] 7.2 驗證加入房間後雙方進入遊戲
- [x] 7.3 驗證棋步即時同步
- [x] 7.4 驗證斷線後顯示提示
- [x] 7.5 驗證 PvP 和 PvE 模式不受影響
