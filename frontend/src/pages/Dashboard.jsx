import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sensorService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { t } = useTranslation();
  const [sensorData, setSensorData] = useState(null);
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to WebSocket for real-time data
    const ws = sensorService.connectWebSocket((data) => {
      setSensorData(data);
      setConnected(true);
      
      // Add to history (keep last 20)
      setHistory(prev => {
        const newHistory = [...prev, data].slice(-20);
        return newHistory;
      });
    });

    // Fallback: Get latest reading
    sensorService.getLatest()
      .then(data => setSensorData(data))
      .catch(err => console.error(err));

    return () => ws?.close();
  }, []);

  const getStatus = (value, min, max) => {
    if (value >= min && value <= max) return 'optimal';
    return value < min ? 'low' : 'high';
  };

  const SensorCard = ({ title, value, unit, min, max, icon }) => {
    const status = getStatus(value, min, max);
    const statusColors = {
      optimal: 'bg-green-100 border-green-400',
      low: 'bg-yellow-100 border-yellow-400',
      high: 'bg-red-100 border-red-400'
    };

    return (
      <div className={`p-6 rounded-xl border-2 ${statusColors[status]} shadow-lg hover:shadow-xl transition-all bg-white backdrop-blur-sm`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700 font-medium mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value?.toFixed(1)}{unit}</p>
            <p className="text-xs mt-2 text-gray-600">
              {t(`dashboard.${status}`)} ({min}-{max}{unit})
            </p>
          </div>
          <div className="text-4xl">{icon}</div>
        </div>
      </div>
    );
  };

  if (!sensorData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-xl">{t('dashboard.connecting')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-transparent">

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* AI Status Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 p-3 rounded-full">
                <span className="text-3xl">🌾</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">{t('dashboardExtras.farmCondition')}: {t('dashboardExtras.healthy')}</h3>
                <p className="text-green-600 text-sm">{t('dashboardExtras.aiMonitoring')}</p>
              </div>
            </div>
            <div className={`h-4 w-4 rounded-full ${connected ? 'bg-green-500 animate-pulse shadow-lg shadow-green-300' : 'bg-gray-400'}`}></div>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-4xl font-bold text-amber-950 mb-2" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>{t('dashboard.title')}</h1>
          <p className="text-gray-700 font-medium">
            {t('dashboard.lastUpdate')}: {new Date(sensorData.timestamp).toLocaleTimeString()}
          </p>
        </div>

      {/* Advisory Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💧</span>
            <div>
              <p className="text-sm text-gray-700 font-semibold">{t('dashboardExtras.irrigationAdvisory')}</p>
              <p className="text-lg font-bold text-gray-900">{t('dashboardExtras.noIrrigationNeeded')}</p>
              <p className="text-xs text-green-700 mt-1 font-medium">{t('dashboardExtras.soilMoistureOptimal')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-5 border border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🌱</span>
            <div>
              <p className="text-sm text-gray-700 font-semibold">{t('dashboardExtras.nutrientStatus')}</p>
              <p className="text-lg font-bold text-gray-900">{t('dashboardExtras.nutrientsBalanced')}</p>
              <p className="text-xs text-green-700 mt-1 font-medium">{t('dashboardExtras.npkHealthy')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SensorCard 
          title={t('dashboard.soilMoisture')}
          value={sensorData.soil_moisture}
          unit="%"
          min={40}
          max={80}
          icon="💧"
        />
        <SensorCard 
          title={t('dashboard.soilPH')}
          value={sensorData.soil_ph}
          unit=""
          min={6.0}
          max={7.5}
          icon="🧪"
        />
        <SensorCard 
          title={t('dashboard.temperature')}
          value={sensorData.temperature}
          unit="°C"
          min={20}
          max={35}
          icon="🌡️"
        />
        <SensorCard 
          title={t('dashboard.humidity')}
          value={sensorData.humidity}
          unit="%"
          min={50}
          max={80}
          icon="💨"
        />
      </div>

      {/* NPK Section */}
      <div className="bg-white backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('dashboardExtras.npkStatus')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <p className="text-gray-600">{t('dashboard.nitrogen')}</p>
            <p className="text-3xl font-bold text-blue-600">{sensorData.nitrogen?.toFixed(1)}</p>
            <p className="text-sm">kg/ha</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <p className="text-gray-600">{t('dashboard.phosphorus')}</p>
            <p className="text-3xl font-bold text-purple-600">{sensorData.phosphorus?.toFixed(1)}</p>
            <p className="text-sm">kg/ha</p>
          </div>
          <div className="text-center p-4 bg-pink-50 rounded">
            <p className="text-gray-600">{t('dashboard.potassium')}</p>
            <p className="text-3xl font-bold text-pink-600">{sensorData.potassium?.toFixed(1)}</p>
            <p className="text-sm">kg/ha</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {history.length > 1 && (
        <div className="bg-white backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">{t('dashboardExtras.realTimeTrends')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={(val) => new Date(val).toLocaleTimeString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature" />
              <Line type="monotone" dataKey="humidity" stroke="#3b82f6" name="Humidity" />
              <Line type="monotone" dataKey="soil_moisture" stroke="#22c55e" name="Moisture" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
