import React, { useState } from 'react';
import { LocationItem } from '../types';
import { triggerManualAlert, createNewLocation } from '../services/api';
import { ShieldAlert, Plus, Send, CheckCircle2, MapPin, Layers } from 'lucide-react';

interface AdminPageProps {
  locations: LocationItem[];
  onRefresh: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ locations, onRefresh }) => {
  // Alert Form state
  const [selectedLocId, setSelectedLocId] = useState<number>(locations[0]?.location_id || 1);
  const [severity, setSeverity] = useState<string>('Critical');
  const [customMsg, setCustomMsg] = useState<string>('');
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [alertLoading, setAlertLoading] = useState(false);

  // New Location Form state
  const [locName, setLocName] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('Meghalaya');
  const [latitude, setLatitude] = useState(25.5);
  const [longitude, setLongitude] = useState(91.8);
  const [elevation, setElevation] = useState(1200);
  const [slopeAngle, setSlopeAngle] = useState(35);
  const [locSuccess, setLocSuccess] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertLoading(true);
    setAlertSuccess(false);

    try {
      await triggerManualAlert({
        location_id: Number(selectedLocId),
        severity: severity,
        message: customMsg || undefined,
      });
      setAlertSuccess(true);
      onRefresh();
      setCustomMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setAlertLoading(false);
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocLoading(true);
    setLocSuccess(false);

    try {
      await createNewLocation({
        name: locName,
        district: district,
        state: stateName,
        latitude: Number(latitude),
        longitude: Number(longitude),
        elevation: Number(elevation),
        slope_angle: Number(slopeAngle),
      });
      setLocSuccess(true);
      onRefresh();
      setLocName('');
      setDistrict('');
    } catch (err) {
      console.error(err);
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Disaster Management Admin & Control Panel</h2>
          <p className="text-xs text-slate-400">
            Authorized portal for authority alert broadcasting, terrain node commissioning, and thresholds management.
          </p>
        </div>
      </div>

      {/* Grid: Alert Dispatcher + Add Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manual Test Alert Trigger Form */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Send className="w-4 h-4 text-red-400" /> Dispatch Test Emergency Alert
          </h3>

          {alertSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Alert successfully dispatched to NDMA & State Authorities!
            </div>
          )}

          <form onSubmit={handleSendAlert} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Location</label>
              <select
                value={selectedLocId}
                onChange={(e) => setSelectedLocId(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc.location_id} value={loc.location_id}>
                    {loc.location_name} ({loc.district}, {loc.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Alert Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
              >
                <option value="Critical">Critical (Immediate Evacuation)</option>
                <option value="High">High (Heightened Monitoring)</option>
                <option value="Moderate">Moderate (Advisory Notice)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Custom Warning Message (Optional)</label>
              <textarea
                rows={3}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Enter custom alert text for SMS & Email dispatch..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-amber-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={alertLoading}
              className="w-full py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" /> {alertLoading ? 'Dispatching...' : 'Broadcast Emergency Alert'}
            </button>
          </form>
        </div>

        {/* Add New Monitored Location Form */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-amber-400" /> Commission New Sensor Location Node
          </h3>

          {locSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Location node registered & initial baseline prediction calculated!
            </div>
          )}

          <form onSubmit={handleCreateLocation} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location Name</label>
                <input
                  type="text"
                  required
                  value={locName}
                  onChange={(e) => setLocName(e.target.value)}
                  placeholder="e.g. Lumshnong Pass"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. East Jaintia Hills"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">State</label>
                <select
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                >
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Assam">Assam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Elevation (meters)</label>
                <input
                  type="number"
                  required
                  value={elevation}
                  onChange={(e) => setElevation(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slope Angle (°)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={slopeAngle}
                  onChange={(e) => setSlopeAngle(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-100 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={locLoading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> {locLoading ? 'Saving...' : 'Register Location Node'}
            </button>
          </form>
        </div>
      </div>

      {/* Monitored Locations Table */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-cyan-400" /> Monitored Locations Directory
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="py-2.5 px-3">Location Name</th>
                <th className="py-2.5 px-3">District & State</th>
                <th className="py-2.5 px-3">Coordinates</th>
                <th className="py-2.5 px-3">Slope / Elev</th>
                <th className="py-2.5 px-3">Risk Category</th>
                <th className="py-2.5 px-3">Hazard Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {locations.map((loc) => (
                <tr key={loc.location_id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-slate-200">{loc.location_name}</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {loc.district}, {loc.state}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {loc.latitude.toFixed(4)}°, {loc.longitude.toFixed(4)}°
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {loc.slope_angle}° slope • {loc.elevation}m
                  </td>
                  <td className="py-2.5 px-3">
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
                      {loc.risk_category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-bold font-mono text-slate-200">{loc.risk_score} / 100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
