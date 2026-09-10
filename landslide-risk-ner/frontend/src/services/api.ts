import axios from 'axios';
import {
  LocationItem,
  AlertItem,
  PredictRequestPayload,
  PredictResponsePayload,
  LocationHistoryResponse,
  LocationDetailResponse
} from '../types';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCurrentRisk = async (): Promise<LocationItem[]> => {
  const res = await api.get<LocationItem[]>('/risk/current');
  return res.data;
};

export const fetchLocations = async () => {
  const res = await api.get('/locations');
  return res.data;
};

export const fetchLocationDetail = async (id: number): Promise<LocationDetailResponse> => {
  const res = await api.get<LocationDetailResponse>(`/locations/${id}`);
  return res.data;
};

export const fetchLocationHistory = async (id: number, days = 14): Promise<LocationHistoryResponse> => {
  const res = await api.get<LocationHistoryResponse>(`/history/${id}?days=${days}`);
  return res.data;
};

export const fetchAlerts = async (severity?: string): Promise<AlertItem[]> => {
  const url = severity ? `/alerts?severity=${severity}` : '/alerts';
  const res = await api.get<AlertItem[]>(url);
  return res.data;
};

export const triggerManualAlert = async (payload: {
  location_id: number;
  severity: string;
  message?: string;
  sent_to?: string;
}): Promise<AlertItem> => {
  const res = await api.post<AlertItem>('/alerts/trigger', payload);
  return res.data;
};

export const runPredictInference = async (
  payload: PredictRequestPayload
): Promise<PredictResponsePayload> => {
  const res = await api.post<PredictResponsePayload>('/risk/predict', payload);
  return res.data;
};

export const createNewLocation = async (payload: {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation: number;
  slope_angle: number;
}) => {
  const res = await api.post('/locations', payload);
  return res.data;
};

export default api;
