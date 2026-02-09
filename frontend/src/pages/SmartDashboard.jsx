import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { sensorService } from '../services/api';

const SmartDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sensorData, setSensorData] = useState(null);
  const [aiActive, setAiActive] = useState(true);

  useEffect(() => {
    const ws = sensorService.connectWebSocket((data) => {
      setSensorData(data);
    });

    sensorService.getLatest()
      .then(data => setSensorData(data))
      .catch(err => console.error(err));

    return () => ws?.close();
  }, []);

  const MetricCard = ({ title, value, unit, icon, status, gradient }) => (
    <div className={`relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500 group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-300 text-sm font-medium">{title}</span>
          <span className="text-3xl">{icon}</span>
        </div>
        <div className="mb-2">
          <span className="text-5xl font-bold text-white">{value}</span>
          <span className="text-2xl text-gray-300 ml-2">{unit}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${status === 'optimal' ? 'bg-green-400 animate-pulse' : status === 'warning' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></div>
          <span className="text-sm text-gray-300 capitalize">{status}</span>
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon, onClick, color }) => (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl bg-gradient-to-br ${color} border border-white/20 hover:scale-105 transition-all duration-300 group text-left w-full`}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
    </button>
  );

  if (!sensorData) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-800 text-xl font-semibold">{t('smartDashboard.connectingToAI')}</p>
        </div>
      </div>
    );
  }

  const getStatus = (value, min, max) => {
    if (value >= min && value <= max) return 'optimal';
    return value < min ? 'warning' : 'danger';
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Subtle accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold text-amber-950 mb-2" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>🌾 Smart Farm Command Center</h1>
              <p className="text-gray-300 text-lg">Climate-Resilient AI Agriculture Platform</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-full px-6 py-3">
                <div className={`h-3 w-3 rounded-full ${aiActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-white font-semibold">{t('smartDashboard.aiActive')}</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">{t('smartDashboard.lastSync')}: {new Date(sensorData.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        {/* Real-time Sensor Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">📊</span>
            {t('smartDashboard.liveFarmVitals')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title={t('smartDashboard.soilMoisture')}
              value={sensorData.soil_moisture?.toFixed(1)}
              unit="%"
              icon="💧"
              status={getStatus(sensorData.soil_moisture, 40, 80)}
              gradient="from-blue-500 to-cyan-500"
            />
            <MetricCard
              title={t('smartDashboard.temperature')}
              value={sensorData.temperature?.toFixed(1)}
              unit="°C"
              icon="🌡️"
              status={getStatus(sensorData.temperature, 20, 35)}
              gradient="from-orange-500 to-red-500"
            />
            <MetricCard
              title={t('smartDashboard.soilPH')}
              value={sensorData.soil_ph?.toFixed(1)}
              unit=""
              icon="🧪"
              status={getStatus(sensorData.soil_ph, 6.0, 7.5)}
              gradient="from-purple-500 to-pink-500"
            />
            <MetricCard
              title={t('smartDashboard.humidity')}
              value={sensorData.humidity?.toFixed(1)}
              unit="%"
              icon="💨"
              status={getStatus(sensorData.humidity, 50, 80)}
              gradient="from-teal-500 to-green-500"
            />
          </div>
        </div>

        {/* NPK Status Panel */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-3">🧬</span>
                {t('smartDashboard.soilNutrientMatrix')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30">
                  <div className="text-blue-400 text-sm font-medium mb-2">{t('smartDashboard.nitrogen')}</div>
                  <div className="text-5xl font-bold text-white mb-2">{sensorData.nitrogen?.toFixed(1)}</div>
                  <div className="text-blue-300 text-sm">kg/ha</div>
                  <div className="mt-4 bg-blue-500/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: `${(sensorData.nitrogen / 200) * 100}%` }}></div>
                  </div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-400/30">
                  <div className="text-purple-400 text-sm font-medium mb-2">{t('smartDashboard.phosphorus')}</div>
                  <div className="text-5xl font-bold text-white mb-2">{sensorData.phosphorus?.toFixed(1)}</div>
                  <div className="text-purple-300 text-sm">kg/ha</div>
                  <div className="mt-4 bg-purple-500/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full" style={{ width: `${(sensorData.phosphorus / 200) * 100}%` }}></div>
                  </div>
                </div>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 border border-pink-400/30">
                  <div className="text-pink-400 text-sm font-medium mb-2">{t('smartDashboard.potassium')}</div>
                  <div className="text-5xl font-bold text-white mb-2">{sensorData.potassium?.toFixed(1)}</div>
                  <div className="text-pink-300 text-sm">kg/ha</div>
                  <div className="mt-4 bg-pink-500/20 rounded-full h-2 overflow-hidden">
                    <div className="bg-pink-400 h-full rounded-full" style={{ width: `${(sensorData.potassium / 200) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Advisory Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-3">🤖</span>
            {t('smartDashboard.aiAdvisoryServices')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickAction
              title={t('smartDashboard.irrigationAdvisory')}
              description={t('smartDashboard.irrigationDesc')}
              icon="💧"
              onClick={() => navigate('/irrigation')}
              color="from-blue-600/30 to-cyan-600/30"
            />
            <QuickAction
              title={t('smartDashboard.cropRecommendations')}
              description={t('smartDashboard.cropRecommendationsDesc')}
              icon="🌾"
              onClick={() => navigate('/crop-selection')}
              color="from-green-600/30 to-emerald-600/30"
            />
            <QuickAction
              title={t('smartDashboard.climateIntelligence')}
              description={t('smartDashboard.climateIntelligenceDesc')}
              icon="🛰️"
              onClick={() => navigate('/climate')}
              color="from-purple-600/30 to-indigo-600/30"
            />
            <QuickAction
              title={t('smartDashboard.pestDiseaseAI')}
              description={t('smartDashboard.pestDiseaseAIDesc')}
              icon="🔬"
              onClick={() => navigate('/pest-disease')}
              color="from-red-600/30 to-orange-600/30"
            />
            <QuickAction
              title={t('smartDashboard.fertilizerOptimizer')}
              description={t('smartDashboard.fertilizerOptimizerDesc')}
              icon="🧪"
              onClick={() => navigate('/fertilizer')}
              color="from-amber-600/30 to-yellow-600/30"
            />
            <QuickAction
              title={t('smartDashboard.advisoryHistory')}
              description={t('smartDashboard.advisoryHistoryDesc')}
              icon="📊"
              onClick={() => navigate('/advisory-history')}
              color="from-slate-600/30 to-gray-600/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartDashboard;
