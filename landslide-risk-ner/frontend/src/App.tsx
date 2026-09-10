import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { AlertsPage } from './pages/AlertsPage';
import { AdminPage } from './pages/AdminPage';
import { PredictorModal } from './components/PredictorModal';
import { LocationItem, AlertItem } from './types';
import { fetchCurrentRisk, fetchAlerts } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alerts' | 'admin' | 'simulator'>('dashboard');
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const locData = await fetchCurrentRisk();
      const alertData = await fetchAlerts();
      setLocations(locData);
      setAlerts(alertData);
      setLastUpdated(new Date());

      // If selected location exists, update its reference
      if (selectedLocation) {
        const updatedLoc = locData.find((l) => l.location_id === selectedLocation.location_id);
        if (updatedLoc) setSelectedLocation(updatedLoc);
      }
    } catch (err) {
      console.error('Failed to load risk telemetry data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll telemetry data every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = locations.filter((l) => l.risk_category === 'Critical').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab === 'simulator' ? 'dashboard' : activeTab}
        setActiveTab={(tab) => {
          if (tab === 'simulator') {
            setIsSimulatorOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        criticalCount={criticalCount}
        lastUpdated={lastUpdated}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'dashboard' && (
          <DashboardPage
            locations={locations}
            alerts={alerts}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onRefresh={loadData}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPage
            alerts={alerts}
            onTriggerTestAlert={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPage
            locations={locations}
            onRefresh={loadData}
          />
        )}
      </main>

      {/* Live Inference Simulator Modal */}
      <PredictorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        <p>
          SIH26001: AI-Based Landslide Risk Monitoring System in NER • Smart India Hackathon 2026 Prototype
        </p>
      </footer>
    </div>
  );
}

export default App;
