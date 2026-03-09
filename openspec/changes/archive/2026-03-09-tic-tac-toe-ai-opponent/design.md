## Context

現有井字遊戲為純雙人模式，所有遊戲邏輯在 `gameLogic.js`（純函數），狀態管理在 `App.jsx`（useState + prop drilling），UI 元件（Board、Cell、GameScreen 等）只負責顯示。此分層讓 AI 邏輯可以集中在邏輯層，不影響顯示層。

## Goals / Non-Goals

**Goals:**
- 加入單人模式，AI 作為對手
- Minimax 完美解演算法，一套演算法驅動三個難度
- AI 落子帶延遲，營造自然的遊戲體驗
- SetupScreen 支援模式與難度選擇

**Non-Goals:**
- 不做線上多人
- 不做 AI 學習或進化（固定策略）
- 不做 AI 先手選擇（AI 固定為 O，人類固定為 X）

## Decisions

### Minimax 無需優化
井字遊戲最多 9! 種局面，Minimax 在現代瀏覽器上執行時間 < 1ms。不需要 alpha-beta pruning 或快取。
替代方案：alpha-beta pruning — 增加程式碼複雜度但無效能收益。

### 難度透過隨機比例控制
三個難度共用同一個 Minimax 函數，差別在於選擇最佳手的機率：
- 普通：30% 最佳手，70% 隨機選空格
- 困難：80% 最佳手，20% 隨機
- 不可能：100% 最佳手

替代方案：限制 Minimax 搜尋深度 — 在井字遊戲中深度差異不大，隨機比例更直觀且效果更好。

### AI 落子透過 useEffect + setTimeout 觸發
在 `App.jsx` 加一個 useEffect，監聽 `game.currentMark` 變化。當輪到 AI 且遊戲未結束時，setTimeout ~500ms 後自動落子。落子期間棋盤透過既有的 disabled 機制阻止人類操作。
替代方案：Web Worker — 過度設計，Minimax 運算不到 1ms。

### AI 固定為 Player 2 (O)
簡化設計，人類永遠是 X 先手。交替先手規則同樣適用（偶數局人類先手，奇數局 AI 先手）。
替代方案：讓玩家選 X 或 O — 增加 UI 複雜度，收益不大。

## Risks / Trade-offs

- **AI 瞬間落子感覺不自然** → 加 500ms 延遲模擬思考。延遲期間顯示「電腦思考中...」。
- **React StrictMode 導致 useEffect 雙重觸發** → 用 ref 或 cleanup 確保 AI 只落子一次。
- **「不可能」模式永遠無法被打敗** → 這是特色不是 bug，但需在 UI 上讓玩家知道。
