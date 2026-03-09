## 1. AI Engine — Heuristic Scoring

- [x] 1.1 在 `gameLogic.js` 新增棋型評分常數表（連五 100000、活四 10000、衝四 5000、活三 1000、眠三 100、活二 100、眠二 10）
- [x] 1.2 實作 `evaluatePosition(board, row, col, color)` — 對指定空位，假設落子後沿四方向掃描，辨識棋型並回傳該位置的攻擊分
- [x] 1.3 實作防守分計算 — 同樣的 `evaluatePosition` 用對手顏色計算，取攻擊分與防守分的較高值作為該位置最終分數
- [x] 1.4 實作 `getAIMove(board, aiColor, difficulty)` — 遍歷所有空位計算分數，根據難度加噪音，回傳最高分位置 `{ row, col }`
- [x] 1.5 空棋盤特判 — 當棋盤全空時直接回傳天元 (9, 9)

## 2. Difficulty System

- [x] 2.1 實作三個難度的噪音控制：普通 ±5000、困難 ±500、不可能不加噪音
- [x] 2.2 Export `getAIMove` 供 App.jsx 呼叫

## 3. SetupScreen Mode Toggle

- [x] 3.1 在 SetupScreen 加入模式切換 tab（雙人對戰 / 單人挑戰），沿用 tic-tac-toe 的 UI 模式
- [x] 3.2 PvE 模式下只顯示一個名稱輸入框，預設「黑方」；AI 名稱固定為「電腦」
- [x] 3.3 PvE 模式下顯示三個難度按鈕（普通、困難、不可能）
- [x] 3.4 更新 SetupScreen.module.css 加入模式切換與難度按鈕樣式
- [x] 3.5 更新 `onStart` callback 傳遞 `gameMode` 和 `difficulty` 參數

## 4. App State & AI Auto-Move

- [x] 4.1 在 App.jsx 新增 `gameMode`、`difficulty`、`isAIThinking` state
- [x] 4.2 更新 `handleStart` 接收 gameMode 和 difficulty，PvE 模式下設 player2 為「電腦」
- [x] 4.3 實作 AI 自動落子 useEffect — 監聽 currentColor 變化，輪到 AI (W) 時 setTimeout ~500ms 後呼叫 getAIMove 並落子，cleanup 防止 StrictMode 雙重觸發
- [x] 4.4 AI 思考中鎖定棋盤 — `handleIntersectionClick` 在 `isAIThinking` 為 true 時 return

## 5. AI Thinking Indicator

- [x] 5.1 更新 TurnIndicator — 當 `isAIThinking` 為 true 時顯示「電腦思考中...」

## 6. Verification

- [x] 6.1 驗證 PvP 模式不受影響（雙人對戰行為與之前一致）
- [x] 6.2 驗證 AI 在各難度下能正常落子
- [x] 6.3 驗證 AI 思考中棋盤不可點擊
- [x] 6.4 驗證交替先手在 PvE 模式下正確運作（奇數局 AI 先手時自動落子）
