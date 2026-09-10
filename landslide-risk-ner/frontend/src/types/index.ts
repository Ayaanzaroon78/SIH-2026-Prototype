export type RiskCategory = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface LocationItem {
  location_id: number;
  location_name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation: number;
  slope_angle: number;
  risk_score: number;
  risk_category: RiskCategory;
  contributing_factors: Record<string, number>;
  last_updated: string;
  telemetry: {
    rainfall_24h: number;
    rainfall_cumulative_3d: number;
    soil_moisture_pct: number;
    seismic_activity: number;
  };
}

export interface LocationDetailResponse {
  location: {
    id: number;
    name: string;
    district: string;
    state: string;
    latitude: number;
    longitude: number;
    elevation: number;
    slope_angle: number;
    current_risk_score: number;
    current_risk_category: RiskCategory;
    last_updated: string;
  };
  readings: Array<{
    id: number;
    timestamp: string;
    rainfall_24h: number;
    rainfall_cumulative_3d: number;
    rainfall_intensity_trend: number;
    soil_moisture_pct: number;
    temperature_c: number;
    humidity_pct: number;
    seismic_activity: number;
  }>;
  predictions: Array<{
    id: number;
    timestamp: string;
    risk_score: number;
    risk_category: RiskCategory;
    contributing_factors: Record<string, number>;
  }>;
}

export interface AlertItem {
  id: number;
  location_id: number;
  location_name: string;
  district: string;
  state: string;
  risk_prediction_id?: number;
  severity: RiskCategory;
  message: string;
  sent_to: string;
  status: string;
  created_at: string;
}

export interface PredictRequestPayload {
  location_id?: number;
  rainfall_24h: number;
  rainfall_cumulative_3d: number;
  rainfall_intensity_trend: number;
  soil_moisture_pct: number;
  slope_angle: number;
  elevation: number;
  seismic_activity: number;
}

export interface PredictResponsePayload {
  location_id?: number;
  location_name?: string;
  timestamp: string;
  risk_score: number;
  risk_category: RiskCategory;
  model_version: string;
  contributing_factors: Record<string, number>;
}

export interface TimeSeriesItem {
  timestamp: string;
  date: string;
  rainfall_24h: number;
  rainfall_cumulative_3d: number;
  soil_moisture_pct: number;
  temperature_c: number;
  seismic_activity: number;
  risk_score?: number;
  risk_category?: RiskCategory;
}

export interface LocationHistoryResponse {
  location_id: number;
  name: string;
  district: string;
  state: string;
  elevation: number;
  slope_angle: number;
  time_series: TimeSeriesItem[];
}
