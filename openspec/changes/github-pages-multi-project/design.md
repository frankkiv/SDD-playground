## Context

SDD-playground 是一個 monorepo，內含多個獨立的 Vite + React 小專案（目前有 `tic-tac-toe/`）。目前沒有任何部署機制。需要設定 GitHub Pages 讓所有子專案都能透過瀏覽器存取，並且新增專案時不需要修改部署設定。

## Goals / Non-Goals

**Goals:**
- 一個 GitHub Actions workflow 自動偵測並 build 所有子專案
- 每個專案部署到獨立的 URL 路徑 (`/<repo>/<project>/`)
- 根目錄提供首頁列出所有專案連結
- 新增專案時零設定——只要有 `package.json` + `build` script 即可

**Non-Goals:**
- 不做 custom domain 設定
- 不做 incremental build（每次全部重建即可，專案數量少）
- 不做 SSR 或 server-side 功能

## Decisions

### GitHub Actions + `actions/deploy-pages` 部署到 GitHub Pages
使用官方的 GitHub Pages Actions（`actions/configure-pages`、`actions/upload-pages-artifact`、`actions/deploy-pages`），部署來源設為 GitHub Actions（非 branch-based）。
替代方案：`gh-pages` npm 套件推到 `gh-pages` branch——多一個依賴且需要 token 權限設定，官方 Actions 更簡潔。

### Shell script loop 偵測子專案
Workflow 中用 shell 迴圈掃描根目錄下含 `package.json` 的資料夾，逐一執行 `npm ci && npm run build`，將各自的 `dist/` 複製到統一的輸出目錄 `_site/<project>/`。
替代方案：matrix strategy 平行 build——對小專案來說增加複雜度但無明顯收益，且合併產出較麻煩。

### 每個 Vite 專案設定 `base` 路徑
各專案的 `vite.config.js` 需設定 `base: '/SDD-playground/<project>/'`，確保 asset 路徑在 GitHub Pages 子路徑下正確。

### 靜態 `index.html` 作為首頁
根目錄放一個簡單的靜態 HTML 首頁。workflow build 時自動掃描已建置的專案目錄來產生連結列表，嵌入到首頁模板中。
替代方案：手動維護連結列表——容易忘記更新，自動偵測更可靠。

## Risks / Trade-offs

- **Build 時間隨專案數量增長** → 目前專案規模小（每個 build < 5 秒），短期內不成問題。若日後成為瓶頸可改用 matrix 平行 build。
- **所有專案共用一個部署** → 某個專案 build 失敗會阻擋整個部署。可在 workflow 中用 `|| true` 跳過失敗的專案，但初期先嚴格處理，確保每個專案都能正確 build。
- **`base` 路徑硬編碼 repo 名稱** → 如果 repo 改名需更新所有 `vite.config.js`。可接受的 trade-off。
