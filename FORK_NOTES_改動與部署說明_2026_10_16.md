# UDCP 去識別化工具（Fork 版）— 改動與部署說明
**File_2026_10_16** ｜ 基於 dean9703111/data-deidentification（MIT 授權）

## 這個 Fork 做了什麼
原工具內建九類個資偵測（姓名／身分證／手機／市話／地址／email／公司／統編／識別碼）。
本 Fork 依 UDCP 機敏資料類型表，將**商業機敏四類**升為內建規則，開箱即偵測、統一代碼化、可憑編碼表還原：

| 新增規則 | 命中範例 | 方式 |
|---|---|---|
| 金額 | NT$1,500,000、新台幣150萬元、3,000元 | 格式比對（需帶貨幣標記，避免誤抓一般數字） |
| 專案代號 | PROJ-2026-001、CASE-0042 | 格式比對（前綴可依公司命名規則調整） |
| 員工編號 | EMP-123456、EMP00421 | 格式比對 |
| 客戶名單 | 範例客戶甲（請替換） | **名單式**：客戶名稱沒有固定格式，採列舉比對 |

**換客戶名單的方式**：開啟工具 →「偵測規則」頁籤 → 找到「客戶名單」規則 → 把 `範例客戶甲|範例客戶乙|範例客戶丙` 換成實際名稱（用 | 分隔）→ 儲存，全文自動套用。

## 改動的檔案（共 2 個）
- `src/core/patterns.ts`：新增四條內建規則（檔尾，含註解）
- `tests/integration/roundtrip-text.test.ts`：員編改為內建後調整一條斷言（含 Fork note 註解）
- 新增測試 12 個（`tests/unit/patterns.test.ts` 檔尾）

**測試：336／336 全數通過**（原 227 測試擴充後的全套件）。

## 部署（擇一，皆為免費）
頁面以 ES module 載入，**直接點開 index.html 無法啟動**，需經 HTTP 提供：
1. **Netlify Drop（最快，約 1 分鐘）**：開 app.netlify.com/drop → 把 `dist/` 資料夾整個拖進去 → 取得網址
2. **GitHub Pages**：push 本 repo 到自己的 GitHub → Settings → Pages → 以 Actions 部署（repo 內已含 `.github/workflows/deploy.yml`，push 即自動測試＋建置＋部署）
3. **內網**：`dist/` 丟任何靜態檔案伺服器（Nginx／IIS／檔案伺服器皆可）

## 授權
原專案 MIT 授權，LICENSE 保留於 repo；本 Fork 之改動同以 MIT 釋出。
