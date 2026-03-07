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

每個專案透過 OpenSpec 的 spec-driven schema 進行：

```
/opsx:propose  →  proposal.md + design.md + specs/ + tasks.md
/opsx:apply    →  按 tasks 逐步實作
/opsx:archive  →  歸檔 change，sync specs 到主規格庫
```

## Projects

| Project | Description |
|---------|-------------|
| [tic-tac-toe](./tic-tac-toe/) | 雙人井字遊戲，React + CSS Modules，含勝利動畫與計分板 |

## Repo 結構

```
.
├── index.html                     # Landing page（GitHub Pages 首頁）
├── tic-tac-toe/                   # 子專案：井字遊戲
├── openspec/
│   ├── config.yaml                # OpenSpec 設定
│   ├── specs/                     # 主規格庫（archived specs）
│   └── changes/
│       └── archive/               # 已完成的 changes
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
