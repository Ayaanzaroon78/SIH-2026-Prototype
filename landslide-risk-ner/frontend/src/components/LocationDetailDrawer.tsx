import React, { useEffect, useState } from 'react';
import { LocationItem, LocationHistoryResponse } from '../types';
import { fetchLocationHistory, triggerManualAlert } from '../services/api';
import { X, CloudRain, Droplets, Mountain, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LocationDetailDrawerProps {
  location: LocationItem | null;
  onClose: () => void;
  onAlertTriggered: () => void;
}

export const LocationDetailDrawer: React.FC<LocationDetailDrawerProps> = ({
  location,
  onClose,
  onAlertTriggered,
}) => {
  const [historyData, setHistoryData] = useState<LocationHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertSending, setAlertSending] = useState(false);
  const [alertSentSuccess, setAlertSentSuccess] = useState(false);

  useEffect(() => {
    if (location) {
      setLoading(true);
      setAlertSentSuccess(false);
      fetchLocationHistory(location.location_id)
        .then((res) => setHistoryData(res))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [location]);

  if (!location) return null;

  const handleSendManualAlert = async () => {
    setAlertSending(true);
    try {
      await triggerManualAlert({
        location_id: location.location_id,
        severity: location.risk_category === 'Critical' ? 'Critical' : 'High',
        message: `EMERGENCY ALERT: Elevated landslide risk detected at ${location.location_name} (${location.district}, ${location.state}). Score: ${location.risk_score}/100.`,
      });
      setAlertSentSuccess(true);
      onAlertTriggered();
    } catch (err) {
      console.error(err);
    } finally {
      setAlertSending(false);
    }
  };

  // Convert contributing factors dict to array for BarChart
  const factorData = Object.entries(location.contributing_factors || {}).map(([key, val]) => {
    const formattedLabel = key
      .replace('_pct', '')
      .replace('_angle', '')
      .replace('_24h', ' 24h')
      .replace('_cumulative_3d', ' 3d Sum')
      .replace('_', ' ')
      .toUpperCase();
    return { name: formattedLabel, weight: val };
  });

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-[5000] overflow-y-auto flex flex-col transition-all">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-slate-100">{location.location_name}</h2>
            <p className="text-xs text-slate-400">
              {location.district}, {location.state} • Elevation: {location.elevation}m
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Risk Score Summary Banner */}
        <div
          className={`p-4 rounded-xl border flex items-center justify-between ${
            location.risk_category === 'Critical'
              ? 'bg-red-500/10 border-red-500/30'
              : location.risk_category === 'High'
              ? 'bg-orange-500/10 border-orange-500/30'
              : location.risk_category === 'Moderate'
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}
        >
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Landslide Hazard Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-slate-100">{location.risk_score}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <p className="text-xs font-medium text-slate-300 mt-0.5">
              Category:{' '}
              <strong
                className={
                  location.risk_category === 'Critical'
                    ? 'text-red-400'
                    : location.risk_category === 'High'
                    ? 'text-orange-400'
                    : location.risk_category === 'Moderate'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }
              >
                {location.risk_category} Risk
              </strong>
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleSendManualAlert}
              disabled={alertSending}
              className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-lg ${
                alertSentSuccess
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20 active:scale-95'
              }`}
            >
              {alertSentSuccess ? (
                <>
                  <ShieldCheck className="w-4 h-4" /> Alert Dispatched
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" /> Dispatch Alert
                </>
              )}
            </button>
          </div>
        </div>

        {/* Telemetry Quick Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <CloudRain className="w-4 h-4 text-blue-400" />
              <span>Rainfall 24h</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{location.telemetry?.rainfall_24h ?? 0} mm</p>
            <p className="text-[10px] text-slate-500">3d sum: {location.telemetry?.rainfall_cumulative_3d ?? 0} mm</p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Soil Moisture</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{location.telemetry?.soil_moisture_pct ?? 0}%</p>
            <p className="text-[10px] text-slate-500">Saturation index</p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Mountain className="w-4 h-4 text-amber-400" />
              <span>Slope Angle</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{location.slope_angle}°</p>
            <p className="text-[10px] text-slate-500">Steep terrain</p>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Activity className="w-4 h-4 text-red-400" />
              <span>Seismic Trigger</span>
            </div>
            <p className="text-lg font-bold text-slate-100">{location.telemetry?.seismic_activity ?? 0}</p>
            <p className="text-[10px] text-slate-500">Peak ground proxy</p>
          </div>
        </div>

        {/* Contributing Factors Bar Chart */}
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            ML Feature Importance / Risk Drivers (%)
          </h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Bar dataKey="weight" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Trend Chart */}
        <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            7-Day Precipitation & Soil Moisture Trend
          </h3>
          {loading ? (
            <div className="h-40 flex items-center justify-center text-xs text-slate-500">
              Loading time series history...
            </div>
          ) : historyData && historyData.time_series ? (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData.time_series} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                  <Area type="monotone" dataKey="rainfall_24h" name="Rainfall 24h (mm)" stroke="#3b82f6" fillOpacity={1} fill="url(#rainGrad)" />
                  <Area type="monotone" dataKey="soil_moisture_pct" name="Soil Moisture (%)" stroke="#06b6d4" fillOpacity={1} fill="url(#soilGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No historical data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
