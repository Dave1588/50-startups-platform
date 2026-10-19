# 🚀 機器學習 5 大特徵選取演算法決策平台
### ML Feature Selection Platform: 50 Startups & Spotify Tracks Dataset

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://dave1588.github.io/50-startups-platform/)
[![Python](https://img.shields.io/badge/Python-3.9%20%7C%203.10%20%7C%203.11-blue?logo=python)](https://www.python.org/)
[![Scikit-Learn](https://img.shields.io/badge/scikit--learn-1.2%2B-orange?logo=scikitlearn)](https://scikit-learn.org/)
[![Statsmodels](https://img.shields.io/badge/statsmodels-0.14%2B-yellow)](https://www.statsmodels.org/)
[![Chart.js](https://img.shields.io/badge/Chart.js-v4.4-red?logo=chartdotjs)](https://www.chartjs.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> 🌐 **線上多主題互動體驗網址**：👉 [https://dave1588.github.io/50-startups-platform/](https://dave1588.github.io/50-startups-platform/)
> 
> *註：網頁頂部導航列設有 **「分析案例切換（Dropdown Window）」**，可在 **🏢 50 Startups (新創獲利預測)** 與 **🎵 Spotify Tracks (音樂流行度預測)** 之間一鍵即時切換全部圖表、數據表與推論模擬器！*

---

## 📖 專案雙核心主題介紹 (Project Overview)

本專案遵循資料科學與機器學習 **CRISP-DM 方法論**，實作完整的特徵工程、統計診斷與回歸模型建構，解決兩大現實領域核心預測問題：

### 主題 1：50 Startups 新創獲利驅動預測 (`main.py`)
* **資料規模**：50 家美國新創企業（加州、佛州、紐約州）。
* **自變數特徵**：研發支出 (R&D Spend)、行銷費用 (Marketing Spend)、行政成本 (Administration)、地區 (State)。
* **預測目標**：企業年度淨利潤 (`Profit`)。
* **核心研究問題**：探討新創資本配置的最佳比例，消除多重共線性，找到預測獲利的最精簡回歸模型。

### 主題 2：Spotify Tracks 音樂流行度預測 (`hw2.py`)
* **資料規模**：20 個欄位之 Spotify 音樂大數據（涵蓋流行、搖滾、電子等多流派曲目）。
* **自變數特徵**：音長 (duration)、露骨標記 (explicit)、舞蹈指數 (danceability)、能量 (energy)、音調 (key)、響度 (loudness)、調性 (mode)、語音佔比 (speechiness)、原聲純度 (acousticness)、樂器佔比 (instrumentalness)、現場感 (liveness)、正向情緒度 (valence)、曲速 (tempo)。
* **預測目標**：歌曲流行度分數 (`popularity`，0 到 100 分)。
* **核心研究問題**：多維度音訊指標對歌曲在大眾市場受歡迎程度的線性驅動影響與維度篩選。

---

## 🔬 5 大特徵選取演算法綜合實證 (5 Feature Selection Algorithms)

兩大主題均嚴格實作並對比了以下 5 大經典演算法：

| 演算法 | 類型 | 50 Startups 選取結論 | Spotify Tracks 選取結論 | 演算法核心機制 |
| :--- | :--- | :--- | :--- | :--- |
| **1. VIF 方差膨脹因子** | 統計診斷 | 全自變數 VIF $< 2.5$（無共線性） | energy (4.99) 與 loudness (2.64) 具物理相關但全合格 | 診斷特徵矩陣多重共線性 |
| **2. Backward OLS** | 顯著性封裝法 | 留下 `[R&D Spend]` ($p < 0.0001$) | 留下 `energy, speechiness, acousticness, instrumentalness, valence, duration, mode` (7特徵) | 依 p-value 逐次剔除不顯著變數 ($\alpha = 0.05$) |
| **3. RFECV** | 交叉驗證封裝法 | 最佳維度 $k=2$ (`R&D + Marketing`) | 最佳維度 $k=9$ 項核心音訊維度 | 5-Fold 交叉驗證自動挑選泛化力最強特徵集 |
| **4. LassoCV (L1)** | 嵌入式正則化 | 地區變數係數壓縮至 0，研發係數 $+36,030$ | tempo、explicit、liveness、loudness 係數完全收縮至 0 | L1 範數懲罰項達成自動稀疏特徵選取 |
| **5. Forward Stepwise** | 貪婪逐步搜尋 | 🏆 **最佳推薦 $k=2$** (RMSE $8,198.80) | 🏆 **最佳雙音訊 $k=2$** (`energy + instrumentalness`) | 追蹤特徵逐次增加時的 RMSE 與 $R^2$ 甜蜜點 |

---

## 📊 前向逐步評估數據對照表 (Stepwise Evaluation Results)

### 🏢 案例一：50 Startups (`main.py`)
| 特徵數量 (k) | 選入特徵組合 (Selected Features) | 測試集 RMSE ($) | 決定係數 (R²) | 狀態評價 |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `[R&D Spend]` | 8274.868018 | 0.946459 | ⚡ 最佳簡約單變數模型 |
| **2** | `[R&D Spend, Marketing Spend]` | **8198.797191** | **0.947439** | 🏆 **全局最佳推薦解 (誤差最低)** |
| **3** | `[R&D Spend, Marketing Spend, State_New York]` | 8309.059683 | 0.946015 | 誤差開始回升 |
| **4** | `[R&D Spend, Marketing Spend, State_New York, State_Florida]` | 8409.916714 | 0.944697 | 地理特徵未帶來效益 |
| **5** | `[R&D Spend, Marketing Spend, State_New York, State_Florida, State_California]` | 9137.990153 | 0.934707 | ⚠️ 加入行政費用，顯著過擬合 |

### 🎵 案例二：Spotify Tracks Dataset (`hw2.py`)
| 特徵數量 (k) | 選入特徵組合 (Selected Features) | 測試集 RMSE | 決定係數 (R²) | 狀態評價 |
| :---: | :--- | :---: | :---: | :--- |
| **1** | `[energy]` | 18.843102 | 0.153736 | 能量為首要區隔因子 |
| **2** | `[energy, instrumentalness]` | **18.685514** | **0.167832** | 🏆 **最佳雙音訊模型 (抗噪能力佳)** |
| **3** | `[energy, instrumentalness, valence]` | 18.578383 | 0.177347 | 納入情緒正向度 |
| **4** | `[energy, instrumentalness, valence, mode]` | 18.525232 | 0.182047 | 納入調性特徵 |
| **5** | `[energy, instrumentalness, valence, mode, acousticness]` | 18.484290 | 0.185659 | 5 音訊綜合回歸 |

---

## 🖥️ 互動式 Web 儀表板亮點 (Interactive Web Platform)

* **頂部下拉切換器 (Top Dropdown Window)**：
  * 在導航列設有 `📌 分析案例切換：`，點擊即時無縫切換 **50 Startups** 與 **Spotify Tracks**。
  * 包含 Hero 總覽、4 大 KPI 指標、雙折線圖、評估表格、5 大演算法分頁與模擬器皆動態響應！
* **雙子圖並排視覺化**：
  * **左圖**：`RMSE by Number of Features`。
  * **右圖**：`R-squared by Number of Features`。
  * 支援滑鼠懸浮數值卡、貝茲平滑曲線。
* **即時推論模擬器 (Live Inference Simulator)**：
  * **50 Startups 模式**：研發、行銷、行政支出滑桿 ➔ 動態預測淨利潤與支出結構圓餅圖（Doughnut Chart）。
  * **Spotify Tracks 模式**：能量、樂器佔比、正向度、舞蹈性、原聲純度滑桿 ➔ 即時計算流行度分數 (0~100) 與**多維音訊雷達圖 (Audio Profile Radar)**。
* **支援一鍵 CSV 數據匯出**：依據當前選取之案例，將評估表格匯出為標準 CSV。

---

## 📁 專案檔案結構 (Project Structure)

```text
50-startups-platform/
│
├── index.html            # 平台主頁面結構（支援頂部下拉雙專案切換）
├── styles.css            # 現代毛玻璃暗黑科技主題樣式表（CSS Custom Properties, Grid/Flexbox）
├── app.js                # 前端互動邏輯（雙資料集動態渲染、Chart.js 圖表、雷達圖與推論計算）
├── main.py               # 50 Startups 機器學習後端分析腳本（CRISP-DM 完整 6 大階段實作）
├── hw2.py                # Spotify Tracks 音樂流行度預測腳本（20 欄位分析實作）
├── .gitignore            # 忽略 Python 快取、暫存與系統檔案
└── README.md             # 專案詳細說明文件
```

---

## 🛠️ 本地執行指南 (Local Setup & Run)

### 1. 執行 Python 機器學習腳本
確保環境已安裝 `numpy`, `pandas`, `scikit-learn`, `statsmodels`, `matplotlib`：

```bash
# 執行 50 Startups 獲利預測分析
python main.py

# 執行 Spotify Tracks 音樂流行度預測分析
python hw2.py
```

### 2. 本地啟動 Web 儀表板
```bash
python -m http.server 8080
```
開啟瀏覽器訪問：`http://localhost:8080/index.html`，即可體驗頂部下拉選單在兩大分析案例間自由切換！

---

## 🌐 GitHub Pages 部署狀態

本專案已完成部屬並啟用 GitHub Pages，任何訪客均可直接線上訪問：
👉 **[https://dave1588.github.io/50-startups-platform/](https://dave1588.github.io/50-startups-platform/)**

---

## 📜 授權協議 (License)

本專案基於 [MIT License](LICENSE) 條款開放開源使用。歡迎自由學習、研究或作為教學演示範例！
