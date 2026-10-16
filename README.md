# UDCP 文件去識別化工具（個資＋商業機敏）

[![CI & Deploy](https://github.com/Endwar116/data-deidentification-udcp/actions/workflows/deploy.yml/badge.svg)](https://github.com/Endwar116/data-deidentification-udcp/actions)

**在瀏覽器裡完成、資料不出電腦的文件去識別化工具——涵蓋個資與商業機敏。**
上傳 PDF / Word / Excel / TXT / Markdown 或貼上文字，自動偵測 **12 類敏感資料**，統一代碼化為 `[類別:編碼]`，產出 CSV 編碼表，日後可憑表完整還原。

> 本專案基於 Dean Lin 的開源專案 [data-deidentification](https://github.com/dean9703111/data-deidentification)（MIT 授權）擴充而成，依 **UDCP 機敏資料類型表**補上商業機敏偵測。基底與本專案的分工、完整致謝見文末〈[致謝與授權](#致謝與授權)〉。

🔗 線上使用：<https://endwar116.github.io/data-deidentification-udcp/>

---

## 本專案做了什麼（與基底的差異）

基底專案內建**個資八類**偵測（姓名、身分證、手機、市話、地址、電子郵件、公司、統一編號）。
本專案依 UDCP 機敏資料類型表，將**商業機敏四類**升為內建規則，開箱即偵測：

| 新增類別 | 偵測方法 | 命中範例 | 防誤抓設計 |
|---|---|---|---|
| 金額 | 格式比對 | NT$1,500,000、新台幣150萬元、3,000元 | 必須帶貨幣標記才命中，一般數字不誤抓 |
| 專案代號 | 格式比對 | PROJ-2026-001、CASE-0042 | 前後不得緊鄰英數字；前綴依公司命名規則調整 |
| 員工編號 | 格式比對 | EMP-123456、EMP00421 | 位數下限 4 位 |
| 客戶名單 | **名單比對** | 依實際名單維護 | 精確比對零誤抓；名單在「偵測規則」頁籤自行更換 |

改動集中於 `src/core/patterns.ts`（規則）與對應測試；其餘能力（檔案格式解析、遮罩預覽、人工覆核、還原、輸出零殘留）沿用基底。

## 偵測邏輯（三種方法，全部為確定性規則）

1. **格式比對**：照固定格式全文掃描（手機、地址、金額、代號…）
2. **檢核碼驗算**：身分證與統編實際驗算檢核碼，亂湊號碼不命中
3. **名單比對**：客戶名稱等無固定格式的資料，依名單精確比對

全程**零模型推論**：同一份文件跑一百次，結果一模一樣。規則式偵測對中文姓名、地址無法保證零漏抓，**下載前的人工覆核為必經步驟**（點標記取消誤抓、圈選補漏抓）。

## 使用方式（三步）

1. 開啟網頁 → 拖入檔案或貼上文字 → 開始去識別化
2. 預覽畫面逐筆人工確認（客戶名單在「偵測規則」頁籤維護）
3. 下載「去識別化文件」＋「編碼表 CSV」

**編碼表＝還原的唯一鑰匙**：文件可外送，編碼表留內部——指定保管人、限縮存取、與脫敏檔分開存放。

## 隱私與安全

- 所有處理在瀏覽器內完成，文件與編碼表**不經網路上傳**；載入後斷網仍可使用（可當場驗證）
- 編碼為密碼學亂數產生之 6 位十六進位，與原文無數學關聯
- 輸出檔案內不殘留原始敏感文字（含 Excel 共用字串、PDF 底層文字），有回歸測試把關

## 開發與測試

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # 336 項測試（基底 227 ＋ 本專案新增）
npm run build   # 產出 dist/（純靜態站）
```

每次 push 自動執行全部測試，通過後部署 GitHub Pages——測試紀錄公開可查：[Actions](https://github.com/Endwar116/data-deidentification-udcp/actions)。

## 相關文件

- 《偵測規則邏輯表》（Excel）：12 類規則逐條——正規表達式原文、命中範例、防誤抓設計、名單維護步驟
- 《製作方法與邏輯》簡報：本工具如何製作、方法與邏輯說明

## 致謝與授權

- **基底專案**：[dean9703111/data-deidentification](https://github.com/dean9703111/data-deidentification) by [Dean Lin](https://github.com/dean9703111)，MIT License——文件解析、個資八類偵測規則、預覽／還原介面、輸出零殘留設計與原 227 項測試均來自該專案，特此致謝。
- **本專案改動**：商業機敏四類內建規則＋12 項測試（詳見 [commit 紀錄](https://github.com/Endwar116/data-deidentification-udcp/commits/main) 與 FORK_NOTES）。
- **授權**：MIT License（原專案版權聲明完整保留於 [LICENSE](LICENSE)）。
- 字型 Noto Sans TC © Google，SIL Open Font License 1.1。
