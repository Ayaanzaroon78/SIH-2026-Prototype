import React, { useState } from 'react';
import { AlertItem } from '../types';
import { Bell, AlertTriangle, ShieldCheck, MapPin, Filter, Mail, PhoneCall } from 'lucide-react';

interface AlertsPageProps {
  alerts: AlertItem[];
  onTriggerTestAlert: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onTriggerTestAlert }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity.toUpperCase() === filterSeverity.toUpperCase();
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl">
            <Bell className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Dispatched Emergency Alerts Feed</h2>
            <p className="text-xs text-slate-400">
              Audit log of all automated threshold breaches and manually triggered warning notifications for authorities.
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerTestAlert}
          className="px-4 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <AlertTriangle className="w-4 h-4" /> Trigger Demo Alert
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Severity:</span>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filterSeverity === sev
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredAlerts.length} of {alerts.length} Alerts
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 p-8 text-center rounded-2xl text-slate-500">
            <ShieldCheck className="w-12 h-12 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold">No alerts logged for selected filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                alert.severity === 'Critical'
                  ? 'bg-red-500/10 border-red-500/30'
                  : alert.severity === 'High'
                  ? 'bg-orange-500/10 border-orange-500/30'
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      alert.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : alert.severity === 'High'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {alert.severity.toUpperCase()} SEVERITY
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {alert.location_name} ({alert.district}, {alert.state})
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-200">{alert.message}</p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-amber-400" /> Sent to: {alert.sent_to}
                  </span>
                  <span className="flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Channel: SMS & Email Stubs
                  </span>
                </div>
              </div>

              <div className="text-right whitespace-nowrap">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {alert.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
