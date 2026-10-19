# 🚀 50 Startups 特徵選取演算法綜合分析平台
### Feature Selection & Startup Profitability Analysis Platform

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://dave1588.github.io/50-startups-platform/)
[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue?logo=python)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.2%2B-orange?logo=scikitlearn)](https://scikit-learn.org/)
[![Statsmodels](https://img.shields.io/badge/statsmodels-0.14%2B-yellow)](https://www.statsmodels.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-v4.4-red?logo=chartdotjs)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **線上體驗網址**：👉 [https://dave1588.github.io/50-startups-platform/](https://dave1588.github.io/50-startups-platform/)

---

## 📖 專案簡介 (Project Overview)

在早期新創企業（Startups）的資源分配決策中，**「資本應該投放在研發、行銷，還是組織行政？」** 是決定生死存亡的核心課題。

本專案基於經典的 **50 Startups 資料集**，遵循資料科學與機器學習 **CRISP-DM 方法論**，運用 **5 大經典特徵選取與降維演算法**，深入剖析各項營運投入對企業最終淨利潤（Profit）的驅動關係。同時結合 **現代化 Web 互動視覺化儀表板** 與 **即時利潤推論模擬器**，提供兼具學術嚴謹性與商業決策實用性的完整解決方案。

---

## 🎯 核心研究發現 (Key Findings)

```
[全變數 5 特徵]  RMSE: $9,137.99  |  R²: 0.9347  ⚠️ 行政費用與地域變數引入過擬合與噪聲
       ⬇ (特徵挑選精簡)
[簡約單特徵]     RMSE: $8,274.87  |  R²: 0.9465  ⚡ 研發支出 (R&D Spend) 單一變數解釋 94.65% 獲利
       ⬇ (前向最佳綜效)
[最佳雙特徵]     RMSE: $8,198.80  |  R²: 0.9474  🏆 研發 + 行銷 (R&D + Marketing)，誤差降低 10.3%！
```

1. **研發支出（R&D Spend）是絕對主導動能**：單一特徵即可解釋超過 94.65% 的利潤變異，回歸係數顯著度遠高於其他項目 ($p < 0.0001$)。
2. **行銷費用（Marketing Spend）具備正向協同綜效**：加入行銷費用後，測試集 RMSE 降至全局最低點 **$8,198.80**，決定係數達到頂峰 **0.9474**。
3. **行政費用（Administration）與地區（State）為無效噪聲**：多重演算法均證實行政管理成本對利潤無顯著相關 ($p = 0.6018$)；盲目納入全特徵會導致模型在測試集上的 RMSE 大幅反彈至 **$9,137.99**（產生過擬合）。

---

## 🔬 5 大特徵選取演算法深度對比 (5 Algorithms Deep-Dive)

本專案實作並橫向評估了涵蓋 **統計檢驗**、**封裝法 (Wrapper)**、**嵌入式正則化 (Embedded)** 與 **貪婪搜尋 (Greedy Search)** 的 5 大演算法：

| 演算法 | 演算法類型 | 入選特徵組合 | 特徵數 | 核心優勢 | 實證診斷結論 |
| :--- | :--- | :--- | :---: | :--- | :--- |
| **1. VIF 方差膨脹因子** | 統計共線性檢驗 | 全部保留（無共線性） | 5 | 精確診斷自變數間線性關聯 | 全部自變數 VIF $< 2.5$，確認資料集體質健康 |
| **2. Backward OLS** | 統計顯著性封裝法 | `[R&D Spend]` | 1 | 統計學嚴謹，具可解釋 p-value | 依序剔除 NY (0.9898)、FL (0.9398)、Admin (0.6018)、Mkt (0.0600) |
| **3. RFECV** | 交叉驗證封裝法 | `[R&D, Marketing]` | 2 | 結合 5-Fold CV，抗過擬合力強 | CV R² 評分曲線在特徵數為 2 時達到最佳峰值 |
| **4. LassoCV (L1)** | 嵌入式稀疏正則化 | `[R&D, Marketing, Admin]` | 3 | 自動係數收縮，抗共線性干擾 | 地區變數係數被強制壓縮至 0，研發係數達 +36,030 |
| **5. Forward Stepwise** | 貪婪逐步搜尋法 | `[R&D, Marketing]` | 2 | 直觀呈現特徵維度與誤差衰減軌跡 | **全局最佳推薦解**：RMSE $8,198.80，R² 0.9474 🏆 |

---

## 📊 前向逐步評估成果數據表 (Stepwise Evaluation Results)

*驗證集條件：`test_size = 0.2`, `random_state = 0`*

| 特徵數量 (k) | 選入特徵組合 (Selected Features) | 測試集 RMSE ($) | 決定係數 (R-squared) | 狀態評價 |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `[R&D Spend]` | 8274.868018 | 0.946459 | ⚡ 最佳簡約單變數模型 |
| **2** | `[R&D Spend, Marketing Spend]` | **8198.797191** | **0.947439** | 🏆 **全局最佳推薦模型 (Sweet Spot)** |
| **3** | `[R&D Spend, Marketing Spend, State_New York]` | 8309.059683 | 0.946015 | 誤差開始回升 |
| **4** | `[R&D Spend, Marketing Spend, State_New York, State_Florida]` | 8409.916714 | 0.944697 | 地理特徵未帶來效益 |
| **5** | `[R&D Spend, Marketing Spend, State_New York, State_Florida, State_California]` | 9137.990153 | 0.934707 | ⚠️ 包含行政支出，顯著過擬合 |

### 📈 雙子圖趨勢圖形（Web / Matplotlib 呈現）
1. **RMSE by Number of Features**：曲線自 8274 下滑至 2 個特徵時的 8198 最低谷底，後續劇烈反彈至 9137。
2. **R-squared by Number of Features**：曲線在 2 個特徵時攀升至 0.9474 頂峰，特徵過多時驟降。

---

## 🖥️ 網頁平台特色 (Web Application Features)

本平台網頁採用現代 **Glassmorphism（毛玻璃暗黑科技風）** 與純原生技術（Vanilla HTML5 / CSS3 / ES6 + Chart.js）打造：

* **無依賴純靜態架構**：零外部建置流程（No Webpack / Vite），秒速加載，與 GitHub Pages 100% 相容。
* **雙圖並排互動視覺化**：整合 Chart.js，支援平滑貝茲曲線、自定義懸浮數據卡與響應式重繪。
* **即時獲利推論模擬器 (Live Profit Simulator)**：
  * 即時滑桿微調：研發支出（$0~$200k）、行銷費用（$0~$500k）、行政成本（$0~$200k）及註冊地區。
  * 3 種模型即時切換比對：**最佳 2 特徵模型** vs **極簡 1 特徵模型** vs **全 5 特徵模型**。
  * 預估企業年淨利動態跳動與當前資本配置比例圓餅圖（Doughnut Chart）。
* **CSV 數據一鍵導出**：支援將 5 階段特徵工程數據表一鍵匯出為標準 CSV。

---

## 📁 專案檔案結構 (Project Structure)

```text
50-startups-platform/
│
├── index.html            # 平台主頁面結構（語意化 HTML5、SEO Meta、分頁與模擬器元件）
├── styles.css            # 現代毛玻璃暗黑科技主題樣式表（CSS Custom Properties, Grid/Flexbox）
├── app.js                # 前端互動邏輯（Chart.js 圖表渲染、Tab 分頁切換、回歸方程式推論計算）
├── main.py               # 後端完整 Python 機器學習腳本（CRISP-DM 完整 6 大階段實作）
├── .gitignore            # 忽略 Python 快取、系統暫存與虛擬環境檔案
└── README.md             # 專案詳細說明文件
```

---

## 🛠️ 本地安裝與執行指南 (Local Setup & Run)

### 1. 執行 Python 機器學習後端分析
本專案依賴 `numpy`, `pandas`, `scikit-learn`, `statsmodels`, `matplotlib`。建議使用 Conda 或標準虛擬環境：

```bash
# 複製儲存庫
git clone https://github.com/Dave1588/50-startups-platform.git
cd 50-startups-platform

# 執行分析腳本
python main.py
```
> 執行後終端將依序印出 Phase 2 至 Phase 6 的統計數據、VIF 表、淘汰歷程、評估表，並跳出 Matplotlib 並排折線圖！

### 2. 本地預覽互動式 Web 儀表板
您可以使用任何簡易 HTTP 伺服器開啟網頁：

```bash
# 使用 Python 內建 HTTP 伺服器
python -m http.server 8080
```
開啟瀏覽器訪問：`http://localhost:8080/index.html`。

---

## 🌐 GitHub Pages 部署方法 (Deployment)

本專案支援 GitHub Pages 免費靜態託管：

1. 將代碼推送至 GitHub：
   ```bash
   git add .
   git commit -m "feat: complete startup platform and docs"
   git push -u origin main
   ```
2. 進入 GitHub 儲存庫頁面 ➡️ 點擊 **Settings** ➡️ 點選左側 **Pages**。
3. 在 **Build and deployment** 下方的 **Branch** 選取 `main` 與 `/(root)`，點擊 **Save**。
4. 等候約 30 秒至 1 分鐘，即可透過 `https://<您的帳號>.github.io/50-startups-platform/` 全球在線訪問！

---

## 📜 授權協議 (License)

本專案基於 [MIT License](LICENSE) 條款開放開源使用。歡迎自由 Fork、學習或作為教學範例！
