import os
import json
import joblib
import numpy as np
from app.core.config import settings

class MLRiskEngine:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.metadata = None
        self.model_version = "1.0.0"
        self._load_artifacts()

    def _load_artifacts(self):
        model_dir = settings.MODEL_DIR
        model_path = os.path.join(model_dir, "landslide_model.pkl")
        scaler_path = os.path.join(model_dir, "scaler.pkl")
        metadata_path = os.path.join(model_dir, "model_metadata.json")

        if os.path.exists(model_path) and os.path.exists(scaler_path):
            try:
                self.model = joblib.load(model_path)
                self.scaler = joblib.load(scaler_path)
                if os.path.exists(metadata_path):
                    with open(metadata_path, "r") as f:
                        self.metadata = json.load(f)
                print(f"[ML Engine] Model artifacts successfully loaded from {model_dir}")
            except Exception as e:
                print(f"[ML Engine] Failed loading artifacts ({e}), using fallback physics score.")
        else:
            print(f"[ML Engine] Artifacts not found at {model_dir}, using fallback model.")

    def get_category(self, score: float) -> str:
        if score <= settings.RISK_THRESHOLD_MODERATE:
            return "Low"
        elif score <= settings.RISK_THRESHOLD_HIGH:
            return "Moderate"
        elif score <= settings.RISK_THRESHOLD_CRITICAL:
            return "High"
        else:
            return "Critical"

    def predict(self, rainfall_24h: float, rainfall_cumulative_3d: float, rainfall_intensity_trend: float,
                soil_moisture_pct: float, slope_angle: float, elevation: float, seismic_activity: float) -> dict:

        features = [
            rainfall_24h,
            rainfall_cumulative_3d,
            rainfall_intensity_trend,
            soil_moisture_pct,
            slope_angle,
            elevation,
            seismic_activity
        ]

        feature_names = [
            "rainfall_24h",
            "rainfall_cumulative_3d",
            "rainfall_intensity_trend",
            "soil_moisture_pct",
            "slope_angle",
            "elevation",
            "seismic_activity"
        ]

        if self.model is not None and self.scaler is not None:
            try:
                import pandas as pd
                df_feats = pd.DataFrame([features], columns=feature_names)
                scaled_feats = self.scaler.transform(df_feats)
                raw_pred = self.model.predict(scaled_feats)[0]
                risk_score = round(float(np.clip(raw_pred, 0.0, 100.0)), 2)

                # Calculate instance feature importances (weighted contribution)
                if hasattr(self.model, "feature_importances_"):
                    importances = self.model.feature_importances_
                else:
                    importances = [0.14] * 7

                total_weight = sum(importances)
                factors = {
                    name: round(float(imp / total_weight * 100.0), 2)
                    for name, imp in zip(feature_names, importances)
                }

                category = self.get_category(risk_score)
                return {
                    "risk_score": risk_score,
                    "risk_category": category,
                    "model_version": self.model_version,
                    "contributing_factors": factors
                }
            except Exception as e:
                print(f"[ML Engine] Inference error ({e}), falling back to domain formula.")

        # Fallback Heuristic Physics Formula
        slope_f = min(30.0, (slope_angle / 50.0) ** 1.8 * 30.0)
        soil_f = min(25.0, (soil_moisture_pct / 100.0) ** 2.2 * 25.0)
        rain_24_f = min(15.0, (rainfall_24h / 150.0) * 15.0)
        rain_3d_f = min(15.0, (rainfall_cumulative_3d / 300.0) * 15.0)
        trend_f = min(8.0, max(0.0, (rainfall_intensity_trend - 0.3) * 10.0))
        seismic_f = min(12.0, (seismic_activity / 4.0) ** 1.5 * 12.0)
        elev_f = min(5.0, (elevation / 3000.0) * 5.0)

        score = round(float(np.clip(slope_f + soil_f + rain_24_f + rain_3d_f + trend_f + seismic_f + elev_f, 0.0, 100.0)), 2)
        category = self.get_category(score)

        factors = {
            "soil_moisture_pct": round(soil_f / (score + 0.1) * 100.0, 2),
            "slope_angle": round(slope_f / (score + 0.1) * 100.0, 2),
            "rainfall_cumulative_3d": round(rain_3d_f / (score + 0.1) * 100.0, 2),
            "rainfall_24h": round(rain_24_f / (score + 0.1) * 100.0, 2),
            "seismic_activity": round(seismic_f / (score + 0.1) * 100.0, 2),
            "elevation": round(elev_f / (score + 0.1) * 100.0, 2),
            "rainfall_intensity_trend": round(trend_f / (score + 0.1) * 100.0, 2)
        }

        return {
            "risk_score": score,
            "risk_category": category,
            "model_version": "1.0.0-fallback",
            "contributing_factors": factors
        }

ml_engine = MLRiskEngine()
