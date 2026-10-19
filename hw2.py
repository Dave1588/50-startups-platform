import numpy as np
import pandas as pd
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression, LassoCV
from sklearn.feature_selection import RFECV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import matplotlib.pyplot as plt

# ==============================================================================
# PHASE 1: BUSINESS UNDERSTANDING
# ==============================================================================
# 專案目標：
# Spotify 音樂流行度預測 (Spotify Tracks Popularity Prediction)
# 特徵數量：20 個欄位（涵蓋音訊指標、音樂結構與發行資訊）
# 預測目標：音樂流行度分數 (popularity，0 到 100 分)
# 業務核心問題：探討舞蹈指數 (danceability)、能量 (energy)、響度 (loudness)、
# 樂器成分 (instrumentalness)、語音佔比 (speechiness)、正向度 (valence) 與節奏 (tempo)
# 等多維度音訊特徵對歌曲受歡迎程度的線性驅動影響，透過 5 大特徵選取演算法找出最佳音訊組合。

# ==============================================================================
# PHASE 2: DATA UNDERSTANDING
# ==============================================================================
print("=" * 70)
print("PHASE 2: DATA UNDERSTANDING - SPOTIFY TRACKS DATASET")
print("=" * 70)

url = "https://huggingface.co/datasets/maharshipandya/spotify-tracks-dataset/resolve/main/dataset.csv"
try:
    # 讀取代表性樣本資料集（加速特徵選擇與交叉驗證運算）
    df = pd.read_csv(url, nrows=2500)
    print("成功從線上載入 Spotify Tracks Dataset！")
except Exception as e:
    print(f"線上載入失敗 ({e})，使用內建代表性音訊數據集：")
    np.random.seed(42)
    n = 2000
    df = pd.DataFrame({
        'popularity': np.random.randint(0, 100, n),
        'duration_ms': np.random.randint(120000, 360000, n),
        'explicit': np.random.choice([0.0, 1.0], n),
        'danceability': np.random.uniform(0.1, 0.95, n),
        'energy': np.random.uniform(0.1, 0.95, n),
        'key': np.random.randint(0, 12, n),
        'loudness': np.random.uniform(-25, 0, n),
        'mode': np.random.choice([0.0, 1.0], n),
        'speechiness': np.random.uniform(0.02, 0.5, n),
        'acousticness': np.random.uniform(0.0, 0.95, n),
        'instrumentalness': np.random.uniform(0.0, 0.95, n),
        'liveness': np.random.uniform(0.05, 0.8, n),
        'valence': np.random.uniform(0.05, 0.95, n),
        'tempo': np.random.uniform(60, 200, n),
        'time_signature': np.random.choice([3, 4, 5], n)
    })

print(f"Dataset shape: {df.shape}")
print(f"Total columns ({len(df.columns)}): {list(df.columns)}")
print("\nFirst 5 rows (Features overview):")
print(df[['popularity', 'danceability', 'energy', 'loudness', 'valence', 'tempo']].head())
print("\nMissing values:")
print(df.isnull().sum()[df.isnull().sum() > 0])

# ==============================================================================
# PHASE 3: DATA PREPARATION & FEATURE SELECTION
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 3: DATA PREPARATION & FEATURE SELECTION")
print("=" * 70)

# 篩選適合線性回歸預測的音訊指標特徵
audio_feature_candidates = [
    'danceability', 'energy', 'loudness', 'speechiness',
    'acousticness', 'instrumentalness', 'liveness', 'valence',
    'tempo', 'duration_ms', 'explicit', 'mode'
]

# 確保欄位存在並轉型
available_features = [col for col in audio_feature_candidates if col in df.columns]
for col in ['explicit', 'mode']:
    if col in df.columns:
        df[col] = df[col].astype(float)

X = df[available_features].dropna()
y = df.loc[X.index, 'popularity']
feature_names = X.columns.tolist()

print(f"Selected Candidate Features ({len(feature_names)}): {feature_names}\n")

# ------------------------------------------------------------------------------
# Feature Selection 1: Variance Inflation Factor (VIF)
# ------------------------------------------------------------------------------
print("--- 1. Variance Inflation Factor (VIF) ---")
X_const = sm.add_constant(X)
vif_df = pd.DataFrame({
    "Feature": X_const.columns,
    "VIF": [variance_inflation_factor(X_const.values, i) for i in range(X_const.shape[1])]
})
print(vif_df.to_string(index=False))

# ------------------------------------------------------------------------------
# Feature Selection 2: Backward Elimination (OLS p-values, threshold = 0.05)
# ------------------------------------------------------------------------------
print("\n--- 2. Backward Elimination (OLS, sl = 0.05) ---")
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
            print(f"Dropped: {excluded:<20} | Max p-value: {max_p:.4f}")
        else:
            break
    return features, model_ols

selected_be, final_ols = backward_elimination(X, y, sl=0.05)
print(f"Backward Elimination Selected Features: {selected_be}")

# ------------------------------------------------------------------------------
# Feature Selection 3: Recursive Feature Elimination with Cross-Validation (RFECV)
# ------------------------------------------------------------------------------
print("\n--- 3. RFECV (5-Fold Cross-Validation) ---")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

rfecv = RFECV(
    estimator=LinearRegression(),
    step=1,
    cv=5,
    scoring="neg_root_mean_squared_error",
    min_features_to_select=1
)
rfecv.fit(X_scaled, y)

selected_rfecv = [name for name, selected in zip(feature_names, rfecv.support_) if selected]
print(f"Optimal feature count: {rfecv.n_features_}")
print(f"RFECV Selected Features: {selected_rfecv}")
ranking_df = pd.DataFrame({"Feature": feature_names, "Rank": rfecv.ranking_})
print(ranking_df.sort_values(by="Rank").to_string(index=False))

# ------------------------------------------------------------------------------
# Feature Selection 4: Lasso (L1 Regularization)
# ------------------------------------------------------------------------------
print("\n--- 4. LassoCV (L1 Regularization) ---")
lasso = LassoCV(cv=5, random_state=42)
lasso.fit(X_scaled, y)

lasso_df = pd.DataFrame({
    "Feature": feature_names,
    "Standardized_Coefficient": lasso.coef_
}).sort_values(by="Standardized_Coefficient", ascending=False)
print(lasso_df.to_string(index=False))
selected_lasso = lasso_df[lasso_df["Standardized_Coefficient"] != 0]["Feature"].tolist()
print(f"Lasso Selected Features (non-zero coefficients): {selected_lasso}")

# ==============================================================================
# PHASE 4: MODELING (FORWARD STEPWISE SELECTION)
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 4: MODELING (FORWARD STEPWISE SELECTION)")
print("=" * 70)

# 切分訓練集與測試集 (80% train, 20% test, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 前向逐步篩選評估（1 到 5 個特徵）
selected_features = []
remaining_features = list(X.columns)
history = []

for k in range(1, 6):
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
    
    history.append({
        'Number of Features': k,
        'Selected Features': '[' + ', '.join(selected_features) + ']',
        'RMSE': best_rmse,
        'R-squared': best_r2
    })

res_df = pd.DataFrame(history)

# 訓練最終最佳代表性線性回歸模型
optimal_features = eval(history[1]['Selected Features'].replace('[', "['").replace(']', "']").replace(', ', "', '"))
model_selected = LinearRegression().fit(X_train[optimal_features], y_train)

# ==============================================================================
# PHASE 5: EVALUATION
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 5: EVALUATION")
print("=" * 70)

# 評估表格
res_table = res_df.copy()
res_table['RMSE'] = res_table['RMSE'].map('{:.6f}'.format)
res_table['R-squared'] = res_table['R-squared'].map('{:.6f}'.format)
print(res_table.to_string(index=False))

# 繪製並排評估圖表 (RMSE by Features & R-squared by Features)
fig, axes = plt.subplots(1, 2, figsize=(10, 4.5))

# Plot 1: RMSE by Number of Features
axes[0].plot(res_df['Number of Features'], res_df['RMSE'], marker='o', color='#38bdf8', linewidth=2)
axes[0].set_title('RMSE by Number of Features')
axes[0].set_xlabel('Number of Features')
axes[0].set_ylabel('RMSE')
axes[0].grid(True, linestyle="--", alpha=0.5)

# Plot 2: R-squared by Number of Features
axes[1].plot(res_df['Number of Features'], res_df['R-squared'], marker='o', color='#00f2fe', linewidth=2)
axes[1].set_title('R-squared by Number of Features')
axes[1].set_xlabel('Number of Features')
axes[1].set_ylabel('R-squared')
axes[1].grid(True, linestyle="--", alpha=0.5)

plt.tight_layout()
plt.show()

# ==============================================================================
# PHASE 6: DEPLOYMENT
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 6: DEPLOYMENT")
print("=" * 70)

def predict_track_popularity(audio_inputs: dict) -> dict:
    """Production inference endpoint to predict Spotify track popularity score (0-100)."""
    input_data = {}
    for feat in optimal_features:
        if feat in audio_inputs:
            input_data[feat] = [float(audio_inputs[feat])]
        else:
            input_data[feat] = [float(X[feat].mean())]
            
    input_df = pd.DataFrame(input_data)
    prediction = model_selected.predict(input_df)[0]
    
    # 限制流行度在 0 到 100 分之內
    clamped_pred = max(0.0, min(100.0, float(prediction)))
    
    return {
        "predicted_popularity": round(clamped_pred, 2),
        "model_features_used": optimal_features,
        "intercept": round(float(model_selected.intercept_), 4)
    }

# 範例測試預測
sample_track = {
    "valence": 0.65,
    "acousticness": 0.20,
    "danceability": 0.72,
    "energy": 0.85,
    "loudness": -5.2
}
inference_result = predict_track_popularity(sample_track)
print(f"Sample Track Audio Inputs: {sample_track}")
print(f"Predicted Popularity (0-100): {inference_result['predicted_popularity']}")
print(f"Deployment Result: {inference_result}")
