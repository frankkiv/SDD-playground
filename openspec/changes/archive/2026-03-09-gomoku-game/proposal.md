## Why

SDD Playground 目前只有一個井字遊戲，新增五子棋作為第二個專案，展示更複雜的棋盤遊戲實作。19x19 棋盤帶來不同的 UI 挑戰（大棋盤渲染、格線繪製、棋子定位），也能驗證多專案自動部署 workflow 的可擴充性。

## What Changes

- 新增獨立的 `gomoku/` 子專案（Vite + React），與 tic-tac-toe 平行
- 19x19 棋盤，使用 SVG 繪製格線，棋子以圓形呈現
- 自由規則：黑白交替落子，先連成五子（水平/垂直/對角線）即勝，無禁手
- 勝利時高亮五子連線
- 雙人對戰模式：玩家名稱輸入、計分板、回合指示、再來一局/重新開始
- 棋盤可縮放以適應不同螢幕尺寸
- 深色主題風格，與 tic-tac-toe 一致
- Vite base path 設為 `/SDD-playground/gomoku/`

## Capabilities

### New Capabilities
- `gomoku-board`: 19x19 棋盤渲染、格線繪製、棋子落子與顯示、棋盤縮放
- `gomoku-rules`: 五子連線勝利偵測（四方向）、平局判定、勝利高亮
- `gomoku-session`: 玩家設定、回合管理、計分、再來一局/重新開始流程

### Modified Capabilities

（無既有 spec 需要修改——這是全新的獨立子專案）

## Impact

- 新增 `gomoku/` 目錄：完整的 Vite + React 專案
- 既有的 GitHub Actions workflow 會自動偵測並部署新專案
- Landing page 會自動新增 gomoku 連結
- 不影響 tic-tac-toe 或其他既有程式碼
