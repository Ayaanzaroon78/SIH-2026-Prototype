import React from 'react';
import { ShieldAlert, MapPin, Bell, TrendingUp } from 'lucide-react';
import { LocationItem } from '../types';

interface RiskSummaryCardsProps {
  locations: LocationItem[];
  alertCount: number;
}

export const RiskSummaryCards: React.FC<RiskSummaryCardsProps> = ({ locations, alertCount }) => {
  const total = locations.length;
  const critical = locations.filter((l) => l.risk_category === 'Critical').length;
  const high = locations.filter((l) => l.risk_category === 'High').length;
  const moderate = locations.filter((l) => l.risk_category === 'Moderate').length;
  const low = locations.filter((l) => l.risk_category === 'Low').length;

  const avgRisk = total > 0 ? (locations.reduce((acc, l) => acc + l.risk_score, 0) / total).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Total Locations Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitored Points (NER)</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-100">{total}</span>
            <span className="text-xs text-slate-400 font-medium">Active Nodes</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">8 States • 100% Telemetry Active</p>
        </div>
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
          <MapPin className="w-6 h-6" />
        </div>
      </div>

      {/* High & Critical Risk Warning */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High / Critical Warnings</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-red-400">{critical + high}</span>
            <span className="text-xs text-slate-400 font-medium">({critical} Critical, {high} High)</span>
          </div>
          <p className="text-[11px] text-amber-400 mt-1">{moderate} Moderate • {low} Low Risk</p>
        </div>
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl animate-pulse">
          <ShieldAlert className="w-6 h-6" />
        </div>
      </div>

      {/* Active Alerts Triggered */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Alerts Logged</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-400">{alertCount}</span>
            <span className="text-xs text-slate-400 font-medium">Dispatched</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">SMS & Email Stubs Active</p>
        </div>
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
          <Bell className="w-6 h-6" />
        </div>
      </div>

      {/* Average Regional Risk Index */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Regional Risk Index</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-400">{avgRisk}</span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">XGBoost ML v1.0.0 Model</p>
        </div>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
