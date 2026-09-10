import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationItem } from '../types';
import { AlertCircle, ArrowUpRight, CloudRain, Droplets, Mountain } from 'lucide-react';

interface MapViewProps {
  locations: LocationItem[];
  selectedLocation: LocationItem | null;
  onSelectLocation: (location: LocationItem) => void;
}

// Custom DivIcons for color-coded risk markers
const createRiskIcon = (category: string, score: number) => {
  let pinClass = 'pin-low';
  if (category === 'Moderate') pinClass = 'pin-moderate';
  if (category === 'High') pinClass = 'pin-high';
  if (category === 'Critical') pinClass = 'pin-critical';

  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `<div class="custom-pin ${pinClass}">${Math.round(score)}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

// Component to dynamically re-center map when location selected
const RecenterMap: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 10, { duration: 1.2 });
  }, [lat, lng, map]);
  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
}) => {
  // Center of NER India (near Meghalaya / Assam boundary)
  const centerLat = selectedLocation ? selectedLocation.latitude : 25.8;
  const centerLng = selectedLocation ? selectedLocation.longitude : 92.2;

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Base/MapServer/tile/{z}/{y}/{x}"
        />

        {selectedLocation && (
          <RecenterMap lat={selectedLocation.latitude} lng={selectedLocation.longitude} />
        )}

        {locations.map((loc) => (
          <Marker
            key={loc.location_id}
            position={[loc.latitude, loc.longitude]}
            icon={createRiskIcon(loc.risk_category, loc.risk_score)}
            eventHandlers={{
              click: () => onSelectLocation(loc),
            }}
          >
            <Popup>
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{loc.location_name}</h3>
                    <p className="text-[11px] text-slate-400">{loc.district}, {loc.state}</p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      loc.risk_category === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : loc.risk_category === 'High'
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                        : loc.risk_category === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    }`}
                  >
                    {loc.risk_category.toUpperCase()} ({loc.risk_score})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                    <span>{loc.telemetry?.rainfall_24h ?? 0} mm/24h</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{loc.telemetry?.soil_moisture_pct ?? 0}% Soil Sat</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Mountain className="w-3.5 h-3.5 text-amber-400" />
                    <span>{loc.slope_angle}° Slope</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>{loc.telemetry?.seismic_activity ?? 0} Seismic</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectLocation(loc)}
                  className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  View Deep Analytics <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-xl z-[1000] text-xs">
        <h4 className="font-bold text-slate-200 mb-2">Landslide Risk Level (NER)</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Low (0-25)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-300">Moderate (26-50)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-slate-300">High (51-75)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-slate-300">Critical (76-100)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
