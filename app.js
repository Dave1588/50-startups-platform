// ==============================================================================
// ML FEATURELAB - INTERACTIVE JAVASCRIPT
// Dual Dataset Support: 50 Startups & Spotify Tracks Dataset
// Dynamic Dropdown Switcher, Chart.js Visualization, and Real-time Simulators
// ==============================================================================

let currentDataset = 'startup'; // 'startup' | 'spotify'

// Global chart references
let rmseChart = null;
let r2Chart = null;
let subChart1 = null;
let subChart2 = null;
let subChart3 = null;
let subChart4 = null;
let simChart = null;

document.addEventListener('DOMContentLoaded', () => {
  initDropdownSwitcher();
  renderDataset(currentDataset);
  initExport();
});

// ------------------------------------------------------------------------------
// 1. Dropdown Switcher Logic
// ------------------------------------------------------------------------------
function initDropdownSwitcher() {
  const selector = document.getElementById('datasetSelector');
  if (selector) {
    selector.addEventListener('change', (e) => {
      currentDataset = e.target.value;
      renderDataset(currentDataset);
    });
  }
}

// ------------------------------------------------------------------------------
// 2. Main Render Function: Switches entire platform content
// ------------------------------------------------------------------------------
function renderDataset(type) {
  const isStartup = type === 'startup';

  // --- 1. Brand & Hero ---
  const brandIcon = document.getElementById('brandIcon');
  if (brandIcon) brandIcon.textContent = isStartup ? '🏢' : '🎵';

  const heroBadge = document.getElementById('heroBadge');
  if (heroBadge) {
    heroBadge.innerHTML = `<span class="badge-dot"></span> ${
      isStartup
        ? '50 Startups 機器學習特徵工程 & 回歸決策分析平台'
        : 'Spotify Tracks 音樂大數據流行度預測 (20 欄位分析)'
    }`;
  }

  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    heroTitle.innerHTML = isStartup
      ? `50 Startups <br><span class="gradient-text">5大特徵選取演算法</span> 深度解析`
      : `Spotify Tracks <br><span class="gradient-text">音樂流行度預測平台</span> (Popularity Prediction)`;
  }

  const heroSubtitle = document.getElementById('heroSubtitle');
  if (heroSubtitle) {
    heroSubtitle.textContent = isStartup
      ? '全面解構研發支出、行銷費用與行政成本對新創企業獲利（Profit）的決定性影響，消除多重共線性，探尋最精準、最具解釋力的簡約線性回歸模型。'
      : '收集自 Spotify 平台 20+ 項音訊與結構指標，深入探討舞蹈指數 (danceability)、能量 (energy)、響度 (loudness)、樂器成分 (instrumentalness) 等對歌曲受歡迎程度 (0-100分) 的線性影響與最佳特徵維度。';
  }

  // --- 2. KPI Metric Cards ---
  document.getElementById('mIcon1').textContent = isStartup ? '📁' : '🎧';
  document.getElementById('mLabel1').textContent = isStartup ? '樣本數據總量' : '歌曲樣本庫量';
  document.getElementById('mVal1').innerHTML = isStartup ? '50 <span class="metric-unit">家新創</span>' : '2,500+ <span class="metric-unit">首曲目</span>';
  document.getElementById('mDesc1').textContent = isStartup ? '美國 3 大州（CA, FL, NY）創業投入' : '涵蓋流行、搖滾、電子等多流派音樂大數據';

  document.getElementById('mIcon2').textContent = '🏆';
  document.getElementById('mLabel2').textContent = '最佳特徵組合';
  document.getElementById('mVal2').textContent = isStartup ? 'R&D + Marketing' : 'Energy + Instrumentalness';
  document.getElementById('mDesc2').textContent = isStartup ? '前向篩選最佳甜蜜點，獲取最高預測綜效' : '前向逐步挑選最具區別力之核心音訊雙指標';

  document.getElementById('mIcon3').textContent = '📉';
  document.getElementById('mLabel3').textContent = isStartup ? '最低驗證 RMSE' : '流行度最低 RMSE';
  document.getElementById('mVal3').textContent = isStartup ? '$8,198.80' : '18.69 分';
  document.getElementById('mDesc3').textContent = isStartup ? '較全變數模型 ($9,137.99) 誤差降低 10.3%' : '基準測試集流行度 (0-100) 預測誤差最優點';

  document.getElementById('mIcon4').textContent = '🎯';
  document.getElementById('mLabel4').textContent = isStartup ? '模型解釋力 (R²)' : '特徵候選維度';
  document.getElementById('mVal4').textContent = isStartup ? '0.9474' : '20 欄位';
  document.getElementById('mDesc4').textContent = isStartup ? '超越單特徵 (0.9465) 與全變數 (0.9347)' : '包含音訊指標、音樂結構與發行資訊大數據';

  // --- 3. Stepwise Section Info ---
  document.getElementById('stepwiseDesc').textContent = isStartup
    ? '透過逐步前向選擇（Forward Stepwise Selection）評估 1 至 5 個特徵時的測試集 RMSE 與 R² 指標。視覺化曲線清晰揭示特徵數量為 2 時為最佳甜蜜點（Sweet Spot）。'
    : '透過逐步前向選擇（Forward Stepwise Selection）評估不同音訊特徵數量對音樂流行度（Popularity, 0-100）的預測成效，探究特徵邊際收益。';

  document.getElementById('tableSubtitle').textContent = isStartup
    ? '測試集評估 (test_size = 0.2, random_state = 0)，重現指標與選入特徵序列'
    : '測試集評估 (test_size = 0.2, random_state = 42)，重現 Spotify 音訊指標篩選序列';

  // --- 4. Render Table ---
  renderTable(type);

  // --- 5. Render Dual Charts ---
  renderDualCharts(type);

  // --- 6. Render 5 Algorithms Tabs ---
  renderAlgoTabs(type);

  // --- 7. Render Simulator ---
  renderSimulator(type);

  // --- 8. Render Matrix Table ---
  renderMatrix(type);
}

// ------------------------------------------------------------------------------
// 3. Render Table
// ------------------------------------------------------------------------------
function renderTable(type) {
  const isStartup = type === 'startup';
  const tableBody = document.getElementById('tableBody');
  const insightText = document.getElementById('insightText');

  if (isStartup) {
    tableBody.innerHTML = `
      <tr>
        <td><span class="rank-badge">1</span></td>
        <td><code class="code-feature">[R&D Spend]</code></td>
        <td class="text-right num-mono">8274.868018</td>
        <td class="text-right num-mono">0.946459</td>
      </tr>
      <tr class="optimal-row">
        <td><span class="rank-badge optimal-badge">2 ⭐ 最佳推薦</span></td>
        <td><code class="code-feature optimal-feat">[R&D Spend, Marketing Spend]</code></td>
        <td class="text-right num-mono text-success">8198.797191</td>
        <td class="text-right num-mono text-success">0.947439</td>
      </tr>
      <tr>
        <td><span class="rank-badge">3</span></td>
        <td><code class="code-feature">[R&D Spend, Marketing Spend, State_New York]</code></td>
        <td class="text-right num-mono">8309.059683</td>
        <td class="text-right num-mono">0.946015</td>
      </tr>
      <tr>
        <td><span class="rank-badge">4</span></td>
        <td><code class="code-feature">[R&D Spend, Marketing Spend, State_New York, State_Florida]</code></td>
        <td class="text-right num-mono">8409.916714</td>
        <td class="text-right num-mono">0.944697</td>
      </tr>
      <tr class="redundant-row">
        <td><span class="rank-badge">5</span></td>
        <td>
          <code class="code-feature">[R&D Spend, Marketing Spend, State_New York, State_Florida, State_California]</code>
          <span class="tooltip-info" title="數學擬合上加入行政支出 Administration，RMSE 顯著惡化至 9137.99">⚠️ 產生噪聲</span>
        </td>
        <td class="text-right num-mono text-danger">9137.990153</td>
        <td class="text-right num-mono text-danger">0.934707</td>
      </tr>
    `;
    insightText.innerHTML = `<strong>核心洞察：</strong> 單一特徵 R&D Spend 已解釋 94.65% 變異；加入 Marketing Spend 後解釋力達到 94.74%，RMSE 降至最低。後續納入地理虛擬變數與行政費用後，測試集 RMSE 反彈攀升，證實了多餘特徵帶來的過擬合與噪聲！`;
  } else {
    tableBody.innerHTML = `
      <tr>
        <td><span class="rank-badge">1</span></td>
        <td><code class="code-feature">[energy]</code></td>
        <td class="text-right num-mono">18.843102</td>
        <td class="text-right num-mono">0.153736</td>
      </tr>
      <tr class="optimal-row">
        <td><span class="rank-badge optimal-badge">2 ⭐ 最佳雙音訊</span></td>
        <td><code class="code-feature optimal-feat">[energy, instrumentalness]</code></td>
        <td class="text-right num-mono text-success">18.685514</td>
        <td class="text-right num-mono text-success">0.167832</td>
      </tr>
      <tr>
        <td><span class="rank-badge">3</span></td>
        <td><code class="code-feature">[energy, instrumentalness, valence]</code></td>
        <td class="text-right num-mono">18.578383</td>
        <td class="text-right num-mono">0.177347</td>
      </tr>
      <tr>
        <td><span class="rank-badge">4</span></td>
        <td><code class="code-feature">[energy, instrumentalness, valence, mode]</code></td>
        <td class="text-right num-mono">18.525232</td>
        <td class="text-right num-mono">0.182047</td>
      </tr>
      <tr>
        <td><span class="rank-badge">5</span></td>
        <td><code class="code-feature">[energy, instrumentalness, valence, mode, acousticness]</code></td>
        <td class="text-right num-mono">18.484290</td>
        <td class="text-right num-mono">0.185659</td>
      </tr>
    `;
    insightText.innerHTML = `<strong>核心洞察：</strong> 音樂流行度受多維度非線性與文化偏好影響，在純線性特徵選取中，<strong>能量 (energy)</strong> 與 <strong>樂器佔比 (instrumentalness)</strong> 是最顯著的負向過濾因子（高樂器純度純音樂在大眾市場流行度通常較低），前 2~3 個特徵即確立了主要音訊主幹！`;
  }
}

// ------------------------------------------------------------------------------
// 4. Render Dual Charts (RMSE & R-squared)
// ------------------------------------------------------------------------------
function renderDualCharts(type) {
  const isStartup = type === 'startup';
  const commonFont = { family: "'Inter', sans-serif", size: 11 };
  const gridColor = 'rgba(255, 255, 255, 0.06)';
  const tickColor = '#94a3b8';

  const rmseData = isStartup
    ? [8274.868018, 8198.797191, 8309.059683, 8409.916714, 9137.990153]
    : [18.843102, 18.685514, 18.578383, 18.525232, 18.484290];

  const r2Data = isStartup
    ? [0.946459, 0.947439, 0.946015, 0.944697, 0.934707]
    : [0.153736, 0.167832, 0.177347, 0.182047, 0.185659];

  // Destroy previous charts if existing
  if (rmseChart) rmseChart.destroy();
  if (r2Chart) r2Chart.destroy();

  // Chart 1: RMSE
  const ctxRMSE = document.getElementById('rmseChart');
  if (ctxRMSE) {
    rmseChart = new Chart(ctxRMSE, {
      type: 'line',
      data: {
        labels: ['1.0', '2.0', '3.0', '4.0', '5.0'],
        datasets: [{
          label: isStartup ? 'RMSE ($)' : 'RMSE (流行度分數)',
          data: rmseData,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 2.2,
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: "'Outfit', sans-serif", weight: 'bold' },
            bodyFont: { family: "'JetBrains Mono', monospace" },
            padding: 10,
            borderColor: 'rgba(56, 189, 248, 0.4)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `RMSE: ${isStartup ? '$' : ''}${context.raw.toFixed(4)}`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Number of Features', color: '#cbd5e1', font: { weight: 'bold', size: 12 } },
            grid: { color: gridColor },
            ticks: { color: tickColor, font: commonFont }
          },
          y: {
            title: { display: true, text: isStartup ? 'RMSE ($)' : 'RMSE', color: '#cbd5e1', font: { weight: 'bold', size: 12 } },
            grid: { color: gridColor },
            ticks: { color: tickColor, font: commonFont }
          }
        }
      }
    });
  }

  // Chart 2: R-squared
  const ctxR2 = document.getElementById('r2Chart');
  if (ctxR2) {
    r2Chart = new Chart(ctxR2, {
      type: 'line',
      data: {
        labels: ['1.0', '2.0', '3.0', '4.0', '5.0'],
        datasets: [{
          label: 'R-squared',
          data: r2Data,
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.1)',
          pointBackgroundColor: '#00f2fe',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 1.5,
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 2.2,
          tension: 0.1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: "'Outfit', sans-serif", weight: 'bold' },
            bodyFont: { family: "'JetBrains Mono', monospace" },
            padding: 10,
            borderColor: 'rgba(0, 242, 254, 0.4)',
            borderWidth: 1,
            callbacks: {
              label: (context) => `R²: ${context.raw.toFixed(6)}`
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Number of Features', color: '#cbd5e1', font: { weight: 'bold', size: 12 } },
            grid: { color: gridColor },
            ticks: { color: tickColor, font: commonFont }
          },
          y: {
            title: { display: true, text: 'R-squared', color: '#cbd5e1', font: { weight: 'bold', size: 12 } },
            grid: { color: gridColor },
            ticks: { color: tickColor, font: commonFont }
          }
        }
      }
    });
  }
}

// ------------------------------------------------------------------------------
// 5. Render 5 Algorithm Tabs & Subcharts
// ------------------------------------------------------------------------------
function renderAlgoTabs(type) {
  const isStartup = type === 'startup';
  const container = document.getElementById('dynamicAlgoTabContent');

  if (isStartup) {
    container.innerHTML = `
      <div class="tab-content active" id="tab-vif">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">診斷指標</div>
            <h3>方差膨脹因子 (VIF)</h3>
            <p>量化特徵間的嚴重共線性問題。全部自變數 VIF 皆小於 2.5，代表本資料集無嚴重多重共線性。</p>
            <div class="vif-metrics-list">
              <div class="vif-item safe"><span class="vif-feat">R&D Spend</span><span class="vif-val">VIF = 2.50</span><span class="vif-status">良好 (無共線性)</span></div>
              <div class="vif-item safe"><span class="vif-feat">Marketing Spend</span><span class="vif-val">VIF = 2.42</span><span class="vif-status">良好 (無共線性)</span></div>
              <div class="vif-item safe"><span class="vif-feat">State_Florida</span><span class="vif-val">VIF = 1.39</span><span class="vif-status">良好</span></div>
              <div class="vif-item safe"><span class="vif-feat">State_New York</span><span class="vif-val">VIF = 1.34</span><span class="vif-status">良好</span></div>
              <div class="vif-item safe"><span class="vif-feat">Administration</span><span class="vif-val">VIF = 1.18</span><span class="vif-status">良好</span></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>各特徵 VIF 數值分佈</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart1"></canvas></div>
            <p class="chart-caption">全部自變數 VIF 皆小於 2.5，無多重共線性。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-be">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">假設檢定策略</div>
            <h3>反向淘汰法 (Backward Elimination with OLS)</h3>
            <p>每次剔除 p-value 最高且大於顯著水準（α = 0.05）之特徵，直到所有保留特徵皆顯著。</p>
            <div class="stepper-list">
              <div class="step-item dropped"><div class="step-num">Step 1</div><div class="step-content"><strong>剔除 State_New York</strong><span>Max p-value = 0.9898 (> 0.05)</span></div></div>
              <div class="step-item dropped"><div class="step-num">Step 2</div><div class="step-content"><strong>剔除 State_Florida</strong><span>Max p-value = 0.9398 (> 0.05)</span></div></div>
              <div class="step-item dropped"><div class="step-num">Step 3</div><div class="step-content"><strong>剔除 Administration</strong><span>Max p-value = 0.6018 (> 0.05)</span></div></div>
              <div class="step-item dropped"><div class="step-num">Step 4</div><div class="step-content"><strong>剔除 Marketing Spend</strong><span>Max p-value = 0.0600 (> 0.05)</span></div></div>
              <div class="step-item selected"><div class="step-num">Final</div><div class="step-content"><strong>保留特徵：[R&D Spend]</strong><span>p-value < 0.0001，極度顯著</span></div></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>OLS p-value 剔除歷程檢視</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart2"></canvas></div>
            <p class="chart-caption">僅 R&D Spend 遠低於 0.05 顯著門檻。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-rfecv">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">交叉驗證封裝法</div>
            <h3>遞迴特徵消除與交叉驗證 (RFECV)</h3>
            <p>採用 5 折交叉驗證，以 R² 為指標自動搜尋泛化能力最強之維度。</p>
            <div class="rfecv-summary">
              <div class="summary-box"><span class="label">最佳特徵數</span><span class="val text-success">2 個特徵</span></div>
              <div class="summary-box"><span class="label">入選特徵</span><span class="val">[R&D Spend, Marketing Spend]</span></div>
            </div>
            <div class="ranking-table-box">
              <h4>特徵排名</h4>
              <ul class="rank-list">
                <li class="rank-item rank-1"><span>R&D Spend</span><span class="badge">Rank 1</span></li>
                <li class="rank-item rank-1"><span>Marketing Spend</span><span class="badge">Rank 1</span></li>
                <li class="rank-item"><span>Administration</span><span class="badge">Rank 2</span></li>
                <li class="rank-item"><span>State_Florida</span><span class="badge">Rank 3</span></li>
                <li class="rank-item"><span>State_New York</span><span class="badge">Rank 4</span></li>
              </ul>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>RFECV 5-Fold 交叉驗證分數曲線</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart3"></canvas></div>
            <p class="chart-caption">特徵數為 2 時達到最高 CV 分數。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-lasso">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">L1 嵌入式正則化</div>
            <h3>LassoCV 稀疏係數收縮</h3>
            <p>利用 L1 範數懲罰項將無影響力變數係數壓縮至 0，達成自動特徵選取。</p>
            <div class="lasso-coef-list">
              <div class="lasso-item dominant"><span class="f-name">R&D Spend</span><span class="f-coef">+36,030.42</span></div>
              <div class="lasso-item mild"><span class="f-name">Marketing Spend</span><span class="f-coef">+3,290.32</span></div>
              <div class="lasso-item tiny"><span class="f-name">Administration</span><span class="f-coef">-156.89</span></div>
              <div class="lasso-item zero"><span class="f-name">State_Florida</span><span class="f-coef">0.0000 (壓縮)</span></div>
              <div class="lasso-item zero"><span class="f-name">State_New York</span><span class="f-coef">0.0000 (壓縮)</span></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>標準化回歸係數 (Standardized Coefs)</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart4"></canvas></div>
            <p class="chart-caption">地區變數係數歸零，研發支出佔據絕對核心。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-forward">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">貪婪搜尋演算法</div>
            <h3>前向逐步篩選法 (Forward Stepwise Selection)</h3>
            <p>從空模型逐次納入使 RMSE 下降幅度最大的特徵。</p>
            <div class="forward-steps">
              <div class="f-step"><span class="k-label">k=1</span><div><strong>R&D Spend</strong> (RMSE: $8,274.87)</div></div>
              <div class="f-step highlight"><span class="k-label">k=2</span><div><strong>+ Marketing Spend</strong> (RMSE: $8,198.80 🏆 最優)</div></div>
              <div class="f-step"><span class="k-label">k=3</span><div><strong>+ State_New York</strong> (RMSE: $8,309.06)</div></div>
              <div class="f-step"><span class="k-label">k=4</span><div><strong>+ State_Florida</strong> (RMSE: $8,409.92)</div></div>
              <div class="f-step"><span class="k-label">k=5</span><div><strong>+ Administration</strong> (RMSE: $9,137.99 ⚠️ 噪聲)</div></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>決策結論</h4>
            <div class="decision-box">
              <div class="decision-item"><span class="decision-title">🎯 最佳效能模型：</span><p><strong>[R&D Spend, Marketing Spend]</strong>（RMSE 降至 $8,198.80）。</p></div>
              <div class="decision-item"><span class="decision-title">⚡ 最佳簡約模型：</span><p><strong>[R&D Spend]</strong> 單一變數解釋 94.65% 變異。</p></div>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Spotify Tab Content
    container.innerHTML = `
      <div class="tab-content active" id="tab-vif">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">共線性檢驗</div>
            <h3>Spotify 音訊特徵 VIF 分析</h3>
            <p>評估 12 項音訊維度間是否存在重疊共線性。energy 與 loudness 有較強物理關聯（VIF 4.98 與 2.64），但皆小於 5 臨界值。</p>
            <div class="vif-metrics-list">
              <div class="vif-item safe"><span class="vif-feat">energy (能量指數)</span><span class="vif-val">VIF = 4.99</span><span class="vif-status">邊界安全</span></div>
              <div class="vif-item safe"><span class="vif-feat">loudness (響度 dB)</span><span class="vif-val">VIF = 2.64</span><span class="vif-status">良好</span></div>
              <div class="vif-item safe"><span class="vif-feat">acousticness (原聲度)</span><span class="vif-val">VIF = 2.39</span><span class="vif-status">良好</span></div>
              <div class="vif-item safe"><span class="vif-feat">valence (正向情緒度)</span><span class="vif-val">VIF = 1.88</span><span class="vif-status">良好</span></div>
              <div class="vif-item safe"><span class="vif-feat">danceability (舞蹈性)</span><span class="vif-val">VIF = 1.45</span><span class="vif-status">良好</span></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>Spotify 各音訊特徵 VIF 數值</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart1"></canvas></div>
            <p class="chart-caption">除 energy 與 loudness 具有物理音訊關聯外，其餘特徵獨立性極高。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-be">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">假設檢定策略</div>
            <h3>反向淘汰法 (OLS p-values on Popularity)</h3>
            <p>以顯著水準 α = 0.05 逐步剃除對流行度無統計顯著影響之音訊指標。</p>
            <div class="stepper-list">
              <div class="step-item dropped"><div class="step-num">Step 1</div><div class="step-content"><strong>剔除 explicit (露骨標記)</strong><span>Max p-value = 0.9796</span></div></div>
              <div class="step-item dropped"><div class="step-num">Step 2</div><div class="step-content"><strong>剔除 liveness (現場錄音感)</strong><span>Max p-value = 0.8709</span></div></div>
              <div class="step-item dropped"><div class="step-num">Step 3</div><div class="step-content"><strong>剔除 tempo (曲速 BPM)</strong><span>Max p-value = 0.7768</span></div></div>
              <div class="step-item dropped"><div class="step-num">Step 4</div><div class="step-content"><strong>剔除 loudness (響度)</strong><span>Max p-value = 0.2014</span></div></div>
              <div class="step-item selected"><div class="step-num">Final</div><div class="step-content"><strong>保留：[energy, speechiness, acousticness, instrumentalness, valence, duration, mode]</strong><span>7 項音訊顯著因子</span></div></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>OLS p-value 淘汰歷程</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart2"></canvas></div>
            <p class="chart-caption">tempo 與 explicit 對大眾流行度無顯著統計學區隔。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-rfecv">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">交叉驗證封裝法</div>
            <h3>RFECV 音訊維度排名</h3>
            <p>5-Fold 交叉驗證自動挑選兼具泛化度與精準度之音訊特徵集。</p>
            <div class="rfecv-summary">
              <div class="summary-box"><span class="label">最佳特徵數</span><span class="val text-success">9 個核心特徵</span></div>
              <div class="summary-box"><span class="label">核心評估指標</span><span class="val">負均方根誤差 (Neg RMSE)</span></div>
            </div>
            <div class="ranking-table-box">
              <h4>特徵排名</h4>
              <ul class="rank-list">
                <li class="rank-item rank-1"><span>energy & instrumentalness</span><span class="badge">Rank 1</span></li>
                <li class="rank-item rank-1"><span>valence & speechiness</span><span class="badge">Rank 1</span></li>
                <li class="rank-item"><span>tempo</span><span class="badge">Rank 2</span></li>
                <li class="rank-item"><span>liveness</span><span class="badge">Rank 3</span></li>
                <li class="rank-item"><span>explicit</span><span class="badge">Rank 4</span></li>
              </ul>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>RFECV 5-Fold 交叉驗證分數曲線</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart3"></canvas></div>
            <p class="chart-caption">音訊特徵維度達 8~9 個時達到泛化誤差極限。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-lasso">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">L1 稀疏正則化</div>
            <h3>LassoCV 音訊係數壓縮</h3>
            <p>Lasso 將 tempo、explicit、liveness 與 loudness 係數直接壓縮至 0，凸顯 energy 與 valence 為主導負向因子。</p>
            <div class="lasso-coef-list">
              <div class="lasso-item dominant"><span class="f-name">energy (能量)</span><span class="f-coef">-4.0084 (強烈負向)</span></div>
              <div class="lasso-item dominant"><span class="f-name">valence (正向度)</span><span class="f-coef">-2.7011 (負向影響)</span></div>
              <div class="lasso-item mild"><span class="f-name">instrumentalness</span><span class="f-coef">-1.4283</span></div>
              <div class="lasso-item mild"><span class="f-name">acousticness</span><span class="f-coef">+1.2547 (正向)</span></div>
              <div class="lasso-item zero"><span class="f-name">tempo, explicit</span><span class="f-coef">0.0000 (完全收縮)</span></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>標準化回歸係數分佈</h4>
            <div class="chart-canvas-wrapper-sm"><canvas id="subChart4"></canvas></div>
            <p class="chart-caption">energy 與 valence 呈現顯著負向，反映大眾流行歌偏好適中能量與特定氛圍。</p>
          </div>
        </div>
      </div>
      <div class="tab-content" id="tab-forward">
        <div class="algo-card-grid">
          <div class="algo-info-card">
            <div class="algo-badge">前向逐步篩選</div>
            <h3>前向逐步搜尋歷程 (Spotify Tracks)</h3>
            <p>依序納入最具解釋力之音訊特徵：</p>
            <div class="forward-steps">
              <div class="f-step"><span class="k-label">k=1</span><div><strong>energy</strong> (RMSE: 18.84, R²: 0.1537)</div></div>
              <div class="f-step highlight"><span class="k-label">k=2</span><div><strong>+ instrumentalness</strong> (RMSE: 18.69 🏆 最佳平衡)</div></div>
              <div class="f-step"><span class="k-label">k=3</span><div><strong>+ valence</strong> (RMSE: 18.58, R²: 0.1773)</div></div>
              <div class="f-step"><span class="k-label">k=4</span><div><strong>+ mode</strong> (RMSE: 18.53, R²: 0.1820)</div></div>
              <div class="f-step"><span class="k-label">k=5</span><div><strong>+ acousticness</strong> (RMSE: 18.48, R²: 0.1857)</div></div>
            </div>
          </div>
          <div class="algo-visual-card">
            <h4>音訊特徵決策結論</h4>
            <div class="decision-box">
              <div class="decision-item"><span class="decision-title">🎯 最佳雙音訊模型：</span><p><strong>[energy, instrumentalness]</strong>：掌握流行度基本盤，抗噪能力最佳。</p></div>
              <div class="decision-item"><span class="decision-title">💡 音樂大數據洞見：</span><p>流行度不僅受音訊支配，歌手影響力與宣傳亦佔重要比重。</p></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Bind tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.onclick = () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      const contents = document.querySelectorAll('#dynamicAlgoTabContent .tab-content');
      contents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
    };
  });

  // Render Subcharts
  renderSubCharts(type);
}

// ------------------------------------------------------------------------------
// 6. Render Subcharts in Tabs
// ------------------------------------------------------------------------------
function renderSubCharts(type) {
  const isStartup = type === 'startup';
  const commonFont = { family: "'Inter', sans-serif", size: 10 };
  const gridColor = 'rgba(255, 255, 255, 0.06)';
  const tickColor = '#94a3b8';

  // SubChart 1: VIF
  if (subChart1) subChart1.destroy();
  const ctx1 = document.getElementById('subChart1');
  if (ctx1) {
    const labels = isStartup
      ? ['R&D', 'Mkt', 'State_FL', 'State_NY', 'Admin']
      : ['energy', 'loudness', 'acoustic', 'valence', 'dance'];
    const data = isStartup
      ? [2.50, 2.42, 1.39, 1.34, 1.18]
      : [4.99, 2.64, 2.39, 1.88, 1.45];

    subChart1 = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#00f2fe', '#38bdf8', '#a855f7', '#ec4899', '#10b981'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: tickColor, font: commonFont }, grid: { display: false } },
          y: { ticks: { color: tickColor, font: commonFont }, grid: { color: gridColor }, max: isStartup ? 4 : 6 }
        }
      }
    });
  }

  // SubChart 2: Backward OLS
  if (subChart2) subChart2.destroy();
  const ctx2 = document.getElementById('subChart2');
  if (ctx2) {
    const labels = isStartup
      ? ['State_NY', 'State_FL', 'Admin', 'Mkt', 'R&D']
      : ['explicit', 'liveness', 'tempo', 'loudness', 'energy'];
    const data = isStartup
      ? [0.9898, 0.9398, 0.6018, 0.0600, 0.0001]
      : [0.9796, 0.8709, 0.7768, 0.2014, 0.0001];

    subChart2 = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#ef4444', '#ef4444', '#ef4444', '#f59e0b', '#10b981'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: tickColor, font: commonFont }, grid: { display: false } },
          y: { ticks: { color: tickColor, font: commonFont }, grid: { color: gridColor }, max: 1.0 }
        }
      }
    });
  }

  // SubChart 3: RFECV
  if (subChart3) subChart3.destroy();
  const ctx3 = document.getElementById('subChart3');
  if (ctx3) {
    const labels = isStartup ? ['1', '2*', '3', '4', '5'] : ['1', '3', '5', '7', '9*'];
    const data = isStartup ? [0.938, 0.948, 0.941, 0.935, 0.920] : [-19.2, -18.9, -18.7, -18.6, -18.4];

    subChart3 = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          pointBackgroundColor: '#10b981',
          pointRadius: 5,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: tickColor, font: commonFont }, grid: { color: gridColor } },
          y: { ticks: { color: tickColor, font: commonFont }, grid: { color: gridColor } }
        }
      }
    });
  }

  // SubChart 4: Lasso
  if (subChart4) subChart4.destroy();
  const ctx4 = document.getElementById('subChart4');
  if (ctx4) {
    const labels = isStartup
      ? ['R&D', 'Mkt', 'Admin', 'State_FL', 'State_NY']
      : ['acoustic', 'mode', 'dance', 'loudness', 'valence', 'energy'];
    const data = isStartup
      ? [36030, 3290, -156, 0, 0]
      : [1.25, 0.74, 0.22, 0.00, -2.70, -4.01];

    subChart4 = new Chart(ctx4, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: isStartup
            ? ['#00f2fe', '#a855f7', '#f59e0b', '#64748b', '#64748b']
            : ['#10b981', '#38bdf8', '#00f2fe', '#64748b', '#f59e0b', '#ef4444'],
          borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: tickColor, font: commonFont }, grid: { color: gridColor } },
          y: { ticks: { color: tickColor, font: commonFont }, grid: { display: false } }
        }
      }
    });
  }
}

// ------------------------------------------------------------------------------
// 7. Render Simulator (50 Startups vs Spotify)
// ------------------------------------------------------------------------------
function renderSimulator(type) {
  const isStartup = type === 'startup';
  const inputsContainer = document.getElementById('simInputsContainer');
  const outputsContainer = document.getElementById('simOutputsContainer');

  if (isStartup) {
    // 50 Startups Simulator
    inputsContainer.innerHTML = `
      <div class="sim-panel-title">
        <span>⚙️ 營運投入參數調整</span>
        <button id="btnResetInputs" class="btn btn-xs btn-ghost">重設預設值</button>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputRD">研發支出 (R&D Spend)</label>
          <span class="input-val-badge" id="valRD">$130,000</span>
        </div>
        <input type="range" id="inputRD" min="0" max="200000" step="1000" value="130000" class="sim-slider">
        <div class="slider-limits"><span>$0</span><span>$100k</span><span>$200k</span></div>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputMarketing">行銷費用 (Marketing Spend)</label>
          <span class="input-val-badge" id="valMarketing">$250,000</span>
        </div>
        <input type="range" id="inputMarketing" min="0" max="500000" step="5000" value="250000" class="sim-slider">
        <div class="slider-limits"><span>$0</span><span>$250k</span><span>$500k</span></div>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputAdmin">行政成本 (Administration Spend)</label>
          <span class="input-val-badge" id="valAdmin">$120,000</span>
        </div>
        <input type="range" id="inputAdmin" min="0" max="200000" step="2000" value="120000" class="sim-slider">
        <div class="slider-limits"><span>$0</span><span>$100k</span><span>$200k</span></div>
      </div>

      <div class="input-group">
        <label for="selectState">公司註冊地區 (State)</label>
        <select id="selectState" class="sim-select">
          <option value="New York" selected>New York</option>
          <option value="California">California</option>
          <option value="Florida">Florida</option>
        </select>
      </div>

      <div class="input-group">
        <label>套用推論模型</label>
        <div class="model-radio-group">
          <label class="radio-card active">
            <input type="radio" name="modelType" value="optimal" checked>
            <div class="radio-content">
              <strong>🏆 最佳 2 特徵模型 (推薦)</strong>
              <span>R&D + Marketing (RMSE $8,198)</span>
            </div>
          </label>
          <label class="radio-card">
            <input type="radio" name="modelType" value="parsimonious">
            <div class="radio-content">
              <strong>⚡ 極簡 1 特徵模型</strong>
              <span>僅 R&D Spend (RMSE $8,274)</span>
            </div>
          </label>
          <label class="radio-card">
            <input type="radio" name="modelType" value="full">
            <div class="radio-content">
              <strong>🌐 全變數模型 (5 特徵)</strong>
              <span>含行政與地理變數 (RMSE $9,137)</span>
            </div>
          </label>
        </div>
      </div>
    `;

    outputsContainer.innerHTML = `
      <div class="sim-panel-title">
        <span>📈 即時獲利預測 (Inference Output)</span>
        <span class="model-tag" id="currentModelTag">Optimal Model (k=2)</span>
      </div>

      <div class="prediction-big-card">
        <div class="pred-label">預估企業年度淨獲利 (Estimated Profit)</div>
        <div class="pred-number" id="predProfit">$160,820</div>
        <div class="pred-equation" id="predEquation">
          Profit = 0.7886 × (R&D) + 0.0326 × (Marketing) + $46,346.34
        </div>
      </div>

      <div class="pred-comparison-grid">
        <div class="comp-box">
          <div class="comp-title">研發獲利槓桿</div>
          <div class="comp-val text-cyan">每投 $1 獲利 +$0.79</div>
          <div class="comp-desc">最高回報動能</div>
        </div>
        <div class="comp-box">
          <div class="comp-title">行銷放大效應</div>
          <div class="comp-val text-purple">每投 $1 獲利 +$0.03</div>
          <div class="comp-desc">正向協同綜效</div>
        </div>
      </div>

      <div class="expenditure-panel">
        <h4>當前支出結構分配比例</h4>
        <div class="doughnut-wrapper"><canvas id="simChartCanvas"></canvas></div>
      </div>
    `;

    initStartupSimulatorLogic();
  } else {
    // Spotify Tracks Simulator
    inputsContainer.innerHTML = `
      <div class="sim-panel-title">
        <span>🎚️ 音訊特徵指標調整</span>
        <button id="btnResetSpotify" class="btn btn-xs btn-ghost">重設預設值</button>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputEnergy">能量指數 (Energy)</label>
          <span class="input-val-badge" id="valEnergy">0.65</span>
        </div>
        <input type="range" id="inputEnergy" min="0.0" max="1.0" step="0.01" value="0.65" class="sim-slider">
        <div class="slider-limits"><span>0.0 (空靈平靜)</span><span>0.5</span><span>1.0 (激昂狂暴)</span></div>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputInst">樂器成分比例 (Instrumentalness)</label>
          <span class="input-val-badge" id="valInst">0.15</span>
        </div>
        <input type="range" id="inputInst" min="0.0" max="1.0" step="0.01" value="0.15" class="sim-slider">
        <div class="slider-limits"><span>0.0 (純人聲)</span><span>0.5</span><span>1.0 (純樂器奏鳴)</span></div>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputValence">正向情緒度 (Valence)</label>
          <span class="input-val-badge" id="valValence">0.55</span>
        </div>
        <input type="range" id="inputValence" min="0.0" max="1.0" step="0.01" value="0.55" class="sim-slider">
        <div class="slider-limits"><span>0.0 (悲傷憂鬱)</span><span>0.5</span><span>1.0 (歡樂亢奮)</span></div>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputDance">舞蹈指數 (Danceability)</label>
          <span class="input-val-badge" id="valDance">0.70</span>
        </div>
        <input type="range" id="inputDance" min="0.0" max="1.0" step="0.01" value="0.70" class="sim-slider">
        <div class="slider-limits"><span>0.0 (節奏微弱)</span><span>0.5</span><span>1.0 (節拍極強)</span></div>
      </div>

      <div class="input-group">
        <div class="input-header">
          <label for="inputAcoustic">原聲純度 (Acousticness)</label>
          <span class="input-val-badge" id="valAcoustic">0.25</span>
        </div>
        <input type="range" id="inputAcoustic" min="0.0" max="1.0" step="0.01" value="0.25" class="sim-slider">
        <div class="slider-limits"><span>0.0 (電子合成)</span><span>0.5</span><span>1.0 (純原聲不插電)</span></div>
      </div>

      <div class="input-group">
        <label>套用推論模型</label>
        <div class="model-radio-group">
          <label class="radio-card active">
            <input type="radio" name="modelTypeSpotify" value="optimal" checked>
            <div class="radio-content">
              <strong>🏆 最佳雙音訊模型 (推薦)</strong>
              <span>energy + instrumentalness (RMSE 18.68)</span>
            </div>
          </label>
          <label class="radio-card">
            <input type="radio" name="modelTypeSpotify" value="single">
            <div class="radio-content">
              <strong>⚡ 簡約單特徵模型</strong>
              <span>僅 energy (RMSE 18.84)</span>
            </div>
          </label>
          <label class="radio-card">
            <input type="radio" name="modelTypeSpotify" value="multi">
            <div class="radio-content">
              <strong>🌐 5 音訊綜合回歸模型</strong>
              <span>energy + inst + valence + acoustic + mode</span>
            </div>
          </label>
        </div>
      </div>
    `;

    outputsContainer.innerHTML = `
      <div class="sim-panel-title">
        <span>🎵 音樂流行度推論預估</span>
        <span class="model-tag success-chip" id="currentModelTagSpotify">Optimal Model (k=2)</span>
      </div>

      <div class="prediction-big-card">
        <div class="pred-label">預估 Spotify 流行度分數 (Popularity 0-100)</div>
        <div class="pred-number" id="predPopularity">54.2 <span style="font-size: 1.5rem; color: #38bdf8;">/ 100</span></div>
        <div class="pred-equation" id="predEqSpotify">
          Popularity = 50.81 - 18.72(Energy) - 14.36(Instrumentalness)
        </div>
      </div>

      <div class="pred-comparison-grid">
        <div class="comp-box">
          <div class="comp-title">大眾流行等級</div>
          <div class="comp-val text-cyan" id="popLevelBadge">中高度流行 (Mainstream)</div>
          <div class="comp-desc">符合現代主流榜單特徵</div>
        </div>
        <div class="comp-box">
          <div class="comp-title">人聲佔比溢價</div>
          <div class="comp-val text-purple">低樂器純度更受歡迎</div>
          <div class="comp-desc">純演奏曲流行度平均偏低</div>
        </div>
      </div>

      <div class="expenditure-panel">
        <h4>音訊多維特徵雷達圖 (Audio Profile Radar)</h4>
        <div class="doughnut-wrapper"><canvas id="simChartCanvas"></canvas></div>
      </div>
    `;

    initSpotifySimulatorLogic();
  }
}

// ------------------------------------------------------------------------------
// 8. Simulator Logics
// ------------------------------------------------------------------------------
function initStartupSimulatorLogic() {
  const inputRD = document.getElementById('inputRD');
  const inputMarketing = document.getElementById('inputMarketing');
  const inputAdmin = document.getElementById('inputAdmin');
  const selectState = document.getElementById('selectState');

  const valRD = document.getElementById('valRD');
  const valMarketing = document.getElementById('valMarketing');
  const valAdmin = document.getElementById('valAdmin');

  const predProfit = document.getElementById('predProfit');
  const predEquation = document.getElementById('predEquation');
  const currentModelTag = document.getElementById('currentModelTag');
  const btnResetInputs = document.getElementById('btnResetInputs');

  const radioCards = document.querySelectorAll('.radio-card');
  let selectedModel = 'optimal';

  // Init Doughnut Chart
  if (simChart) simChart.destroy();
  const ctx = document.getElementById('simChartCanvas');
  if (ctx) {
    simChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['R&D Spend', 'Marketing Spend', 'Administration'],
        datasets: [{
          data: [130000, 250000, 120000],
          backgroundColor: ['#00f2fe', '#a855f7', '#64748b'],
          borderColor: '#0a0e17',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  function update() {
    const rd = parseFloat(inputRD.value) || 0;
    const marketing = parseFloat(inputMarketing.value) || 0;
    const admin = parseFloat(inputAdmin.value) || 0;
    const state = selectState.value;

    valRD.textContent = `$${rd.toLocaleString()}`;
    valMarketing.textContent = `$${marketing.toLocaleString()}`;
    valAdmin.textContent = `$${admin.toLocaleString()}`;

    if (simChart) {
      simChart.data.datasets[0].data = [rd, marketing, admin];
      simChart.update();
    }

    let profit = 0;
    let eq = '';
    if (selectedModel === 'optimal') {
      profit = 0.788618 * rd + 0.032577 * marketing + 46346.34;
      eq = 'Profit = 0.7886 × (R&D) + 0.0326 × (Marketing) + $46,346.34';
      currentModelTag.textContent = '🏆 Optimal Model (k=2, RMSE $8,198)';
      currentModelTag.className = 'model-tag success-chip';
    } else if (selectedModel === 'parsimonious') {
      profit = 0.851623 * rd + 48416.30;
      eq = 'Profit = 0.8516 × (R&D) + $48,416.30';
      currentModelTag.textContent = '⚡ Parsimonious Model (k=1, RMSE $8,274)';
      currentModelTag.className = 'model-tag primary-chip';
    } else {
      const isFL = state === 'Florida' ? 1 : 0;
      const isNY = state === 'New York' ? 1 : 0;
      profit = 0.773467 * rd + 0.032885 * admin + 0.036610 * marketing - 959.28 * isFL + 699.37 * isNY + 42554.17;
      eq = 'Profit = 0.7735(R&D) + 0.0329(Admin) + 0.0366(Mkt) + Geo + $42,554.17';
      currentModelTag.textContent = '🌐 Full Model (k=5, RMSE $9,137)';
      currentModelTag.className = 'model-tag';
    }

    predProfit.textContent = `$${Math.round(profit).toLocaleString()}`;
    predEquation.textContent = eq;
  }

  [inputRD, inputMarketing, inputAdmin, selectState].forEach(el => el.addEventListener('input', update));

  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const r = card.querySelector('input[type="radio"]');
      if (r) {
        r.checked = true;
        selectedModel = r.value;
        update();
      }
    });
  });

  if (btnResetInputs) {
    btnResetInputs.addEventListener('click', () => {
      inputRD.value = 130000;
      inputMarketing.value = 250000;
      inputAdmin.value = 120000;
      selectState.value = 'New York';
      update();
    });
  }

  update();
}

function initSpotifySimulatorLogic() {
  const inputEnergy = document.getElementById('inputEnergy');
  const inputInst = document.getElementById('inputInst');
  const inputValence = document.getElementById('inputValence');
  const inputDance = document.getElementById('inputDance');
  const inputAcoustic = document.getElementById('inputAcoustic');

  const valEnergy = document.getElementById('valEnergy');
  const valInst = document.getElementById('valInst');
  const valValence = document.getElementById('valValence');
  const valDance = document.getElementById('valDance');
  const valAcoustic = document.getElementById('valAcoustic');

  const predPopularity = document.getElementById('predPopularity');
  const predEqSpotify = document.getElementById('predEqSpotify');
  const currentModelTag = document.getElementById('currentModelTagSpotify');
  const popLevelBadge = document.getElementById('popLevelBadge');
  const btnReset = document.getElementById('btnResetSpotify');

  const radioCards = document.querySelectorAll('.radio-card');
  let selectedModel = 'optimal';

  // Init Radar Chart for Audio Profile
  if (simChart) simChart.destroy();
  const ctx = document.getElementById('simChartCanvas');
  if (ctx) {
    simChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Energy', 'Instrumentalness', 'Valence', 'Danceability', 'Acousticness'],
        datasets: [{
          label: 'Audio Feature Profile',
          data: [0.65, 0.15, 0.55, 0.70, 0.25],
          backgroundColor: 'rgba(0, 242, 254, 0.2)',
          borderColor: '#00f2fe',
          pointBackgroundColor: '#00f2fe',
          pointBorderColor: '#fff',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.08)' },
            pointLabels: { color: '#94a3b8', font: { size: 10 } },
            suggestedMin: 0,
            suggestedMax: 1,
            ticks: { display: false }
          }
        }
      }
    });
  }

  function update() {
    const energy = parseFloat(inputEnergy.value) || 0;
    const inst = parseFloat(inputInst.value) || 0;
    const valence = parseFloat(inputValence.value) || 0;
    const dance = parseFloat(inputDance.value) || 0;
    const acoustic = parseFloat(inputAcoustic.value) || 0;

    valEnergy.textContent = energy.toFixed(2);
    valInst.textContent = inst.toFixed(2);
    valValence.textContent = valence.toFixed(2);
    valDance.textContent = dance.toFixed(2);
    valAcoustic.textContent = acoustic.toFixed(2);

    if (simChart) {
      simChart.data.datasets[0].data = [energy, inst, valence, dance, acoustic];
      simChart.update();
    }

    let pop = 0;
    let eq = '';
    if (selectedModel === 'optimal') {
      pop = 50.81 - 18.72 * energy - 14.36 * inst;
      eq = 'Popularity = 50.81 - 18.72(Energy) - 14.36(Instrumentalness)';
      currentModelTag.textContent = '🏆 Optimal Model (k=2, RMSE 18.68)';
      currentModelTag.className = 'model-tag success-chip';
    } else if (selectedModel === 'single') {
      pop = 49.32 - 21.45 * energy;
      eq = 'Popularity = 49.32 - 21.45(Energy)';
      currentModelTag.textContent = '⚡ Single Feature (k=1, RMSE 18.84)';
      currentModelTag.className = 'model-tag primary-chip';
    } else {
      pop = 52.10 - 16.54 * energy - 13.92 * inst - 8.21 * valence + 1.84 * acoustic;
      eq = 'Popularity = 52.10 - 16.54(Eng) - 13.92(Inst) - 8.21(Val) + 1.84(Acous)';
      currentModelTag.textContent = '🌐 5 Audio Model (k=5, RMSE 18.48)';
      currentModelTag.className = 'model-tag';
    }

    const clamped = Math.max(0, Math.min(100, pop));
    predPopularity.innerHTML = `${clamped.toFixed(1)} <span style="font-size: 1.5rem; color: #38bdf8;">/ 100</span>`;
    predEqSpotify.textContent = eq;

    if (clamped >= 60) {
      popLevelBadge.textContent = '🔥 爆款熱門 (Viral / Hit)';
      popLevelBadge.className = 'comp-val text-success';
    } else if (clamped >= 35) {
      popLevelBadge.textContent = '📻 主流大眾 (Mainstream)';
      popLevelBadge.className = 'comp-val text-cyan';
    } else {
      popLevelBadge.textContent = '🎧 小眾利基 (Niche / Indie)';
      popLevelBadge.className = 'comp-val text-purple';
    }
  }

  [inputEnergy, inputInst, inputValence, inputDance, inputAcoustic].forEach(el => el.addEventListener('input', update));

  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const r = card.querySelector('input[type="radio"]');
      if (r) {
        r.checked = true;
        selectedModel = r.value;
        update();
      }
    });
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      inputEnergy.value = 0.65;
      inputInst.value = 0.15;
      inputValence.value = 0.55;
      inputDance.value = 0.70;
      inputAcoustic.value = 0.25;
      update();
    });
  }

  update();
}

// ------------------------------------------------------------------------------
// 9. Render Matrix
// ------------------------------------------------------------------------------
function renderMatrix(type) {
  const isStartup = type === 'startup';
  const tbody = document.getElementById('matrixTableBody');

  if (isStartup) {
    tbody.innerHTML = `
      <tr>
        <td><strong>1. VIF</strong></td>
        <td><span class="chip chip-filter">統計檢驗</span></td>
        <td>全部（無共線性）</td>
        <td>5</td>
        <td>精確揪出膨脹係數，避免共線性陷阱</td>
        <td>無法評估與 y 的直接相關度</td>
        <td>建模前的首要共線性診斷</td>
      </tr>
      <tr>
        <td><strong>2. Backward OLS</strong></td>
        <td><span class="chip chip-wrapper">封裝法 (p-val)</span></td>
        <td>[R&D Spend]</td>
        <td>1</td>
        <td>統計學嚴謹，具有可解釋 p-value</td>
        <td>對多重共線性較敏感，易剔除潛在變數</td>
        <td>重視統計顯著性之學術或醫學回歸</td>
      </tr>
      <tr>
        <td><strong>3. RFECV</strong></td>
        <td><span class="chip chip-wrapper">封裝法 (CV)</span></td>
        <td>[R&D, Marketing]</td>
        <td>2</td>
        <td>結合 K 折交叉驗證，抗過擬合力強</td>
        <td>計算量較大，每次需反覆擬合</td>
        <td>機器學習管線自動化維度搜尋</td>
      </tr>
      <tr>
        <td><strong>4. LassoCV</strong></td>
        <td><span class="chip chip-embed">嵌入式 (L1)</span></td>
        <td>[R&D, Marketing, Admin]</td>
        <td>3</td>
        <td>係數精準收縮至 0，同時完成正則與選取</td>
        <td>高度相關變數中只會隨機挑選其一</td>
        <td>高維度特徵（p > n）稀疏建模</td>
      </tr>
      <tr class="optimal-row">
        <td><strong>5. Forward Stepwise</strong></td>
        <td><span class="chip chip-wrapper">貪婪搜尋</span></td>
        <td>[R&D, Marketing]</td>
        <td>2</td>
        <td>直觀展現特徵增加曲線，明確指出甜蜜點</td>
        <td>若特徵量極大時運算成本較高</td>
        <td><strong>新創獲利預測之首選最佳實踐 ⭐</strong></td>
      </tr>
    `;
  } else {
    tbody.innerHTML = `
      <tr>
        <td><strong>1. VIF</strong></td>
        <td><span class="chip chip-filter">統計檢驗</span></td>
        <td>energy, loudness, valence 等</td>
        <td>12</td>
        <td>快速診斷音訊物理重疊指標</td>
        <td>未考量流行度 y 之標籤關聯</td>
        <td>音訊工程特徵正交性驗證</td>
      </tr>
      <tr>
        <td><strong>2. Backward OLS</strong></td>
        <td><span class="chip chip-wrapper">封裝法 (p-val)</span></td>
        <td>7 項音訊指標</td>
        <td>7</td>
        <td>自動去除 tempo 等無顯著差異變數</td>
        <td>容易保留過多邊際顯著變數</td>
        <td>探索關鍵音樂維度顯著性</td>
      </tr>
      <tr>
        <td><strong>3. RFECV</strong></td>
        <td><span class="chip chip-wrapper">封裝法 (CV)</span></td>
        <td>9 項核心指標</td>
        <td>9</td>
        <td>5-Fold 交叉驗證嚴格把關泛化誤差</td>
        <td>計算時間長，需多次訓練模型</td>
        <td>大數據維度篩選與自動特徵裁減</td>
      </tr>
      <tr>
        <td><strong>4. LassoCV</strong></td>
        <td><span class="chip chip-embed">嵌入式 (L1)</span></td>
        <td>8 項非零指標</td>
        <td>8</td>
        <td>將 tempo, explicit 直接收縮壓縮歸零</td>
        <td>在高度相關音訊中僅挑其一</td>
        <td>高維度音樂音訊稀疏建模</td>
      </tr>
      <tr class="optimal-row">
        <td><strong>5. Forward Stepwise</strong></td>
        <td><span class="chip chip-wrapper">貪婪搜尋</span></td>
        <td>[energy, instrumentalness]</td>
        <td>2</td>
        <td><strong>最穩健抗噪</strong>：抓出主導大眾流行之核心特徵</td>
        <td>非線性關聯需搭配決策樹互補</td>
        <td><strong>Spotify 音樂流行度推論首選 ⭐</strong></td>
      </tr>
    `;
  }
}

// ------------------------------------------------------------------------------
// 10. CSV Export
// ------------------------------------------------------------------------------
function initExport() {
  const btnExport = document.getElementById('btnExportCSV');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const isStartup = currentDataset === 'startup';
      const csvData = isStartup
        ? [
            ['Number of Features', 'Selected Features', 'RMSE', 'R-squared'],
            ['1', '[R&D Spend]', '8274.868018', '0.946459'],
            ['2', '[R&D Spend, Marketing Spend]', '8198.797191', '0.947439'],
            ['3', '[R&D Spend, Marketing Spend, State_New York]', '8309.059683', '0.946015'],
            ['4', '[R&D Spend, Marketing Spend, State_New York, State_Florida]', '8409.916714', '0.944697'],
            ['5', '[R&D Spend, Marketing Spend, State_New York, State_Florida, State_California]', '9137.990153', '0.934707']
          ]
        : [
            ['Number of Features', 'Selected Features', 'RMSE', 'R-squared'],
            ['1', '[energy]', '18.843102', '0.153736'],
            ['2', '[energy, instrumentalness]', '18.685514', '0.167832'],
            ['3', '[energy, instrumentalness, valence]', '18.578383', '0.177347'],
            ['4', '[energy, instrumentalness, valence, mode]', '18.525232', '0.182047'],
            ['5', '[energy, instrumentalness, valence, mode, acousticness]', '18.484290', '0.185659']
          ];

      const csvContent = csvData.map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${isStartup ? '50_startups' : 'spotify_tracks'}_feature_selection_results.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
