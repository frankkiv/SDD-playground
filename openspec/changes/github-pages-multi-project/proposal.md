## Why

SDD-playground repo 將持續累積多個獨立小專案（每天一個新的），需要一個統一的方式將它們全部部署到 GitHub Pages，讓每個專案都有獨立的 URL 路徑可供瀏覽，同時有一個首頁列出所有專案。目前沒有任何部署設定。

## What Changes

- 新增 GitHub Actions workflow，自動偵測 repo 中所有含 `package.json` 的子目錄，逐一執行 `npm install && npm run build`，將產出合併部署到 GitHub Pages
- 新增根目錄 `index.html` 作為專案列表首頁
- 修改現有專案（如 `tic-tac-toe/`）的 `vite.config.js`，設定正確的 `base` 路徑
- URL 結構：`frankkiv.github.io/SDD-playground/<project-name>/`

## Capabilities

### New Capabilities
- `auto-deploy-workflow`: GitHub Actions workflow 自動偵測並 build 所有子專案，部署到 GitHub Pages
- `landing-page`: 根目錄首頁，列出所有可用專案的連結

### Modified Capabilities

（無既有 spec 需要修改）

## Impact

- 新增 `.github/workflows/deploy.yml`
- 新增根目錄 `index.html`
- 修改 `tic-tac-toe/vite.config.js`（加 `base` 設定）
- 未來新增的子專案只要有 `package.json` 和 `build` script 即可自動納入部署
