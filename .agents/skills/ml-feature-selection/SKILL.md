---
name: ml-feature-selection
description: >-
  Standard operating procedures and runbook for the 5-Algorithm Machine Learning Feature Selection
  and Regression Analysis Platform (VIF, Backward OLS, RFECV, LassoCV, Forward Stepwise Selection),
  interactive web dashboard development, and GitHub Pages deployment. Use when analyzing tabular regression datasets,
  reproducing 50 Startups or Spotify Tracks experiments, or extending the multi-dataset web platform.
---

# 🤖 ML Feature Selection & Regression Platform Skill

本技能（Skill）封裝了「機器學習 5 大特徵選取演算法」與「多主題互動 Web 決策平台」的標準作業程序（SOP）、演算法實作規範、前端儀表板擴充流程與 GitHub Pages 部署指南。

---

## 📂 專案核心架構

```text
├── main.py               # 50 Startups 獲利預測（CRISP-DM 6 大階段實作）
├── hw2.py                # Spotify Tracks 音樂流行度預測（20 欄位分析實作）
├── index.html            # 現代毛玻璃科技風儀表板（頂部下拉雙專案切換架構）
├── styles.css            # 暗黑科技設計系統（Glassmorphism、CSS 變數、響應式佈局）
├── app.js                # 前端互動邏輯（雙資料集動態渲染、Chart.js 雙折線圖與雷達圖）
├── README.md             # 專案公開說明文件
└── .agents/
    └── skills/
        └── ml-feature-selection/
            └── SKILL.md  # 本技能指導檔案
```

---

## 🔬 5 大特徵選取演算法標準實作規範

在處理連續型目標變數的回歸預測問題時，依序執行以下 5 大演算法以實現「消除共線性、降低過擬合、保留最具解釋力之特徵」：

### 1. 方差膨脹因子檢驗 (Variance Inflation Factor, VIF)
* **目的**：診斷自變數矩陣是否存在多重共線性（Multicollinearity）。
* **判定門檻**：$\text{VIF} < 5$ 為健康良好；$\text{VIF} \ge 10$ 視為嚴重共線性，應予以剔除或降維。
* **標準實作**：
  ```python
  import statsmodels.api as sm
  from statsmodels.stats.outliers_influence import variance_inflation_factor

  X_const = sm.add_constant(X)
  vif_df = pd.DataFrame({
      "Feature": X_const.columns,
      "VIF": [variance_inflation_factor(X_const.values, i) for i in range(X_const.shape[1])]
  })
  ```

### 2. 反向淘汰法 (Backward Elimination with OLS)
* **目的**：基於統計假設檢定，逐次剃除 $p\text{-value}$ 最大且大於顯著水準 $\alpha = 0.05$ 之變數。
* **標準實作**：
  ```python
  def backward_elimination(X_data, y_data, sl=0.05):
      features = list(X_data.columns)
      model_ols = None
      while len(features) > 0:
          X_sub = sm.add_constant(X_data[features])
          model_ols = sm.OLS(y_data, X_sub).fit()
          p_values = model_ols.pvalues.drop("const", errors="ignore")
          max_p = p_values.max()
          if max_p > sl:
              excluded = p_values.idxmax()
              features.remove(excluded)
          else:
              break
      return features, model_ols
  ```

### 3. 遞迴特徵消除與交叉驗證 (RFECV)
* **目的**：透過 $K$ 折交叉驗證（$K=5$），以驗證集評估指標自動搜尋泛化能力最強的特徵維度。
* **標準實作**：
  ```python
  from sklearn.feature_selection import RFECV
  from sklearn.linear_model import LinearRegression
  from sklearn.preprocessing import StandardScaler

  scaler = StandardScaler()
  X_scaled = scaler.fit_transform(X)

  rfecv = RFECV(
      estimator=LinearRegression(),
      step=1,
      cv=5,
      scoring="r2"  # 或 neg_root_mean_squared_error
  )
  rfecv.fit(X_scaled, y)
  optimal_features = [f for f, s in zip(X.columns, rfecv.support_) if s]
  ```

### 4. LassoCV (L1 嵌入式稀疏正則化)
* **目的**：利用 L1 範數懲罰項，將邊際或無效特徵的係數精確收縮至 $0$。
* **標準實作**：
  ```python
  from sklearn.linear_model import LassoCV

  lasso = LassoCV(cv=5, random_state=42)
  lasso.fit(X_scaled, y)
  lasso_coefs = pd.DataFrame({"Feature": X.columns, "Coef": lasso.coef_})
  selected_lasso = lasso_coefs[lasso_coefs["Coef"] != 0]["Feature"].tolist()
  ```

### 5. 前向逐步搜尋法 (Forward Stepwise Selection)
* **目的**：從空模型出發，依序納入使測試集 RMSE 降幅最大（或 $R^2$ 增幅最大）的特徵，繪製出「特徵數量 vs. RMSE/R²」曲線以定位最佳甜蜜點（Sweet Spot）。
* **標準實作**：
  ```python
  selected_features = []
  remaining_features = list(X.columns)
  history = []

  for k in range(1, len(X.columns) + 1):
      best_rmse = float('inf')
      best_r2 = None
      best_feat = None
      for feat in remaining_features:
          trial_feats = selected_features + [feat]
          model = LinearRegression().fit(X_train[trial_feats], y_train)
          pred = model.predict(X_test[trial_feats])
          rmse = np.sqrt(mean_squared_error(y_test, pred))
          r2 = r2_score(y_test, pred)
          if rmse < best_rmse:
              best_rmse = rmse
              best_r2 = r2
              best_feat = feat
      selected_features.append(best_feat)
      remaining_features.remove(best_feat)
      history.append({'k': k, 'Selected': list(selected_features), 'RMSE': best_rmse, 'R2': best_r2})
  ```

---

## 🌐 擴充 Web 平台至新資料集的標準流程 (Adding a New Dataset)

若未來需要加入第三個資料集（例如房價預測、車輛油耗）：

1. **更新頂部下拉選單 (`index.html`)**：
   在 `#datasetSelector` 內新增 `<option value="my_new_case">案例名稱</option>`。
2. **在 `app.js` 擴充資料結構與渲染**：
   * 在 `renderDataset(type)` 擴充對應的 Hero 文字與 4 大 KPI。
   * 在 `renderTable(type)` 提供逐步評估特徵清單。
   * 在 `renderDualCharts(type)` 提供該資料集特有的 $k=1 \sim 5$ 的 RMSE 與 $R^2$ 陣列。
   * 在 `renderSimulator(type)` 建立專屬的輸入滑桿，並可自訂圓餅圖（Doughnut）或雷達圖（Radar Chart）。
   * 在 `initExport()` 更新 CSV 匯出邏輯。
3. **無依賴架構優勢**：
   全站採用原生 ES6、Vanilla CSS 與 CDN 版 Chart.js，無需執行 `npm run build`，修改後存檔即可即時呈現。

---

## 🛠️ 本地測試與 GitHub Pages 部署指引

```bash
# 1. 執行後端 Python 機器學習腳本
python main.py
python hw2.py

# 2. 本地預覽網頁 (啟動伺服器)
python -m http.server 8080

# 3. 提交並推送到 GitHub
git add .
git commit -m "feat: update feature selection workflows and documentation"
git push origin main
```

線上體驗入口：[https://dave1588.github.io/50-startups-platform/](https://dave1588.github.io/50-startups-platform/)
