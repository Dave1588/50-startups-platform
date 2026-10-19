// ==============================================================================
// 50 STARTUPS FEATURE SELECTION PLATFORM - INTERACTIVE JAVASCRIPT
// Charts, Tab Switching, Interactive Regression Simulator, and CSV Export
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  initTabs();
  initSimulator();
  initExport();
});

// ------------------------------------------------------------------------------
// 1. Chart.js Initializations
// ------------------------------------------------------------------------------
let rmseChart, r2Chart, vifChart, beChart, rfecvChart, lassoChart, doughnutChart;

function initCharts() {
  const commonFont = { family: "'Inter', sans-serif", size: 11 };
  const gridColor = 'rgba(255, 255, 255, 0.06)';
  const tickColor = '#94a3b8';

  // --- Chart 1: RMSE by Number of Features (Exact Match to User's Screenshot) ---
  const ctxRMSE = document.getElementById('rmseChart');
  if (ctxRMSE) {
    rmseChart = new Chart(ctxRMSE, {
      type: 'line',
      data: {
        labels: ['1.0', '2.0', '3.0', '4.0', '5.0'],
        datasets: [{
          label: 'RMSE ($)',
          data: [8274.868018, 8198.797191, 8309.059683, 8409.916714, 9137.990153],
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
              label: (context) => `RMSE: $${context.raw.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Number of Features',
              color: '#cbd5e1',
              font: { weight: 'bold', size: 12 }
            },
            grid: { color: gridColor },
            ticks: { color: tickColor, font: commonFont }
          },
          y: {
            title: {
              display: true,
              text: 'RMSE',
              color: '#cbd5e1',
              font: { weight: 'bold', size: 12 }
            },
            min: 8100,
            max: 9200,
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: commonFont,
              callback: (val) => val
            }
          }
        }
      }
    });
  }

  // --- Chart 2: R-squared by Number of Features (Exact Match to User's Screenshot) ---
  const ctxR2 = document.getElementById('r2Chart');
  if (ctxR2) {
    r2Chart = new Chart(ctxR2, {
      type: 'line',
      data: {
        labels: ['1.0', '2.0', '3.0', '4.0', '5.0'],
        datasets: [{
          label: 'R-squared',
          data: [0.946459, 0.947439, 0.946015, 0.944697, 0.934707],
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
              label: (context) => `R² Score: ${context.raw.toFixed(6)}`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Number of Features',
              color: '#cbd5e1',
              font: { weight: 'bold', size: 12 }
            },
            grid: { color: gridColor },
            ticks: { color: tickColor, font: commonFont }
          },
          y: {
            title: {
              display: true,
              text: 'R-squared',
              color: '#cbd5e1',
              font: { weight: 'bold', size: 12 }
            },
            min: 0.934,
            max: 0.948,
            grid: { color: gridColor },
            ticks: {
              color: tickColor,
              font: commonFont,
              stepSize: 0.002,
              callback: (val) => val.toFixed(3)
            }
          }
        }
      }
    });
  }

  // --- Chart 3: VIF Bar Chart ---
  const ctxVIF = document.getElementById('vifChart');
  if (ctxVIF) {
    vifChart = new Chart(ctxVIF, {
      type: 'bar',
      data: {
        labels: ['R&D Spend', 'Marketing Spend', 'State_Florida', 'State_New York', 'Administration'],
        datasets: [{
          label: 'VIF Value',
          data: [2.50, 2.42, 1.39, 1.34, 1.18],
          backgroundColor: [
            'rgba(0, 242, 254, 0.7)',
            'rgba(56, 189, 248, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(16, 185, 129, 0.7)'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: tickColor, font: commonFont }, grid: { display: false } },
          y: {
            ticks: { color: tickColor, font: commonFont },
            grid: { color: gridColor },
            max: 5,
            title: { display: true, text: 'VIF (< 5 為健康)', color: '#94a3b8' }
          }
        }
      }
    });
  }

  // --- Chart 4: Backward Elimination p-values ---
  const ctxBE = document.getElementById('beChart');
  if (ctxBE) {
    beChart = new Chart(ctxBE, {
      type: 'bar',
      data: {
        labels: ['State_NY (S1)', 'State_FL (S2)', 'Admin (S3)', 'Marketing (S4)', 'R&D Spend (Keep)'],
        datasets: [{
          label: 'OLS p-value',
          data: [0.9898, 0.9398, 0.6018, 0.0600, 0.00001],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)'
          ],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: tickColor, font: commonFont }, grid: { display: false } },
          y: {
            ticks: { color: tickColor, font: commonFont },
            grid: { color: gridColor },
            max: 1.0,
            title: { display: true, text: 'p-value (門檻 α = 0.05)', color: '#94a3b8' }
          }
        }
      }
    });
  }

  // --- Chart 5: RFECV Curve ---
  const ctxRFECV = document.getElementById('rfecvChart');
  if (ctxRFECV) {
    rfecvChart = new Chart(ctxRFECV, {
      type: 'line',
      data: {
        labels: ['1', '2 (Optimal)', '3', '4', '5'],
        datasets: [{
          label: '5-Fold CV Score (R²)',
          data: [0.938, 0.948, 0.941, 0.935, 0.920],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          pointBackgroundColor: '#10b981',
          pointRadius: 6,
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
          y: { ticks: { color: tickColor, font: commonFont }, grid: { color: gridColor }, min: 0.91 }
        }
      }
    });
  }

  // --- Chart 6: Lasso Coefficients ---
  const ctxLasso = document.getElementById('lassoChart');
  if (ctxLasso) {
    lassoChart = new Chart(ctxLasso, {
      type: 'bar',
      data: {
        labels: ['R&D Spend', 'Marketing Spend', 'Admin', 'State_FL', 'State_NY'],
        datasets: [{
          label: '標準化回歸係數',
          data: [36030.42, 3290.32, -156.89, 0, 0],
          backgroundColor: [
            'rgba(0, 242, 254, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(100, 116, 139, 0.4)',
            'rgba(100, 116, 139, 0.4)'
          ],
          borderRadius: 6
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

  // --- Chart 7: Expenditure Doughnut ---
  const ctxDoughnut = document.getElementById('doughnutChart');
  if (ctxDoughnut) {
    doughnutChart = new Chart(ctxDoughnut, {
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
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', font: commonFont, boxWidth: 12 }
          }
        }
      }
    });
  }
}

// ------------------------------------------------------------------------------
// 2. Tab Navigation Logic
// ------------------------------------------------------------------------------
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// ------------------------------------------------------------------------------
// 3. Live Profit Simulator Logic
// ------------------------------------------------------------------------------
function initSimulator() {
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

  function updatePrediction() {
    const rd = parseFloat(inputRD.value) || 0;
    const marketing = parseFloat(inputMarketing.value) || 0;
    const admin = parseFloat(inputAdmin.value) || 0;
    const state = selectState.value;

    // Display formatted badges
    valRD.textContent = `$${rd.toLocaleString()}`;
    valMarketing.textContent = `$${marketing.toLocaleString()}`;
    valAdmin.textContent = `$${admin.toLocaleString()}`;

    // Update Doughnut Chart data
    if (doughnutChart) {
      doughnutChart.data.datasets[0].data = [rd, marketing, admin];
      doughnutChart.update();
    }

    let profit = 0;
    let equationText = '';

    // Mathematically fitted equations from 50 Startups dataset (train split):
    if (selectedModel === 'optimal') {
      // Model 2: Optimal (R&D + Marketing)
      profit = 0.788618 * rd + 0.032577 * marketing + 46346.34;
      equationText = `Profit = 0.7886 × (R&D) + 0.0326 × (Marketing) + $46,346.34`;
      currentModelTag.textContent = '🏆 Optimal Model (k=2, RMSE $8,198)';
      currentModelTag.className = 'model-tag success-chip';
    } else if (selectedModel === 'parsimonious') {
      // Model 1: Parsimonious (R&D only)
      profit = 0.851623 * rd + 48416.30;
      equationText = `Profit = 0.8516 × (R&D) + $48,416.30`;
      currentModelTag.textContent = '⚡ Parsimonious Model (k=1, RMSE $8,274)';
      currentModelTag.className = 'model-tag primary-chip';
    } else {
      // Model 5: Full 5-feature Model
      const isFL = state === 'Florida' ? 1 : 0;
      const isNY = state === 'New York' ? 1 : 0;
      profit = 0.773467 * rd + 0.032885 * admin + 0.036610 * marketing - 959.28 * isFL + 699.37 * isNY + 42554.17;
      equationText = `Profit = 0.7735(R&D) + 0.0329(Admin) + 0.0366(Mkt) + Geo + $42,554.17`;
      currentModelTag.textContent = '🌐 Full Model (k=5, RMSE $9,137)';
      currentModelTag.className = 'model-tag';
    }

    // Number animation / formatting
    predProfit.textContent = `$${Math.round(profit).toLocaleString()}`;
    predEquation.textContent = equationText;
  }

  // Event Listeners for inputs
  [inputRD, inputMarketing, inputAdmin, selectState].forEach(el => {
    el.addEventListener('input', updatePrediction);
  });

  // Radio cards switcher
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedModel = radio.value;
        updatePrediction();
      }
    });
  });

  // Reset Button
  if (btnResetInputs) {
    btnResetInputs.addEventListener('click', () => {
      inputRD.value = 130000;
      inputMarketing.value = 250000;
      inputAdmin.value = 120000;
      selectState.value = 'New York';
      updatePrediction();
    });
  }

  // Initial calculation
  updatePrediction();
}

// ------------------------------------------------------------------------------
// 4. CSV Export Feature
// ------------------------------------------------------------------------------
function initExport() {
  const btnExport = document.getElementById('btnExportCSV');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const csvContent = [
        ['Number of Features', 'Selected Features', 'RMSE', 'R-squared'],
        ['1', '[R&D Spend]', '8274.868018', '0.946459'],
        ['2', '[R&D Spend, Marketing Spend]', '8198.797191', '0.947439'],
        ['3', '[R&D Spend, Marketing Spend, State_New York]', '8309.059683', '0.946015'],
        ['4', '[R&D Spend, Marketing Spend, State_New York, State_Florida]', '8409.916714', '0.944697'],
        ['5', '[R&D Spend, Marketing Spend, State_New York, State_Florida, State_California]', '9137.990153', '0.934707']
      ].map(e => e.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', '50_startups_feature_selection_results.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
