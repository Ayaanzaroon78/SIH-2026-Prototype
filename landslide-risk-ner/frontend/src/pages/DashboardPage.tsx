import React from 'react';
import { LocationItem, AlertItem } from '../types';
import { RiskSummaryCards } from '../components/RiskSummaryCards';
import { MapView } from '../components/MapView';
import { LocationDetailDrawer } from '../components/LocationDetailDrawer';
import { ShieldAlert, ChevronRight, CloudRain, Droplets, Sliders, Bell } from 'lucide-react';

interface DashboardPageProps {
  locations: LocationItem[];
  alerts: AlertItem[];
  selectedLocation: LocationItem | null;
  setSelectedLocation: (location: LocationItem | null) => void;
  onRefresh: () => void;
  onOpenSimulator: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  locations,
  alerts,
  selectedLocation,
  setSelectedLocation,
  onRefresh,
  onOpenSimulator,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <RiskSummaryCards locations={locations} alertCount={alerts.length} />

      {/* Main Grid: Interactive Map + Live Sidebar Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map View (Span 3 Cols) */}
        <div className="lg:col-span-3">
          <MapView
            locations={locations}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
          />
        </div>

        {/* Live Monitored Nodes Sidebar (1 Col) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-[620px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Monitored NER Points
            </h3>
            <span className="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-medium">
              {locations.length} Nodes
            </span>
          </div>

          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
            {locations.map((loc) => {
              const isSelected = selectedLocation?.location_id === loc.location_id;

              return (
                <div
                  key={loc.location_id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{loc.location_name}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        loc.risk_category === 'Critical'
                          ? 'bg-red-500/20 text-red-400'
                          : loc.risk_category === 'High'
                          ? 'bg-orange-500/20 text-orange-400'
                          : loc.risk_category === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {loc.risk_category} ({loc.risk_score})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1">
                    {loc.district}, {loc.state}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-400" /> {loc.telemetry?.rainfall_24h ?? 0} mm
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> {loc.telemetry?.soil_moisture_pct ?? 0}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 mt-2">
            <button
              onClick={onOpenSimulator}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all hover:opacity-95"
            >
              <Sliders className="w-3.5 h-3.5" /> Launch ML Simulator
            </button>
          </div>
        </div>
      </div>

      {/* Selected Location Drawer */}
      <LocationDetailDrawer
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onAlertTriggered={onRefresh}
      />
    </div>
  );
};
