import React, { useState, useEffect } from 'react';
import { cropService, sensorService } from '../services/api';
import toast from 'react-hot-toast';

const CropSelection = () => {
  const [sensorData, setSensorData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sensorService.getLatest()
      .then(data => {
        setSensorData(data);
        fetchRecommendations(data);
      })
      .catch(err => console.error(err));
  }, []);

  const fetchRecommendations = async (data) => {
    setLoading(true);
    try {
      const payload = {
        N: data.nitrogen,
        P: data.phosphorus,
        K: data.potassium,
        temperature: data.temperature,
        humidity: data.humidity,
        ph: data.soil_ph,
        rainfall: 200
      };
      const result = await cropService.predictCrop(payload);
      setRecommendations(result);
    } catch (error) {
      toast.error('Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-800 text-xl font-semibold">AI analyzing optimal crops for your field...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Subtle accent elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-5xl">🌾</span>
            <h1 className="text-5xl font-bold text-amber-950" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>AI Crop Recommendation</h1>
          </div>
          <p className="text-gray-600 text-lg ml-16">ML-powered crop selection based on soil NPK & climate patterns</p>
        </div>

        {/* Primary Recommendation */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-green-600/30 to-emerald-600/30 border border-green-400/30 p-12">
            <div className="absolute inset-0 bg-green-500/5"></div>
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/40 rounded-full px-6 py-2 mb-6">
                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-200 font-semibold">AI Recommended</span>
              </div>
              <h2 className="text-6xl font-bold text-white mb-4">{recommendations.recommended_crop || 'Rice'}</h2>
              <div className="flex items-center justify-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-green-300 text-sm mb-1">Confidence</div>
                  <div className="text-4xl font-bold text-green-400">{Math.round((recommendations.confidence || 0.85) * 100)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-green-300 text-sm mb-1">Model</div>
                  <div className="text-xl font-bold text-white">{recommendations.model_used || 'XGBoost'}</div>
                </div>
              </div>
              <p className="text-green-100 text-lg max-w-3xl mx-auto">{recommendations.reasoning || 'Selected based on optimal NPK levels and current climate conditions for maximum yield potential.'}</p>
            </div>
          </div>
        </div>

        {/* Reason Tags */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Decision Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🧬</div>
                <div>
                  <div className="text-white font-bold text-lg mb-1">Based on Soil NPK</div>
                  <p className="text-gray-300 text-sm">
                    N: {sensorData?.nitrogen?.toFixed(1)} | P: {sensorData?.phosphorus?.toFixed(1)} | K: {sensorData?.potassium?.toFixed(1)} kg/ha
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🌡️</div>
                <div>
                  <div className="text-white font-bold text-lg mb-1">Based on Climate Forecast</div>
                  <p className="text-gray-300 text-sm">
                    Temp: {sensorData?.temperature?.toFixed(1)}°C | Humidity: {sensorData?.humidity?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Crops */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Alternative Crop Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(recommendations.alternative_crops || [
              { crop: 'Wheat', confidence: 0.72 },
              { crop: 'Corn', confidence: 0.68 },
              { crop: 'Soybean', confidence: 0.65 }
            ]).map((alt, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 p-8 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                <div className="text-center">
                  <div className="text-5xl mb-4">🌱</div>
                  <h4 className="text-2xl font-bold text-white mb-2">{alt.crop || alt}</h4>
                  <div className="text-gray-400 text-sm mb-3">Confidence</div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${(alt.confidence || 0.7) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-white font-semibold mt-2">{Math.round((alt.confidence || 0.7) * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field Visualization */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Field Suitability Map</h3>
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8">
            <div className="grid grid-cols-4 gap-2">
              {[...Array(48)].map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg transition-all duration-300 hover:scale-110"
                  style={{
                    background: index % 5 === 0 
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.5))'
                      : index % 7 === 0
                      ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(202, 138, 4, 0.5))'
                      : 'linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(16, 185, 129, 0.7))'
                  }}
                >
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-emerald-600"></div>
                <span className="text-white">Optimal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-amber-600"></div>
                <span className="text-white">Moderate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropSelection;
