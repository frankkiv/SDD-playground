## 1. AI 演算法

- [x] 1.1 在 `gameLogic.js` 實作 `minimax(board, mark, isMaximizing, aiMark)` 函數，回傳最佳分數
- [x] 1.2 實作 `getBestMove(board, aiMark)` 函數，回傳 Minimax 最佳手的格子 index
- [x] 1.3 實作 `getAIMove(board, aiMark, difficulty)` 函數，依難度決定走最佳手或隨機空格

## 2. App 狀態擴充

- [x] 2.1 在 `App.jsx` 新增 `gameMode` ('pvp' | 'pve') 和 `difficulty` ('normal' | 'hard' | 'impossible') state
- [x] 2.2 修改 `handleStart` 接收 mode 和 difficulty 參數，PvE 模式下 Player 2 固定為 `{ name: '電腦', mark: 'O' }`
- [x] 2.3 新增 `isAIThinking` state，AI 思考期間設為 true
- [x] 2.4 新增 useEffect 監聯：當 `gameMode === 'pve'` 且 `currentMark === aiMark` 且遊戲未結束，setTimeout ~500ms 後呼叫 `handleCellClick(getAIMove(...))`
- [x] 2.5 處理 StrictMode 雙重觸發：useEffect 中用 cleanup 取消 setTimeout

## 3. SetupScreen UI 改造

- [x] 3.1 新增模式切換 UI（雙人對戰 / 單人挑戰 tab 或按鈕）
- [x] 3.2 單人模式：顯示一個名字輸入框 + 三個難度按鈕（普通、困難、不可能）
- [x] 3.3 雙人模式：維持現有兩個名字輸入框
- [x] 3.4 修改 `onStart` callback 傳遞 mode 和 difficulty
- [x] 3.5 更新 SetupScreen.module.css 適配新的 UI 元素

## 4. TurnIndicator 調整

- [x] 4.1 當 `isAIThinking` 為 true 時，TurnIndicator 顯示「電腦思考中...」

## 5. 測試與驗證

- [ ] 5.1 驗證三個難度的 AI 行為正確（普通偶爾犯錯、困難較強、不可能無法被打敗）
- [ ] 5.2 驗證 AI 先手（奇數局）時自動落子正常
- [ ] 5.3 驗證雙人模式不受影響
- [x] 5.4 Build 成功且部署到 GitHub Pages 正常
