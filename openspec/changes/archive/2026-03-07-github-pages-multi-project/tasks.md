## 1. Vite Base Path 設定

- [x] 1.1 修改 `tic-tac-toe/vite.config.js`，加入 `base: '/SDD-playground/tic-tac-toe/'`
- [x] 1.2 執行 `npm run build` 驗證產出的 asset 路徑正確

## 2. Landing Page

- [x] 2.1 建立根目錄 `index.html` 模板（深色主題、標題、專案卡片區塊，留 `<!-- PROJECTS -->` 佔位符供 workflow 替換）
- [x] 2.2 本地開啟驗證樣式正常顯示

## 3. GitHub Actions Workflow

- [x] 3.1 建立 `.github/workflows/deploy.yml`，設定 trigger 為 push to `main`
- [x] 3.2 加入 Pages 權限設定（`permissions: pages, id-token`）和 `environment: github-pages`
- [x] 3.3 實作 shell loop：掃描含 `package.json` 且有 `build` script 的子目錄，逐一 `npm ci && npm run build`，複製 `dist/` 到 `_site/<project>/`
- [x] 3.4 在 build loop 後自動產生專案連結列表，替換 `index.html` 中的佔位符，輸出到 `_site/index.html`
- [x] 3.5 使用 `actions/upload-pages-artifact` 和 `actions/deploy-pages` 完成部署

## 4. GitHub Repo 設定

- [x] 4.1 到 GitHub repo Settings 啟用 Pages，source 選 GitHub Actions
- [x] 4.2 Push 變更到 `main`，觸發 workflow
- [x] 4.3 驗證 `frankkiv.github.io/SDD-playground/` 顯示首頁
- [x] 4.4 驗證 `frankkiv.github.io/SDD-playground/tic-tac-toe/` 可正常遊玩
