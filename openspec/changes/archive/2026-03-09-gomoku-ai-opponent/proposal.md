## Why

五子棋目前只支援雙人對戰，單人無法練習。加入啟發式評分 AI 讓單人也能玩，並透過三個難度提供不同程度的挑戰。19x19 棋盤上 Minimax 窮舉不可行，啟發式評分是最適合瀏覽器端的方案。

## What Changes

- 新增啟發式棋型評分引擎：掃描每個空位的四方向，辨識棋型（連五、活四、衝四、活三、活二等），計算攻擊分 + 防守分
- 新增三個 AI 難度：普通（評分加大量隨機噪音）、困難（少量噪音）、不可能（純最高分）
- SetupScreen 加入模式切換（雙人對戰 / 單人挑戰）+ 難度選擇
- AI 落子加 ~500ms 延遲模擬思考
- AI 思考時顯示「電腦思考中...」指示
- AI 固定為白方 (W)

## Capabilities

### New Capabilities
- `gomoku-ai`: 啟發式評分 AI 引擎，包含棋型辨識、位置評分、難度系統

### Modified Capabilities
- `gomoku-session`: SetupScreen 加入模式切換與難度選擇，遊戲流程加入 AI 自動落子機制

## Impact

- `gomoku/src/gameLogic.js` — 新增棋型評分函數、getAIMove
- `gomoku/src/App.jsx` — 新增 gameMode/difficulty state、AI useEffect
- `gomoku/src/components/SetupScreen.jsx` + CSS — 模式切換 + 難度 UI
- `gomoku/src/components/TurnIndicator.jsx` — 加思考中提示
- 其他元件（GomokuBoard、Scoreboard、GameResult）不受影響
