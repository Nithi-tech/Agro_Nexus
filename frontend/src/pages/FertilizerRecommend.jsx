import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fertilizerService, sensorService } from '../services/api';

function FertilizerRecommend() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    crop_type: '',
    soil_type: ''
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const { t } = useTranslation();

  // Auto-populate NPK values from sensor data (cached for 30 minutes)
  useEffect(() => {
    const loadSensorData = async () => {
      const CACHE_KEY = 'fertilizer_sensor_data';
      const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
      
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        let sensorData = null;
        let shouldFetchNew = true;

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const age = Date.now() - timestamp;
          
          if (age < CACHE_DURATION) {
            sensorData = data;
            shouldFetchNew = false;
            const minutesAgo = Math.floor(age / 60000);
            setDataSource(`NPK values from dashboard (${minutesAgo} min ago)`);
          }
        }

        if (shouldFetchNew) {
          const response = await sensorService.getLatest();
          sensorData = response;
          
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: sensorData,
            timestamp: Date.now()
          }));
          
          setDataSource('NPK values from dashboard (just now)');
          toast.success('NPK values auto-filled from dashboard');
        }

        if (sensorData) {
          setFormData(prev => ({
            ...prev,
            nitrogen: sensorData.nitrogen?.toFixed(2) || '',
            phosphorus: sensorData.phosphorus?.toFixed(2) || '',
            potassium: sensorData.potassium?.toFixed(2) || ''
          }));
        }
      } catch (error) {
        console.error('Error loading sensor data:', error);
      }
    };

    loadSensorData();
  }, []);

  const cropTypes = ['Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane', 'Potato', 'Tomato'];
  const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Red', 'Black'];

  // Helper function to evaluate NPK status
  const getNutrientStatus = (nutrient, value) => {
    if (!value) return { status: 'unknown', label: 'Not Measured', color: 'bg-gray-100 text-gray-600', icon: '○' };
    const val = parseFloat(value);
    
    const thresholds = {
      nitrogen: { low: 50, high: 100 },
      phosphorus: { low: 30, high: 60 },
      potassium: { low: 30, high: 60 }
    };

    const range = thresholds[nutrient];
    if (val < range.low) return { status: 'low', label: 'Deficient', color: 'bg-red-100 text-red-700 border-red-300', icon: '⬇️' };
    if (val > range.high) return { status: 'high', label: 'Excess', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: '⬆️' };
    return { status: 'optimal', label: 'Optimal', color: 'bg-green-100 text-green-700 border-green-300', icon: '✓' };
  };

  // Get application intensity based on fertilizer name
  const getApplicationIntensity = (fertilizerName) => {
    if (!fertilizerName) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
    
    const name = fertilizerName.toLowerCase();
    if (name.includes('urea') || name.includes('10-26-26')) {
      return { level: 'High', color: 'bg-red-100 text-red-700' };
    } else if (name.includes('dap') || name.includes('20-20')) {
      return { level: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
    }
    return { level: 'Low', color: 'bg-green-100 text-green-700' };
  };

  // Get nutrient impact (what will change after applying fertilizer)
  const getNutrientImpact = (nutrient, currentValue, fertilizerName) => {
    if (!currentValue || !fertilizerName) return { action: 'Stable', color: 'text-gray-600 bg-gray-50', icon: '→' };
    
    const status = getNutrientStatus(nutrient, currentValue).status;
    const name = fertilizerName.toLowerCase();
    
    // Check what the fertilizer will do based on NPK ratio and deficiency
    if (status === 'low') {
      // Deficient - fertilizer will increase
      if (nutrient === 'nitrogen' && (name.includes('urea') || name.includes('n'))) {
        return { action: 'Increase', color: 'text-green-600 bg-green-50 border-green-200', icon: '↑' };
      }
      if (nutrient === 'phosphorus' && (name.includes('dap') || name.includes('p'))) {
        return { action: 'Increase', color: 'text-green-600 bg-green-50 border-green-200', icon: '↑' };
      }
      if (nutrient === 'potassium' && (name.includes('k') || name.includes('potash'))) {
        return { action: 'Increase', color: 'text-green-600 bg-green-50 border-green-200', icon: '↑' };
      }
      return { action: 'Increase', color: 'text-green-600 bg-green-50 border-green-200', icon: '↑' };
    } else if (status === 'high') {
      // Excess - keep stable
      return { action: 'Stable', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: '→' };
    }
    
    // Optimal - maintain
    return { action: 'Stable', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: '→' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        crop_type: formData.crop_type,
        soil_type: formData.soil_type,
        soil_ph: 6.5, // Default pH value
        moisture: 50.0 // Default moisture value
      };
      
      const response = await fertilizerService.recommendFertilizer(data);
      console.log('Fertilizer API Response:', response); // Debug log
      setRecommendation(response);
      toast.success(t('recommendation_success') || 'Recommendation generated!');
    } catch (error) {
      toast.error(t('recommendation_error') || 'Recommendation failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = async () => {
    const CACHE_KEY = 'fertilizer_sensor_data';
    
    try {
      toast.loading('Fetching latest NPK values...');
      const response = await sensorService.getLatest();
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: response,
        timestamp: Date.now()
      }));
      
      setFormData(prev => ({
        ...prev,
        nitrogen: response.nitrogen?.toFixed(2) || '',
        phosphorus: response.phosphorus?.toFixed(2) || '',
        potassium: response.potassium?.toFixed(2) || ''
      }));
      
      setDataSource('NPK values from dashboard (just now)');
      toast.dismiss();
      toast.success('NPK values updated from dashboard');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to fetch sensor data');
    }
  };

  return (
    <div className="min-h-screen relative bg-transparent">
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-950 mb-2" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>
            {t('fertilizer.title') || 'Fertilizer Recommendation'}
          </h1>
          <p className="text-gray-700 flex items-center space-x-2 font-medium">
            <span className="text-xl">🧪</span>
            <span>{t('fertilizerExtras.subtitle')}</span>
          </p>
        </div>

        {/* OUTPUT SECTION: AI FERTILIZER PRESCRIPTION REPORT */}
        {recommendation && (
          <>
            {/* 1. PRESCRIPTION HEADER (Full Width) */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl shadow-xl p-6 mb-6 text-white border-2 border-green-700">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-4xl">🏥</span>
                  <h1 className="text-3xl font-bold">{t('fertilizerExtras.fertilizerPrescription') || 'Fertilizer Prescription Report'}</h1>
                </div>
                <p className="text-green-100 text-sm">{t('fertilizerExtras.generatedByAI') || 'Generated by AI based on soil & crop data analysis'}</p>
                <div className="mt-3 flex items-center justify-center space-x-4 text-xs">
                  <span className="bg-white/20 px-3 py-1 rounded-full">✓ {t('fertilizerExtras.soilAnalyzed') || 'Soil Analyzed'}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">✓ {t('fertilizerExtras.cropSpecific') || 'Crop-Specific'}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">✓ {t('fertilizerExtras.aiVerified') || 'AI-Verified'}</span>
                </div>
              </div>
            </div>

            {/* 2. RECOMMENDED FERTILIZER (PRIMARY - Large Centered Card) */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-300 mb-6">
              <div className="text-center mb-6">
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
                  ✓ AI RECOMMENDED
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Prescribed Fertilizer</h2>
              </div>

              {/* Main Fertilizer Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-5">
                <div className="text-center mb-4">
                  <span className="text-5xl mb-3 block">🌿</span>
                  <p className="text-4xl font-bold text-green-700 mb-2">{recommendation.fertilizer_name}</p>
                  <p className="text-lg text-gray-600 font-medium">{recommendation.fertilizer_type}</p>
                  <p className="text-sm text-gray-600 mt-1">For {formData.crop_type} in {formData.soil_type} Soil</p>
                </div>

                {/* Purpose & Application Level */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Purpose</p>
                    <p className="text-lg font-bold text-blue-700">{recommendation.fertilizer_type || 'Nutrient Correction'}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300 text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Quantity</p>
                    <p className="text-lg font-bold text-yellow-800">{recommendation.quantity_kg_per_acre} kg/acre</p>
                  </div>
                </div>

                {recommendation.cost_estimate && (
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg border-2 border-purple-300 text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Estimated Cost</p>
                    <p className="text-3xl font-bold text-purple-900">₹{recommendation.cost_estimate}</p>
                  </div>
                )}
              </div>

              {/* Why This Fertilizer */}
              <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">💡</span>
                  <p className="font-semibold text-blue-900">Why This Fertilizer?</p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {recommendation.reasoning || recommendation.soil_health_tips || 
                   `Based on comprehensive analysis of your soil's NPK profile and ${formData.crop_type} crop requirements 
                   in ${formData.soil_type} soil conditions, this fertilizer will effectively balance nutrient deficiencies 
                   and promote optimal crop growth and yield.`}
                </p>
                {recommendation.expected_benefits && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-blue-800 font-semibold mb-1">Expected Benefits:</p>
                    <p className="text-sm text-gray-700">{recommendation.expected_benefits}</p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. NUTRIENT IMPACT SUMMARY */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center space-x-2 mb-5">
                <span className="text-2xl">📊</span>
                <h2 className="text-xl font-bold text-gray-800">Nutrient Impact Summary</h2>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">After Application</span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Nitrogen Impact */}
                <div className={`p-5 rounded-xl border-2 ${getNutrientImpact('nitrogen', formData.nitrogen, recommendation.fertilizer_name).color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Nitrogen (N)</p>
                    <span className="text-3xl">{getNutrientImpact('nitrogen', formData.nitrogen, recommendation.fertilizer_name).icon}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Current: {parseFloat(formData.nitrogen).toFixed(1)}</p>
                  <p className="text-lg font-bold">{getNutrientImpact('nitrogen', formData.nitrogen, recommendation.fertilizer_name).action}</p>
                </div>

                {/* Phosphorus Impact */}
                <div className={`p-5 rounded-xl border-2 ${getNutrientImpact('phosphorus', formData.phosphorus, recommendation.fertilizer_name).color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Phosphorus (P)</p>
                    <span className="text-3xl">{getNutrientImpact('phosphorus', formData.phosphorus, recommendation.fertilizer_name).icon}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Current: {parseFloat(formData.phosphorus).toFixed(1)}</p>
                  <p className="text-lg font-bold">{getNutrientImpact('phosphorus', formData.phosphorus, recommendation.fertilizer_name).action}</p>
                </div>

                {/* Potassium Impact */}
                <div className={`p-5 rounded-xl border-2 ${getNutrientImpact('potassium', formData.potassium, recommendation.fertilizer_name).color}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Potassium (K)</p>
                    <span className="text-3xl">{getNutrientImpact('potassium', formData.potassium, recommendation.fertilizer_name).icon}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Current: {parseFloat(formData.potassium).toFixed(1)}</p>
                  <p className="text-lg font-bold">{getNutrientImpact('potassium', formData.potassium, recommendation.fertilizer_name).action}</p>
                </div>
              </div>
            </div>

            {/* 4. APPLICATION GUIDELINES */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 mb-6">
              <div className="flex items-center space-x-2 mb-5">
                <span className="text-2xl">📖</span>
                <h2 className="text-xl font-bold text-gray-800">Application Guidelines</h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* When to Apply */}
                <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-3xl">⏰</span>
                    <div>
                      <p className="text-sm font-bold text-blue-900">When to Apply</p>
                      <p className="text-xs text-blue-700">Timing</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {recommendation.timing || 'Apply during early growth stage or before sowing. Best results when applied before rainfall or irrigation.'}
                  </p>
                </div>

                {/* Application Method */}
                <div className="bg-purple-50 p-5 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-3xl">⚖️</span>
                    <div>
                      <p className="text-sm font-bold text-purple-900">How to Apply</p>
                      <p className="text-xs text-purple-700">Method</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {recommendation.application_method || 'Broadcast and incorporate into soil, followed by irrigation.'}
                  </p>
                </div>

                {/* Safety & Caution */}
                <div className="bg-orange-50 p-5 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-3xl">⚠️</span>
                    <div>
                      <p className="text-sm font-bold text-orange-900">Safety Note</p>
                      <p className="text-xs text-orange-700">Precautions</p>
                    </div>
                  </div>
                  {recommendation.precautions && recommendation.precautions.length > 0 ? (
                    <ul className="text-sm text-gray-700 leading-relaxed space-y-1">
                      {recommendation.precautions.slice(0, 2).map((precaution, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Wear protective equipment. Avoid direct skin contact. Store in cool, dry place.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 5. NEXT ACTIONS */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl shadow-lg p-6 border border-gray-300 mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🚀</span>
                <h2 className="text-xl font-bold text-gray-800">Next Steps</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/crop-predict')}
                  className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition shadow-md group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">🌾</span>
                    <div className="text-left">
                      <p className="font-semibold text-lg">View Crop Recommendation</p>
                      <p className="text-xs opacity-90">Find best crops for your soil</p>
                    </div>
                  </div>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <button
                  onClick={() => navigate('/irrigation')}
                  className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition shadow-md group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">💧</span>
                    <div className="text-left">
                      <p className="font-semibold text-lg">Check Irrigation Advisory</p>
                      <p className="text-xs opacity-90">Get smart watering schedule</p>
                    </div>
                  </div>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* INPUT FORM SECTION (Secondary, Bottom) */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-300">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{t('fertilizerExtras.soilCropInputData')}</h2>
              <p className="text-sm text-gray-600 mt-1">{t('fertilizerExtras.enterFieldInfo')}</p>
            </div>
            <button
              type="button"
              onClick={handleRefreshData}
              className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              <span>🔄</span>
              <span>{t('fertilizerExtras.refreshNPK')}</span>
            </button>
          </div>
          
          {dataSource && (
            <div className="mb-4 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700 flex items-center space-x-2">
                <span>ℹ️</span>
                <span>{dataSource}</span>
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* NPK Inputs */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cropPredict.nitrogenN')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cropPredict.phosphorusP')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('cropPredict.potassiumK')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fertilizerExtras.cropType')}
                </label>
                <select
                  required
                  value={formData.crop_type}
                  onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="">{t('fertilizerExtras.select')}</option>
                  {cropTypes.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('fertilizerExtras.soilType')}
                </label>
                <select
                  required
                  value={formData.soil_type}
                  onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="">{t('fertilizerExtras.select')}</option>
                  {soilTypes.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition shadow-md"
              >
                {loading ? t('fertilizer.recommending') : `🔬 ${t('fertilizerExtras.generatePrescription')}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FertilizerRecommend;
