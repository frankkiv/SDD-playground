## Why

目前井字遊戲只支援雙人對戰，需要兩個人在同一台裝置上輪流操作。加入 AI 對手讓單人也能玩，並透過三個難度等級提供不同程度的挑戰。

## What Changes

- 新增 Minimax 演算法作為 AI 決策引擎，提供完美解
- 新增三個 AI 難度等級：普通（30% 最佳手）、困難（80% 最佳手）、不可能（100% Minimax）
- SetupScreen 加入遊戲模式切換（雙人對戰 / 單人挑戰）
- 單人模式下只需輸入一個玩家名字，並選擇難度
- AI 落子加入延遲（~500ms）模擬思考過程
- 輪到 AI 時，棋盤格子不可點擊

## Capabilities

### New Capabilities
- `ai-opponent`: AI 對手的決策邏輯，包含 Minimax 演算法與難度系統

### Modified Capabilities
- `game-session`: Setup screen 加入模式選擇與難度選擇，遊戲流程加入 AI 自動落子機制

## Impact

- `src/gameLogic.js` — 新增 minimax、getBestMove、getAIMove 函數
- `src/App.jsx` — 新增 gameMode/difficulty state、AI 自動落子 useEffect
- `src/components/SetupScreen.jsx` + `.module.css` — 模式切換與難度選擇 UI
- Board、Cell、GameScreen、Scoreboard、WinAnimation — 不受影響
