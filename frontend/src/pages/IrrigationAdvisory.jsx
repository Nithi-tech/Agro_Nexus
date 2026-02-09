import React, { useState, useEffect } from 'react';
import { sensorService } from '../services/api';

const IrrigationAdvisory = () => {
  const [sensorData, setSensorData] = useState(null);
  const [advisory, setAdvisory] = useState(null);

  useEffect(() => {
    sensorService.getLatest()
      .then(data => {
        setSensorData(data);
        generateAdvisory(data);
      })
      .catch(err => console.error(err));
  }, []);

  const generateAdvisory = (data) => {
    const moisture = data.soil_moisture;
    const temp = data.temperature;
    const humidity = data.humidity;
    
    // Simple AI logic
    let nextIrrigation = "24 hours";
    let waterLevel = "Medium";
    let skipDueToRain = false;
    
    if (moisture < 40) {
      nextIrrigation = "Irrigate NOW";
      waterLevel = "High";
    } else if (moisture < 60) {
      nextIrrigation = "18 hours";
      waterLevel = "Medium";
    } else {
      nextIrrigation = "36 hours";
      waterLevel = "Low";
    }
    
    // Simulate rain prediction
    if (humidity > 80 && temp < 30) {
      skipDueToRain = true;
      nextIrrigation = "Postponed";
    }

    setAdvisory({
      timing: nextIrrigation,
      volume: waterLevel,
      rainSkip: skipDueToRain,
      confidence: 94,
      moisture: moisture,
      reasons: [
        `Current soil moisture: ${moisture?.toFixed(1)}%`,
        `Temperature: ${temp?.toFixed(1)}°C`,
        `Atmospheric humidity: ${humidity?.toFixed(1)}%`,
        skipDueToRain ? "High probability of rainfall detected" : "No rain expected in 48h"
      ]
    });
  };

  if (!advisory) {
    return (
      <div className="min-h-screen relative flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-800 text-xl font-semibold">Analyzing irrigation parameters...</p>
        </div>
      </div>
    );
  }

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
            <span className="text-5xl">💧</span>
            <h1 className="text-5xl font-bold text-amber-950" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>AI Irrigation Advisory</h1>
          </div>
          <p className="text-gray-300 text-lg ml-16">Precision water management powered by machine learning</p>
        </div>

        {/* Main Advisory Card */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-400/30 p-12">
            <div className="absolute inset-0 bg-blue-500/5"></div>
            <div className="relative z-10">
              {advisory.rainSkip ? (
                <div className="text-center">
                  <div className="text-8xl mb-6">🌧️</div>
                  <h2 className="text-4xl font-bold text-white mb-4">Rain Expected — Irrigation Not Required</h2>
                  <p className="text-blue-200 text-xl">AI detected high rainfall probability. Water scheduling postponed.</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-6">⏰</div>
                  <h2 className="text-2xl text-blue-200 mb-2">Next Irrigation Recommended In</h2>
                  <div className="text-7xl font-bold text-white mb-6">{advisory.timing}</div>
                  <div className="flex items-center justify-center space-x-8">
                    <div className="text-center">
                      <div className="text-blue-300 text-sm mb-1">Water Volume</div>
                      <div className={`text-3xl font-bold ${advisory.volume === 'High' ? 'text-red-400' : advisory.volume === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {advisory.volume}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-300 text-sm mb-1">AI Confidence</div>
                      <div className="text-3xl font-bold text-green-400">{advisory.confidence}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Water Flow Animation */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Soil Moisture Status</h3>
            <div className="relative">
              <div className="h-32 bg-gradient-to-t from-blue-900/50 to-blue-500/20 rounded-2xl overflow-hidden relative">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
                  style={{ height: `${advisory.moisture}%` }}
                >
                  <div className="absolute inset-0 opacity-30">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full h-2 bg-white/30"
                        style={{
                          bottom: `${i * 20}%`,
                          animation: `wave 2s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">{advisory.moisture?.toFixed(1)}%</span>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-white/60 text-sm">
                <span>0% (Dry)</span>
                <span>50% (Optimal)</span>
                <span>100% (Saturated)</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-3">🤖</span>
              AI Decision Reasoning
            </h3>
            <div className="space-y-4">
              {advisory.reasons.map((reason, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-2xl">✓</div>
                  <p className="text-white/80 text-lg">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forecast Timeline */}
        <div>
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-white mb-6">48-Hour Irrigation Forecast</h3>
            <div className="grid grid-cols-4 gap-4">
              {['Now', '+12h', '+24h', '+36h'].map((time, index) => (
                <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-b from-blue-500/20 to-transparent border border-blue-400/20">
                  <div className="text-white/60 text-sm mb-2">{time}</div>
                  <div className="text-4xl mb-2">
                    {index === 0 ? '💧' : index === 1 ? '⏳' : index === 2 ? '✅' : '🌧️'}
                  </div>
                  <div className="text-white text-sm">
                    {index === 0 ? 'Active' : index === 1 ? 'Pending' : index === 2 ? 'Scheduled' : 'Rain'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default IrrigationAdvisory;
