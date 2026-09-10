"""
ML Model Trainer for SIH26001: AI-Based Landslide Risk Monitoring System (NER)
Trains XGBoost Regressor model on synthetic terrain and weather data.
Saves model artifacts, scaler, feature importances, and evaluation metrics.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score, accuracy_score, f1_score
from xgboost import XGBRegressor

def train_and_evaluate_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "synthetic_landslide_dataset.csv")

    if not os.path.exists(dataset_path):
        from data_generator import generate_synthetic_data
        df = generate_synthetic_data()
    else:
        df = pd.read_csv(dataset_path)

    feature_cols = [
        "rainfall_24h",
        "rainfall_cumulative_3d",
        "rainfall_intensity_trend",
        "soil_moisture_pct",
        "slope_angle",
        "elevation",
        "seismic_activity"
    ]

    target_col = "risk_score"

    X = df[feature_cols]
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Training XGBoost Regressor Model...")
    model = XGBRegressor(
        n_estimators=150,
        learning_rate=0.08,
        max_depth=5,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    model.fit(X_train_scaled, y_train)

    # Make predictions
    y_pred = model.predict(X_test_scaled)
    y_pred = np.clip(y_pred, 0.0, 100.0)

    # Continuous evaluation metrics
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    mae = float(mean_absolute_error(y_test, y_pred))
    r2 = float(r2_score(y_test, y_pred))

    # Category evaluation
    def get_cat(val):
        if val <= 25.0: return "Low"
        elif val <= 50.0: return "Moderate"
        elif val <= 75.0: return "High"
        else: return "Critical"

    y_test_cats = [get_cat(val) for val in y_test]
    y_pred_cats = [get_cat(val) for val in y_pred]

    acc = float(accuracy_score(y_test_cats, y_pred_cats))
    f1_macro = float(f1_score(y_test_cats, y_pred_cats, average="macro"))

    print("\n--- Model Evaluation Results ---")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE:  {mae:.4f}")
    print(f"R² Score: {r2:.4f}")
    print(f"Category Accuracy: {acc * 100:.2f}%")
    print(f"Category Macro F1: {f1_macro:.4f}")

    # Feature Importance
    importances = model.feature_importances_
    feat_imp = {col: round(float(imp), 4) for col, imp in zip(feature_cols, importances)}
    print("\nFeature Importances:")
    for k, v in sorted(feat_imp.items(), key=lambda item: item[1], reverse=True):
        print(f"  {k}: {v * 100:.2f}%")

    # Save Artifacts
    artifacts_dir = os.path.join(current_dir, "model_artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    model_path = os.path.join(artifacts_dir, "landslide_model.pkl")
    scaler_path = os.path.join(artifacts_dir, "scaler.pkl")
    metadata_path = os.path.join(artifacts_dir, "model_metadata.json")

    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)

    metadata = {
        "model_type": "XGBRegressor",
        "features": feature_cols,
        "metrics": {
            "rmse": rmse,
            "mae": mae,
            "r2": r2,
            "accuracy": acc,
            "f1_macro": f1_macro
        },
        "feature_importances": feat_imp,
        "version": "1.0.0"
    }

    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nModel artifacts successfully saved to {artifacts_dir}")
    return metadata

if __name__ == "__main__":
    train_and_evaluate_model()
