import React, { useState } from 'react';
import { runPredictInference } from '../services/api';
import { PredictResponsePayload } from '../types';
import { Sliders, X, Cpu, CheckCircle2, AlertOctagon } from 'lucide-react';

interface PredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PredictorModal: React.FC<PredictorModalProps> = ({ isOpen, onClose }) => {
  const [rainfall24h, setRainfall24h] = useState<number>(115);
  const [rainfall3d, setRainfall3d] = useState<number>(240);
  const [soilMoisture, setSoilMoisture] = useState<number>(85);
  const [slopeAngle, setSlopeAngle] = useState<number>(42);
  const [elevation, setElevation] = useState<number>(1450);
  const [seismicActivity, setSeismicActivity] = useState<number>(0.2);

  const [predictionResult, setPredictionResult] = useState<PredictResponsePayload | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePredict = async () => {
    setLoading(true);
    try {
      const trend = roundVal(rainfall24h / (rainfall3d + 1.0));
      const result = await runPredictInference({
        rainfall_24h: rainfall24h,
        rainfall_cumulative_3d: rainfall3d,
        rainfall_intensity_trend: trend,
        soil_moisture_pct: soilMoisture,
        slope_angle: slopeAngle,
        elevation: elevation,
        seismic_activity: seismicActivity,
      });
      setPredictionResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const roundVal = (val: number) => Math.round(val * 100) / 100;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-100">Live XGBoost Risk Inference Simulator</h2>
              <p className="text-xs text-slate-400">Tweak real-time environmental parameters to test model output</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Controls */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Rainfall 24h</span>
                <span className="text-amber-400 font-bold">{rainfall24h} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={rainfall24h}
                onChange={(e) => setRainfall24h(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>3-Day Cumulative Rainfall</span>
                <span className="text-amber-400 font-bold">{rainfall3d} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="500"
                value={rainfall3d}
                onChange={(e) => setRainfall3d(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Soil Moisture Saturation</span>
                <span className="text-amber-400 font-bold">{soilMoisture}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Terrain Slope Angle</span>
                <span className="text-amber-400 font-bold">{slopeAngle}°</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={slopeAngle}
                onChange={(e) => setSlopeAngle(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Elevation</span>
                <span className="text-amber-400 font-bold">{elevation} m</span>
              </div>
              <input
                type="range"
                min="100"
                max="3500"
                value={elevation}
                onChange={(e) => setElevation(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Seismic Activity (Tremor Proxy)</span>
                <span className="text-amber-400 font-bold">{seismicActivity}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={seismicActivity}
                onChange={(e) => setSeismicActivity(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Sliders className="w-4 h-4" />
              {loading ? 'Running ML Inference...' : 'Calculate Risk Score'}
            </button>
          </div>

          {/* Inference Output Preview */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            {predictionResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Model Inference Result
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                    {predictionResult.model_version}
                  </span>
                </div>

                <div className="text-center py-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Predicted Hazard Score</span>
                  <div className="text-4xl font-black text-slate-100 mt-1">{predictionResult.risk_score}</div>
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-extrabold rounded-full border ${
                      predictionResult.risk_category === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : predictionResult.risk_category === 'High'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : predictionResult.risk_category === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {predictionResult.risk_category.toUpperCase()} RISK
                  </span>
                </div>

                {/* Factors List */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase mb-2">Feature Importance Breakdown</h4>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(predictionResult.contributing_factors || {}).map(([feat, pct]) => (
                      <div key={feat} className="flex justify-between items-center bg-slate-900/90 p-1.5 rounded-md border border-slate-800/80">
                        <span className="text-slate-300 capitalize">{feat.replace('_', ' ')}</span>
                        <span className="font-mono font-bold text-amber-400">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-4">
                <AlertOctagon className="w-10 h-10 mb-2 text-slate-700" />
                <p className="text-xs font-medium">Adjust sliders and click "Calculate Risk Score" to run inference.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
