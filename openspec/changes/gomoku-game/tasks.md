## 1. Project Scaffold

- [x] 1.1 初始化 Vite + React 專案 (`npm create vite@latest gomoku -- --template react`)
- [x] 1.2 移除 boilerplate（App.css 內容、logo、counter）
- [x] 1.3 設定 `vite.config.js` 加入 `base: '/SDD-playground/gomoku/'`
- [x] 1.4 設定全域樣式 `index.css`（深色主題、CSS 變數、字體，與 tic-tac-toe 一致）
- [x] 1.5 驗證 dev server 正常啟動

## 2. Game Logic

- [x] 2.1 定義常數：`BOARD_SIZE = 19`、`WIN_COUNT = 5`、方向向量陣列
- [x] 2.2 實作 `checkWinner(board, lastRow, lastCol)` — 從最後落子位置四方向掃描，回傳 `{ color, stones }` 或 null
- [x] 2.3 實作 `checkDraw(board)` — 所有 361 格都有棋子且無勝者
- [x] 2.4 實作 `getFirstColor(roundNumber)` — 偶數局黑先、奇數局白先
- [x] 2.5 實作 `getNearestIntersection(x, y, cellSize)` — 從點擊座標計算最近交叉點 (row, col)

## 3. App State

- [x] 3.1 定義 App 狀態：`screen`、`players`（name + color）、`scores`、`roundNumber`
- [x] 3.2 定義 game 狀態：`board`（361 元素陣列）、`currentColor`、`winner`、`winStones`、`isDraw`、`lastMove`
- [x] 3.3 實作 `handleIntersectionClick(row, col)` — 落子、檢查勝負、切換回合
- [x] 3.4 實作 `handlePlayAgain()` — 重置棋盤、遞增 roundNumber、保留分數
- [x] 3.5 實作 `handleRestart()` — 重置所有狀態、回到設定畫面

## 4. SetupScreen

- [x] 4.1 建立 `SetupScreen` 元件，兩個名稱輸入框（預設「黑方」「白方」）
- [x] 4.2 建立 `SetupScreen.module.css`（沿用 tic-tac-toe 風格）

## 5. GomokuBoard

- [x] 5.1 建立 `GomokuBoard` 元件，SVG 渲染 19x19 格線（18 條橫線 + 18 條直線）
- [x] 5.2 繪製星位點（天元 + 四個角星 + 四個邊星，共 9 個小圓點）
- [x] 5.3 渲染已落子的棋子（黑 `#333` 帶邊框、白 `#eee` 帶邊框）
- [x] 5.4 實作點擊事件：計算最近交叉點並呼叫 `onPlace(row, col)`
- [x] 5.5 實作懸停預覽：半透明棋子顯示在最近的空交叉點
- [x] 5.6 勝利時：贏的棋子加 glow 效果，其餘棋子 dimmed
- [x] 5.7 使用 viewBox + CSS 讓棋盤自適應螢幕大小
- [x] 5.8 建立 `GomokuBoard.module.css`

## 6. Scoreboard & TurnIndicator

- [x] 6.1 建立 `Scoreboard` 元件 + CSS（黑方/白方分數 + 平局，沿用 tic-tac-toe 風格）
- [x] 6.2 建立 `TurnIndicator` 元件 + CSS（顯示當前玩家名稱 + 棋子顏色指示）

## 7. GameResult

- [x] 7.1 建立 `GameResult` overlay 元件 + CSS（勝利/平局訊息、下局先手、再來一局/重新開始按鈕）

## 8. GameScreen Integration

- [x] 8.1 建立 `GameScreen` 元件，組合 Scoreboard + TurnIndicator + GomokuBoard + GameResult
- [x] 8.2 在 `App` 中串接 SetupScreen ↔ GameScreen 切換

## 9. Polish & Verification

- [ ] 9.1 驗證四方向勝利偵測正確（水平、垂直、兩條對角線）
- [ ] 9.2 驗證超過五子（6+）仍判定為勝利
- [ ] 9.3 驗證交替先手在多局間正確運作
- [ ] 9.4 驗證計分與重置流程
- [x] 9.5 Build 成功且部署到 GitHub Pages 正常
