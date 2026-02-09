import React, { useState, useEffect } from 'react';
import { weatherService, sensorService } from '../services/api';
import toast from 'react-hot-toast';

const ClimateIntelligence = () => {
  const [weather, setWeather] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [satelliteSync, setSatelliteSync] = useState(false);

  useEffect(() => {
    // Fetch weather data
    weatherService.getWeather('Kerala')
      .then(data => setWeather(data))
      .catch(err => toast.error('Failed to fetch weather'));

    // Fetch sensor data
    sensorService.getLatest()
      .then(data => setSensorData(data))
      .catch(err => console.error(err));

    // Simulate satellite sync
    setTimeout(() => setSatelliteSync(true), 1500);
  }, []);

  const calculateNDVI = () => {
    if (!sensorData) return 0.65;
    const health = (sensorData.soil_moisture + sensorData.humidity) / 200;
    return Math.min(0.95, Math.max(0.3, health + 0.2));
  };

  const ndvi = calculateNDVI();
  const ndviColor = ndvi > 0.7 ? 'green' : ndvi > 0.5 ? 'yellow' : 'red';

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Subtle accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-5xl">🛰️</span>
            <h1 className="text-5xl font-bold text-amber-950" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>Satellite & Climate Intelligence</h1>
          </div>
          <p className="text-gray-600 text-lg ml-16">Real-time remote sensing integrated with ground weather stations</p>
        </div>

        {/* Satellite Sync Badge */}
        <div className="mb-8 flex items-center justify-center">
          <div className={`inline-flex items-center space-x-3 backdrop-blur-xl bg-white/10 border rounded-full px-6 py-3 transition-all duration-500 ${satelliteSync ? 'border-green-400/40' : 'border-blue-400/40'}`}>
            <div className={`h-4 w-4 rounded-full ${satelliteSync ? 'bg-green-400 animate-pulse' : 'bg-blue-400 animate-spin'}`}></div>
            <span className="text-white font-semibold">
              {satelliteSync ? '✓ Satellite Data Synchronized' : 'Syncing with satellite...'}
            </span>
          </div>
        </div>

        {/* NDVI Index */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Vegetation Health Index (NDVI)</h3>
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-6xl font-bold text-white mb-2">{ndvi.toFixed(2)}</div>
                <div className="text-gray-300">Normalized Difference Vegetation Index</div>
              </div>
              <div className={`text-6xl ${ndviColor === 'green' ? 'text-green-400' : ndviColor === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>
                {ndviColor === 'green' ? '🌿' : ndviColor === 'yellow' ? '🍂' : '🍁'}
              </div>
            </div>
            <div className="relative h-8 rounded-full overflow-hidden bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-1000"
                style={{ left: `${ndvi * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                  {(ndvi * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>Poor (0.0)</span>
              <span>Moderate (0.5)</span>
              <span>Excellent (1.0)</span>
            </div>
          </div>
        </div>

        {/* Field Heatmap */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Field Health Heatmap</h3>
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <div className="grid grid-cols-8 gap-2">
              {[...Array(64)].map((_, index) => {
                const heat = Math.random();
                return (
                  <div
                    key={index}
                    className="aspect-square rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
                    style={{
                      background: heat > 0.7 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.7), rgba(22, 163, 74, 0.9))'
                        : heat > 0.4
                        ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.7), rgba(202, 138, 4, 0.9))'
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.7), rgba(220, 38, 38, 0.9))'
                    }}
                  >
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-green-600"></div>
                <span className="text-white">Healthy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-yellow-600"></div>
                <span className="text-white">Moderate Stress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-red-600"></div>
                <span className="text-white">High Stress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Climate Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Temperature Trend */}
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">🌡️</span>
              <div>
                <h4 className="text-xl font-bold text-white">Temperature Anomaly</h4>
                <p className="text-gray-400 text-sm">30-day rolling average</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Week 1', value: 32, change: +1.2 },
                { label: 'Week 2', value: 33.5, change: +2.7 },
                { label: 'Week 3', value: 31, change: +0.2 },
                { label: 'Week 4', value: 34, change: +3.2 }
              ].map((week, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{week.label}</span>
                    <span className={`text-sm font-semibold ${week.change > 2 ? 'text-red-400' : 'text-green-400'}`}>
                      {week.change > 0 ? '+' : ''}{week.change}°C
                    </span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full ${week.change > 2 ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}
                      style={{ width: `${(week.value / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rainfall Forecast */}
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">🌧️</span>
              <div>
                <h4 className="text-xl font-bold text-white">Rainfall Anomaly</h4>
                <p className="text-gray-400 text-sm">Deviation from seasonal average</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'This Week', value: 45, deviation: -22 },
                { label: 'Next Week', value: 120, deviation: +35 },
                { label: 'Week 3', value: 90, deviation: +5 },
                { label: 'Week 4', value: 60, deviation: -18 }
              ].map((week, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{week.label}</span>
                    <span className={`text-sm font-semibold ${week.deviation > 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                      {week.deviation > 0 ? '+' : ''}{week.deviation}mm
                    </span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{ width: `${(week.value / 150) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Weather */}
        {weather && (
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{weather.location || 'Kerala'}</h3>
                <p className="text-6xl font-bold text-white mb-2">{weather.temperature?.toFixed(1) || '28'}°C</p>
                <p className="text-xl text-gray-300">{weather.description || 'Partly Cloudy'}</p>
              </div>
              <div className="text-8xl">{weather.icon || '⛅'}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Humidity</div>
                <div className="text-2xl font-bold text-white">{weather.humidity || '75'}%</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Wind Speed</div>
                <div className="text-2xl font-bold text-white">{weather.wind_speed || '12'} km/h</div>
              </div>
              <div className="text-center">
                <div className="text-gray-400 text-sm mb-1">Pressure</div>
                <div className="text-2xl font-bold text-white">{weather.pressure || '1013'} hPa</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClimateIntelligence;
