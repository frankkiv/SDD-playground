## Context

SDD-playground 是一個多專案 monorepo，已有一個 tic-tac-toe 子專案。新增 gomoku/ 作為第二個獨立子專案，沿用相同技術棧（Vite + React + CSS Modules）和設計風格。GitHub Actions workflow 已具備自動偵測子專案並部署到 GitHub Pages 的能力。

## Goals / Non-Goals

**Goals:**
- 19x19 標準五子棋棋盤，SVG 格線渲染
- 自由規則雙人對戰（無禁手）
- 流暢的棋盤互動（縮放適配、懸停預覽）
- 風格與 tic-tac-toe 一致的深色主題
- 沿用 tic-tac-toe 的元件架構模式（SetupScreen → GameScreen）

**Non-Goals:**
- AI 對手（本次不做）
- 線上多人對戰
- 悔棋功能
- Renju 禁手規則
- 棋譜記錄或回放

## Decisions

### SVG 繪製棋盤格線 + 棋子
19x19 格線用 SVG `<line>` 繪製，棋子用 SVG `<circle>` 定位在交叉點上。整個棋盤是一個 SVG 元素，點擊事件透過計算最近交叉點來處理。
替代方案：CSS Grid（361 個 div 元素，DOM 量大且格線繪製不直觀）、Canvas（失去 React 聲明式渲染的優勢，事件處理更複雜）。

### 棋盤資料結構：19x19 一維陣列
用 `Array(361).fill(null)` 表示棋盤，index = row * 19 + col。`null` 為空、`'B'` 為黑、`'W'` 為白。一維陣列操作比二維更簡潔，勝利偵測用方向向量掃描。
替代方案：二維陣列——語義稍好但展開和複製操作更繁瑣。

### 勝利偵測：方向向量掃描
每次落子後，從落子位置出發，沿四個方向（水平、垂直、兩條對角線）雙向掃描同色棋子。若某方向連續 ≥ 5 顆，即為勝利。只需檢查最後落子的位置周圍，不需要掃描整盤。
```
方向向量：
  水平:    (0, 1)
  垂直:    (1, 0)
  對角線↘: (1, 1)
  對角線↙: (1, -1)
```

### 棋盤尺寸自適應
棋盤 SVG 使用 viewBox 定義邏輯座標，實際大小透過 CSS 控制（`width: min(90vw, 90vh)`）。不需要捲動——整個棋盤縮放到可視範圍內。
替代方案：固定像素大小 + 捲動——體驗差，尤其在小螢幕上。

### 沿用 tic-tac-toe 元件架構
```
App
├── SetupScreen（玩家名稱輸入）
└── GameScreen
    ├── Scoreboard
    ├── TurnIndicator
    ├── GomokuBoard（SVG 棋盤 + 棋子）
    └── GameResult（勝利/平局 overlay）
```

### 棋子顏色：黑棋 #222 + 白棋 #eee
在深色背景上，黑棋用深灰（帶微妙邊框）、白棋用亮白。避免純黑在深色背景上不可見的問題。

## Risks / Trade-offs

- **19x19 SVG 效能** → 現代瀏覽器渲染幾百個 SVG 元素毫無壓力。如有疑慮可用 `will-change: transform` 或 `contain: layout` 優化。
- **手機上棋盤太小** → viewBox 自適應可以緩解，但 19x19 在小手機上確實緊湊。Non-goal 中已標明不優先處理行動裝置。
- **平局機率極低** → 19x19 有 361 格，實際上幾乎不會下滿。仍需實作平局判定以防萬一。
