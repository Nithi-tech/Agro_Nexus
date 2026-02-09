import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/api';

const AdvisoryHistory = () => {
  const [filter, setFilter] = useState('all');
  const [advisories, setAdvisories] = useState([]);

  useEffect(() => {
    // Mock advisory history data
    const mockHistory = [
      {
        id: 1,
        type: 'irrigation',
        icon: '💧',
        decision: 'Postpone irrigation by 24 hours',
        soilReason: 'Soil moisture at 65% - adequate levels',
        climateReason: 'Rain forecast within 18 hours (85% probability)',
        satellite: true,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        confidence: 94
      },
      {
        id: 2,
        type: 'crop',
        icon: '🌾',
        decision: 'Recommended crop: Rice',
        soilReason: 'NPK levels optimal for rice cultivation (N:45, P:38, K:42)',
        climateReason: 'Monsoon season with consistent rainfall patterns',
        satellite: true,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        confidence: 91
      },
      {
        id: 3,
        type: 'fertilizer',
        icon: '🧪',
        decision: 'Apply Nitrogen-rich fertilizer',
        soilReason: 'Nitrogen deficiency detected (N: 28 kg/ha)',
        climateReason: 'Temperature and moisture ideal for nutrient absorption',
        satellite: false,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        confidence: 88
      },
      {
        id: 4,
        type: 'disease',
        icon: '🔬',
        decision: 'Fungicide treatment recommended',
        soilReason: 'High soil moisture (78%) favoring fungal growth',
        climateReason: 'Humidity above 80% for 3 consecutive days',
        satellite: true,
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        confidence: 86
      },
      {
        id: 5,
        type: 'irrigation',
        icon: '💧',
        decision: 'Irrigate immediately',
        soilReason: 'Critical moisture level at 32%',
        climateReason: 'Temperature 34°C with no rain forecast for 5 days',
        satellite: true,
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        confidence: 96
      }
    ];
    setAdvisories(mockHistory);
  }, []);

  const filteredAdvisories = filter === 'all' 
    ? advisories 
    : advisories.filter(a => a.type === filter);

  const getRelativeTime = (date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Subtle accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-5xl">📜</span>
            <h1 className="text-5xl font-bold text-amber-950" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>Advisory History & Explainability</h1>
          </div>
          <p className="text-gray-600 text-lg ml-16">Complete transparency into AI decisions and their reasoning</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'All Advisories', value: 'all', icon: '🔍' },
              { label: 'Irrigation', value: 'irrigation', icon: '💧' },
              { label: 'Crop Selection', value: 'crop', icon: '🌾' },
              { label: 'Fertilizer', value: 'fertilizer', icon: '🧪' },
              { label: 'Disease', value: 'disease', icon: '🔬' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                  filter === tab.value
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-105'
                    : 'backdrop-blur-xl bg-white/10 border border-white/20 text-gray-300 hover:scale-105'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>

          {/* Advisory Cards */}
          <div className="space-y-8">
            {filteredAdvisories.map((advisory, index) => (
              <div key={advisory.id} className="relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-5 top-8 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full border-4 border-gray-900 flex items-center justify-center text-xl">
                  {advisory.icon}
                </div>

                {/* Card */}
                <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8 hover:scale-105 transition-transform">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{advisory.decision}</h3>
                        {advisory.satellite && (
                          <div className="inline-flex items-center space-x-1 bg-blue-500/20 border border-blue-400/40 rounded-full px-3 py-1">
                            <span className="text-blue-400">🛰️</span>
                            <span className="text-blue-300 text-xs font-semibold">Satellite</span>
                          </div>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">{getRelativeTime(advisory.timestamp)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-2xl font-bold mb-1">{advisory.confidence}%</div>
                      <div className="text-gray-400 text-xs">Confidence</div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Soil Reason */}
                    <div className="backdrop-blur-sm bg-green-500/10 border border-green-400/20 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">🌱</span>
                        <div className="text-green-400 font-semibold">Soil Analysis</div>
                      </div>
                      <p className="text-gray-200 text-sm">{advisory.soilReason}</p>
                    </div>

                    {/* Climate Reason */}
                    <div className="backdrop-blur-sm bg-blue-500/10 border border-blue-400/20 rounded-2xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">☁️</span>
                        <div className="text-blue-400 font-semibold">Climate Data</div>
                      </div>
                      <p className="text-gray-200 text-sm">{advisory.climateReason}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/40 rounded-full px-4 py-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                    <span className="text-purple-300 text-sm font-semibold">Advisory Implemented</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredAdvisories.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">📭</span>
            <p className="text-white text-xl font-semibold mb-2">No advisories found</p>
            <p className="text-gray-400">Try changing the filter or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisoryHistory;
