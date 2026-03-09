# SDD Playground

Spec-Driven Development 實驗場。使用 AI 輔助工具鏈，從規格設計到實作部署，每個專案都遵循結構化的開發流程。

**Live Demo:** https://frankkiv.github.io/SDD-playground/

## Tools

| Tool | 用途 |
|------|------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | AI 編程助手，負責程式碼生成、除錯、重構 |
| [OpenSpec](https://github.com/openspec-dev/openspec) | Spec-Driven Development CLI，管理 proposal → design → specs → tasks 的開發流程 |
| [Vite](https://vite.dev/) | 前端建置工具，快速 HMR 開發體驗 |
| [React](https://react.dev/) | UI 框架 |
| [GitHub Actions](https://github.com/features/actions) | CI/CD，自動偵測子專案並部署到 GitHub Pages |

## 開發流程

每個功能透過 OpenSpec 的 spec-driven schema 進行，由 Claude Code 協助執行：

```
/opsx:propose  →  proposal.md + design.md + specs/ + tasks.md  （定義要做什麼）
/opsx:apply    →  按 tasks 逐步實作                              （Claude Code 執行）
/opsx:archive  →  歸檔 change，sync delta specs 到主規格庫       （完成收尾）
```

每個 change 的 delta specs 採用 `ADDED / MODIFIED / REMOVED` 標記描述與現有規格的差異，archive 時自動合併回 `openspec/specs/` 主規格庫，確保規格始終反映最新實作狀態。

## Projects

| Project | Description |
|---------|-------------|
| [tic-tac-toe](./tic-tac-toe/) | 雙人井字遊戲，React + CSS Modules，含勝利動畫、計分板、AI 對戰（Minimax）、線上 P2P 對戰 |
| [gomoku](./gomoku/) | 五子棋，19x19 SVG 棋盤，含懸停預覽、勝利高亮、AI 對戰（啟發式評分） |
| [whiteboard](./whiteboard/) | 電子白板，多工具繪圖、圖層管理、無限畫布、Undo/Redo、P2P 即時協作 |

## 開發歷程

以下記錄透過 OpenSpec + Claude Code 協作完成的所有 changes，依時間順序排列：

| Change | 日期 | 內容摘要 |
|--------|------|---------|
| `github-pages-multi-project` | 2026-03-07 | 建立 GitHub Actions 自動偵測多子專案並部署到 GitHub Pages 的 CI/CD 流程 |
| `tic-tac-toe-web-game` | 2026-03-07 | 從零建立井字遊戲：SetupScreen、棋盤、計分板、勝利動畫、交替先手 |
| `tic-tac-toe-ai-opponent` | 2026-03-09 | 新增 AI 對手：Minimax 演算法、三段難度（普通/困難/不可能）、思考延遲與指示器 |
| `gomoku-game` | 2026-03-09 | 從零建立五子棋：SVG 19x19 棋盤、交叉點落子、懸停預覽、勝利高亮、計分板 |
| `gomoku-ai-opponent` | 2026-03-09 | 五子棋 AI：啟發式位置評分、攻守兼顧、三段難度噪音控制 |
| `tic-tac-toe-online-pvp` | 2026-03-09 | 井字遊戲線上對戰：PeerJS P2P 連線、房間代碼、棋步同步、斷線偵測 |
| `collaborative-whiteboard` | 2026-03-09 | 電子白板：畫筆/螢光筆/橡皮擦/形狀/箭頭/文字工具、圖層、無限畫布、Undo/Redo、P2P 即時協作 |

## Repo 結構

```
.
├── index.html                     # Landing page（GitHub Pages 首頁）
├── tic-tac-toe/                   # 子專案：井字遊戲
├── gomoku/                        # 子專案：五子棋
├── whiteboard/                    # 子專案：電子白板
├── openspec/
│   ├── config.yaml                # OpenSpec 設定
│   ├── specs/                     # 主規格庫（所有 capabilities 的最新規格）
│   └── changes/
│       └── archive/               # 已完成的 changes（含完整開發脈絡）
└── .github/workflows/
    └── deploy.yml                 # 自動部署 workflow
```

## 部署

Push 到 `main` 會自動觸發 GitHub Actions：
1. 掃描所有含 `package.json` + `build` script 的子目錄
2. 逐一 `npm ci && npm run build`
3. 自動產生首頁專案連結
4. 部署到 GitHub Pages

新增專案只需建立子目錄並確保有 `build` script，零設定自動納入部署。
