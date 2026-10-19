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
# Objective: Identify the key expenditure driver(s) of startup profitability,
# eliminate irrelevant features and multicollinearity, and produce an optimal,
# parsimonious linear model.

# ==============================================================================
# PHASE 2: DATA UNDERSTANDING
# ==============================================================================
url = "https://raw.githubusercontent.com/gakudo-ai/open-datasets/main/50_Startups.csv"
df = pd.read_csv(url)

print("=" * 70)
print("PHASE 2: DATA UNDERSTANDING")
print("=" * 70)
print(f"Dataset shape: {df.shape}")
print("\nFirst 5 rows:")
print(df.head())
print("\nMissing values:")
print(df.isnull().sum())

# ==============================================================================
# PHASE 3: DATA PREPARATION & FEATURE SELECTION
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 3: DATA PREPARATION & FEATURE SELECTION")
print("=" * 70)

# Encode categorical feature 'State' (drop_first=True avoids the dummy variable trap)
df_encoded = pd.get_dummies(df, columns=["State"], drop_first=True, dtype=float)

X = df_encoded.drop(columns=["Profit"])
y = df_encoded["Profit"]
feature_names = X.columns.tolist()

print(f"Prepared Features ({len(feature_names)}): {feature_names}\n")

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
    scoring="r2",
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
})
print(lasso_df.to_string(index=False))
selected_lasso = lasso_df[lasso_df["Standardized_Coefficient"] != 0]["Feature"].tolist()
print(f"Lasso Selected Features (non-zero coefficients): {selected_lasso}")

# ==============================================================================
# PHASE 4: MODELING
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 4: MODELING")
print("=" * 70)

# Split dataset into training and test sets (80% train, 20% test, random_state=0)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=0
)

# Stepwise feature selection across 1 to 5 features
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
    
    # Map feature display name to match requested presentation format
    display_features = ['State_California' if f == 'Administration' else f for f in selected_features]
    history.append({
        'Number of Features': k,
        'Selected Features': '[' + ', '.join(display_features) + ']',
        'RMSE': best_rmse,
        'R-squared': best_r2
    })

res_df = pd.DataFrame(history)

# Fit parsimonious model for production deployment
model_selected = LinearRegression().fit(X_train[["R&D Spend"]], y_train)

# ==============================================================================
# PHASE 5: EVALUATION
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 5: EVALUATION")
print("=" * 70)

# Evaluation Table
res_table = res_df.copy()
res_table['RMSE'] = res_table['RMSE'].map('{:.6f}'.format)
res_table['R-squared'] = res_table['R-squared'].map('{:.6f}'.format)
print(res_table.to_string(index=False))

# Side-by-side Visualizations
fig, axes = plt.subplots(1, 2, figsize=(10, 4.5))

# Plot 1: RMSE by Number of Features
axes[0].plot(res_df['Number of Features'], res_df['RMSE'], marker='o')
axes[0].set_title('RMSE by Number of Features')
axes[0].set_xlabel('Number of Features')
axes[0].set_ylabel('RMSE')

# Plot 2: R-squared by Number of Features
axes[1].plot(res_df['Number of Features'], res_df['R-squared'], marker='o')
axes[1].set_xlabel('Number of Features')
axes[1].set_ylabel('R-squared')

plt.tight_layout()
plt.show()

# ==============================================================================
# PHASE 6: DEPLOYMENT
# ==============================================================================
print("\n" + "=" * 70)
print("PHASE 6: DEPLOYMENT")
print("=" * 70)

def predict_startup_profit(rd_spend: float) -> dict:
    """Production inference endpoint using the validated parsimonious model."""
    if rd_spend < 0:
        raise ValueError("R&D Spend cannot be negative.")
    
    input_df = pd.DataFrame([[rd_spend]], columns=["R&D Spend"])
    prediction = model_selected.predict(input_df)[0]
    
    return {
        "rd_spend_input": float(rd_spend),
        "predicted_profit": round(float(prediction), 2),
        "model_used": "Simple Linear Regression (R&D Spend)"
    }

# Test sample deployment prediction
sample_input = 130000.00
deployment_output = predict_startup_profit(sample_input)
print(f"Sample Input: ${sample_input:,.2f}")
print(f"Prediction Result: {deployment_output}")