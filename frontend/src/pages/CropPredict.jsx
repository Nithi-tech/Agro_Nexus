import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cropService, sensorService } from '../services/api';

function CropPredict() {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
    location: '',
    latitude: null,
    longitude: null
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Helper function to evaluate parameter quality
  const getParameterQuality = (param, value) => {
    if (!value) return null;
    const val = parseFloat(value);
    
    const ranges = {
      nitrogen: { low: 50, optimal: [50, 100], high: 100 },
      phosphorus: { low: 30, optimal: [30, 60], high: 60 },
      potassium: { low: 30, optimal: [30, 60], high: 60 },
      temperature: { low: 20, optimal: [20, 30], high: 30 },
      humidity: { low: 50, optimal: [50, 80], high: 80 },
      ph: { low: 6, optimal: [6, 7.5], high: 7.5 },
      rainfall: { low: 100, optimal: [100, 200], high: 200 }
    };

    const range = ranges[param];
    if (!range) return null;

    if (val < range.optimal[0]) return { status: 'low', label: 'Low', color: 'text-orange-600 bg-orange-50' };
    if (val > range.optimal[1]) return { status: 'high', label: 'High', color: 'text-red-600 bg-red-50' };
    return { status: 'optimal', label: 'Optimal', color: 'text-green-600 bg-green-50' };
  };

  // Check if all data is validated
  const isDataValidated = () => {
    return Object.values(formData).every(val => val !== '');
  };

  // Get confidence level based on prediction confidence
  const getConfidenceLevel = (confidence) => {
    if (confidence >= 0.8) return { level: 'High', color: 'text-green-600 bg-green-50', risk: 'Low Risk' };
    if (confidence >= 0.6) return { level: 'Moderate', color: 'text-yellow-600 bg-yellow-50', risk: 'Medium Risk' };
    return { level: 'Low', color: 'text-orange-600 bg-orange-50', risk: 'High Risk' };
  };

  // Auto-populate form with sensor data (cached for 30 minutes)
  useEffect(() => {
    const loadSensorData = async () => {
      const CACHE_KEY = 'crop_predict_sensor_data';
      const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
      
      try {
        // Check localStorage for cached data
        const cachedData = localStorage.getItem(CACHE_KEY);
        let sensorData = null;
        let shouldFetchNew = true;

        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const age = Date.now() - timestamp;
          
          // Use cached data if less than 30 minutes old
          if (age < CACHE_DURATION) {
            sensorData = data;
            shouldFetchNew = false;
            const minutesAgo = Math.floor(age / 60000);
            setDataSource(`Auto-filled from dashboard (${minutesAgo} min ago)`);
          }
        }

        // Fetch new data if cache is expired or doesn't exist
        if (shouldFetchNew) {
          const response = await sensorService.getLatest();
          sensorData = response;
          
          // Cache the data with timestamp
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: sensorData,
            timestamp: Date.now()
          }));
          
          setDataSource('Auto-filled from dashboard (just now)');
          toast.success('Form auto-filled with latest sensor data');
        }

        // Populate form fields
        if (sensorData) {
          setFormData(prev => ({
            ...prev,
            nitrogen: sensorData.nitrogen?.toFixed(2) || '',
            phosphorus: sensorData.phosphorus?.toFixed(2) || '',
            potassium: sensorData.potassium?.toFixed(2) || '',
            temperature: sensorData.temperature?.toFixed(2) || '',
            humidity: sensorData.humidity?.toFixed(2) || '',
            ph: sensorData.soil_ph?.toFixed(2) || '',
            rainfall: '100.0' // Default value as sensor doesn't provide rainfall
            // Keep existing location, latitude, longitude if already set
          }));
        }
      } catch (error) {
        console.error('Error loading sensor data:', error);
        // Don't show error toast, just leave form empty for manual input
      }
    };

    loadSensorData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = {
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity),
        ph: parseFloat(formData.ph),
        rainfall: parseFloat(formData.rainfall),
        location: formData.location || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        language: i18n.language || 'en'
      };
      
      console.log('[CropPredict] Sending to API:', JSON.stringify(data, null, 2));
      const response = await cropService.predictCrop(data);
      console.log('[CropPredict] API Response:', JSON.stringify(response, null, 2));
      // Map API response fields to frontend display fields
      setPrediction({
        crop: response.recommended_crop || response.crop || 'Unknown',
        confidence: response.confidence || 0,
        recommendations: response.reasoning || response.recommendations || '',
        alternatives: response.alternative_crops || response.alternatives || [],
        model_used: response.model_used || 'AI',
        yield_potential: response.yield_potential || '',
        growing_tips: response.growing_tips || []
      });
      toast.success(t('cropPredict.predictionSuccess'));
    } catch (error) {
      console.error('Crop prediction error:', error);
      toast.error(t('cropPredict.predictionError'));
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    toast.loading('Fetching your location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get location name with accept-language for accuracy
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=14&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await response.json();
          
          // Prefer recognizable names: city > town > municipality > district, skip tiny villages
          const addr = data.address;
          const locationName = addr.city || 
                               addr.town || 
                               addr.municipality ||
                               addr.city_district ||
                               addr.suburb ||
                               addr.district ||
                               addr.state_district ||
                               addr.county ||
                               addr.village ||
                               addr.state || 
                               'Unknown Location';
          const districtName = addr.district || addr.state_district || '';
          const stateName = addr.state || '';
          
          // Build accurate location: Name, District, State, Country
          const locationParts = [locationName];
          if (districtName && districtName !== locationName) locationParts.push(districtName);
          if (stateName && stateName !== locationName && stateName !== districtName) locationParts.push(stateName);
          if (addr.country) locationParts.push(addr.country);
          const fullLocation = locationParts.join(', ');
          
          setFormData({
            ...formData,
            location: fullLocation,
            latitude,
            longitude
          });
          
          toast.dismiss();
          toast.success(`Location set to ${fullLocation}`);
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          setFormData({
            ...formData,
            location: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
            latitude,
            longitude
          });
          toast.dismiss();
          toast.success('GPS coordinates captured!');
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.dismiss();
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('Location permission denied. Please enable location access.');
        } else {
          toast.error('Unable to retrieve your location');
        }
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleRefreshData = async () => {
    const CACHE_KEY = 'crop_predict_sensor_data';
    
    try {
      toast.loading('Fetching latest sensor data...');
      const response = await sensorService.getLatest();
      
      // Update cache with new data
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: response,
        timestamp: Date.now()
      }));
      
      // Update form fields while preserving location
      setFormData(prev => ({
        ...prev,
        nitrogen: response.nitrogen?.toFixed(2) || '',
        phosphorus: response.phosphorus?.toFixed(2) || '',
        potassium: response.potassium?.toFixed(2) || '',
        temperature: response.temperature?.toFixed(2) || '',
        humidity: response.humidity?.toFixed(2) || '',
        ph: response.soil_ph?.toFixed(2) || '',
        rainfall: '100.0'
        // Keep existing location, latitude, longitude
      }));
      
      setDataSource('Auto-filled from dashboard (just now)');
      toast.dismiss();
      toast.success('Form updated with latest sensor data');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to fetch sensor data');
    }
  };

  return (
    <div className="min-h-screen relative bg-transparent">

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-950 mb-2" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>
                {t('cropPredict.title')}
              </h1>
              <p className="text-gray-700 flex items-center space-x-2 font-medium">
                <span className="text-xl">🌾</span>
                <span>{t('cropPredict.subtitle')}</span>
              </p>
            </div>
            
            {/* AI Readiness Summary */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 min-w-[240px]">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">🤖</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{t('cropPredict.aiReadiness')}</h3>
                  <p className={`text-xs font-medium ${isDataValidated() ? 'text-green-600' : 'text-orange-600'}`}>
                    {isDataValidated() ? t('cropPredict.dataValidated') : t('cropPredict.awaitingInput')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center space-x-1 ${formData.nitrogen && formData.phosphorus && formData.potassium ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{formData.nitrogen && formData.phosphorus && formData.potassium ? '✔' : '○'}</span>
                  <span>{t('cropPredict.soilNPK')}</span>
                </div>
                <div className={`flex items-center space-x-1 ${formData.temperature && formData.humidity ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{formData.temperature && formData.humidity ? '✔' : '○'}</span>
                  <span>{t('cropPredict.climate')}</span>
                </div>
                <div className={`flex items-center space-x-1 ${formData.rainfall ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{formData.rainfall ? '✔' : '○'}</span>
                  <span>{t('cropPredict.rainfall')}</span>
                </div>
                <div className={`flex items-center space-x-1 ${dataSource ? 'text-green-600' : 'text-gray-400'}`}>
                  <span>{dataSource ? '✔' : '○'}</span>
                  <span>{t('cropPredict.dataFresh')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Micro Explanation */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">{t('cropPredict.howAIWorks')}</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  {t('cropPredict.howAIWorksDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{t('cropPredict.enterSoilParams')}</h2>
            <button
              type="button"
              onClick={handleRefreshData}
              className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              <span>🔄</span>
              <span>{t('cropPredict.refresh')}</span>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cropPredict.nitrogenN')}
                  </label>
                  {formData.nitrogen && getParameterQuality('nitrogen', formData.nitrogen) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getParameterQuality('nitrogen', formData.nitrogen).color}`}>
                      {t(`cropPredict.${getParameterQuality('nitrogen', formData.nitrogen).status}`)}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cropPredict.phosphorusP')}
                  </label>
                  {formData.phosphorus && getParameterQuality('phosphorus', formData.phosphorus) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getParameterQuality('phosphorus', formData.phosphorus).color}`}>
                      {t(`cropPredict.${getParameterQuality('phosphorus', formData.phosphorus).status}`)}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cropPredict.potassiumK')}
                  </label>
                  {formData.potassium && getParameterQuality('potassium', formData.potassium) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getParameterQuality('potassium', formData.potassium).color}`}>
                      {t(`cropPredict.${getParameterQuality('potassium', formData.potassium).status}`)}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cropPredict.temperatureC')}
                  </label>
                  {formData.temperature && getParameterQuality('temperature', formData.temperature) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getParameterQuality('temperature', formData.temperature).color}`}>
                      {t(`cropPredict.${getParameterQuality('temperature', formData.temperature).status}`)}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cropPredict.humidityPercent')}
                  </label>
                  {formData.humidity && getParameterQuality('humidity', formData.humidity) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getParameterQuality('humidity', formData.humidity).color}`}>
                      {t(`cropPredict.${getParameterQuality('humidity', formData.humidity).status}`)}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cropPredict.phLevel')}
                  </label>
                  {formData.ph && getParameterQuality('ph', formData.ph) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getParameterQuality('ph', formData.ph).color}`}>
                      {t(`cropPredict.${getParameterQuality('ph', formData.ph).status}`)}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('cropPredict.rainfallMm')}
                  </label>
                  {formData.rainfall && getParameterQuality('rainfall', formData.rainfall) && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getParameterQuality('rainfall', formData.rainfall).color}`}>
                      {t(`cropPredict.${getParameterQuality('rainfall', formData.rainfall).status}`)}
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    📍 Location (Optional)
                  </label>
                  {formData.latitude && formData.longitude && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">
                      ✓ GPS Enabled
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter location or use GPS"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={gpsLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition"
                  >
                    {gpsLoading ? (
                      <>
                        <span className="animate-spin">⟳</span>
                        <span>Getting...</span>
                      </>
                    ) : (
                      <>
                        <span>📍</span>
                        <span>GPS</span>
                      </>
                    )}
                  </button>
                </div>
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinates: {formData.latitude.toFixed(4)}°N, {formData.longitude.toFixed(4)}°E
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? t('cropPredict.analyzing') : t('cropPredict.predictCrop')}
            </button>
          </form>
        </div>

        {/* Expected Outcome Preview - shown before prediction */}
        {!prediction && (
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-300">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🔮</span>
              <h2 className="text-xl font-bold text-gray-700">{t('cropPredict.expectedOutcome')}</h2>
            </div>
            
            <div className="bg-white/60 p-5 rounded-xl border border-gray-200 text-center">
              <div className="mb-4">
                <span className="text-5xl opacity-30">🌱</span>
              </div>
              <p className="text-lg font-semibold text-gray-500 mb-2">{t('cropPredict.expectedCropCategory')}</p>
              <p className="text-sm text-gray-400 mb-4">{t('cropPredict.finalResultAfterAI')}</p>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{t('cropPredict.confidenceScore')}</p>
                  <p className="text-sm font-semibold text-gray-400">---%</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">{t('cropPredict.riskLevel')}</p>
                  <p className="text-sm font-semibold text-gray-400">---</p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  ⚡ {t('cropPredict.submitForRecommendations')}
                </p>
              </div>
            </div>
          </div>
        )}

        {prediction && (
          <div className="bg-white backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-200">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-2xl">✅</span>
              <h2 className="text-xl font-bold text-green-700">
                {t('cropPredict.aiPredictionResult')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-200 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-medium">{t('cropPredict.recommendedCrop')}</p>
                  <span className="text-3xl">🌱</span>
                </div>
                <p className="text-3xl font-bold text-green-700 mb-2">{prediction.crop}</p>
                <p className="text-xs text-green-600">{t('cropPredict.bestSuited')}</p>
              </div>

              {/* Enhanced Confidence & Risk Display */}
              <div className="grid grid-cols-2 gap-4">
                {prediction.confidence && (
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-gray-600 mb-1 font-medium flex items-center space-x-1">
                      <span>📊</span>
                      <span>{t('cropPredict.confidenceLabel')}</span>
                    </p>
                    <p className="text-2xl font-bold text-blue-700">{(prediction.confidence * 100).toFixed(1)}%</p>
                    {getConfidenceLevel(prediction.confidence) && (
                      <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${getConfidenceLevel(prediction.confidence).color}`}>
                        {prediction.confidence >= 0.8 ? t('cropPredict.highConfidence') : prediction.confidence >= 0.6 ? t('cropPredict.moderateConfidence') : t('cropPredict.lowConfidence')}
                      </span>
                    )}
                  </div>
                )}

                {prediction.confidence && (
                  <div className={`p-4 rounded-xl border ${
                    getConfidenceLevel(prediction.confidence).risk === 'Low Risk' 
                      ? 'bg-green-50 border-green-100' 
                      : getConfidenceLevel(prediction.confidence).risk === 'Medium Risk'
                      ? 'bg-yellow-50 border-yellow-100'
                      : 'bg-orange-50 border-orange-100'
                  }`}>
                    <p className="text-xs text-gray-600 mb-1 font-medium flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{t('cropPredict.riskIndicator')}</span>
                    </p>
                    <p className={`text-2xl font-bold ${
                      getConfidenceLevel(prediction.confidence).risk === 'Low Risk'
                        ? 'text-green-700'
                        : getConfidenceLevel(prediction.confidence).risk === 'Medium Risk'
                        ? 'text-yellow-700'
                        : 'text-orange-700'
                    }`}>
                      {prediction.confidence >= 0.8 ? t('cropPredict.lowRisk').split(' ')[0] : prediction.confidence >= 0.6 ? t('cropPredict.mediumRisk').split(' ')[0] : t('cropPredict.highRisk').split(' ')[0]}
                    </p>
                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full font-medium ${getConfidenceLevel(prediction.confidence).color}`}>
                      {prediction.confidence >= 0.8 ? t('cropPredict.lowRisk') : prediction.confidence >= 0.6 ? t('cropPredict.mediumRisk') : t('cropPredict.highRisk')}
                    </span>
                  </div>
                )}
              </div>

              {/* Yield Potential */}
              {prediction.yield_potential && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-xl border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">📈</span>
                    <p className="text-sm text-gray-700 font-semibold">{t('cropPredict.yieldPotential')}</p>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{prediction.yield_potential}</p>
                </div>
              )}

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border border-amber-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xl">💡</span>
                    <p className="text-sm text-gray-700 font-semibold">{t('cropPredict.whyThisCrop')}</p>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {prediction.recommendations || t('cropPredict.bestSuited')}
                </p>
              </div>

              {/* Alternative Crops */}
              {prediction.alternatives && prediction.alternatives.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">🌿</span>
                    <p className="text-sm text-gray-700 font-semibold">{t('cropPredict.alternativeCrops')}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {prediction.alternatives.map((alt, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/70 px-4 py-2 rounded-lg border border-purple-100">
                        <span className="font-medium text-gray-800">{alt.crop || alt.name || 'Unknown'}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(alt.confidence || 0) * 100}%` }}></div>
                          </div>
                          <span className="text-xs text-purple-700 font-medium">{((alt.confidence || 0) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Growing Tips */}
              {prediction.growing_tips && prediction.growing_tips.length > 0 && (
                <div className="bg-gradient-to-br from-teal-50 to-green-50 p-5 rounded-xl border border-teal-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xl">📋</span>
                    <p className="text-sm text-gray-700 font-semibold">{t('cropPredict.growingTips')}</p>
                  </div>
                  <ul className="space-y-2">
                    {prediction.growing_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Action Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <span>🚀</span>
                  <span>{t('cropPredict.nextActions')}</span>
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => navigate('/fertilizer')}
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🧪</span>
                      <div className="text-left">
                        <p className="font-semibold">{t('cropPredict.viewFertilizer')}</p>
                        <p className="text-xs opacity-90">{t('cropPredict.optimizeNutrients')} {prediction.crop}</p>
                      </div>
                    </div>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => navigate('/irrigation')}
                    className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">💧</span>
                      <div className="text-left">
                        <p className="font-semibold">{t('cropPredict.checkIrrigation')}</p>
                        <p className="text-xs opacity-90">{t('cropPredict.smartWatering')}</p>
                      </div>
                    </div>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default CropPredict;
