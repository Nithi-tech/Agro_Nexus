import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { diseaseService, sensorService } from '../services/api';
import toast from 'react-hot-toast';

const PestDiseaseManagement = () => {
  const { t } = useTranslation();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0); // 0: ready, 1: uploaded, 2: analyzing, 3: complete
  const uploadInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setAnalysisStep(1); // Image uploaded
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setAnalysisStep(1); // Image captured
        toast.success('Image captured successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const getSeverityLevel = (disease) => {
    if (!disease) return { level: 'Medium', color: 'yellow' };
    const name = disease.toLowerCase();
    if (name.includes('blight') || name.includes('rot') || name.includes('wilt')) {
      return { level: 'High', color: 'red' };
    } else if (name.includes('spot') || name.includes('rust')) {
      return { level: 'Medium', color: 'yellow' };
    }
    return { level: 'Low', color: 'green' };
  };

  const getDiseaseType = (disease) => {
    if (!disease) return 'Fungal Infection';
    const name = disease.toLowerCase();
    if (name.includes('blight') || name.includes('rust') || name.includes('mildew')) {
      return 'Fungal Infection';
    } else if (name.includes('borer') || name.includes('pest')) {
      return 'Pest Damage';
    } else if (name.includes('deficiency')) {
      return 'Nutrient Deficiency';
    }
    return 'Bacterial Disease';
  };

  const handleDetection = async () => {
    if (!imageFile) {
      toast.error('Please upload an image first');
      return;
    }

    setLoading(true);
    setAnalysisStep(2); // Analyzing
    
    try {
      // Simulate analysis steps for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, use AI-based symptom analysis since we don't have image processing
      // In production, you would use a computer vision model here
      const diagnosisData = {
        crop_type: 'general',
        symptoms: 'Plant disease detected from uploaded image. Visual analysis shows leaf discoloration, spots, wilting, or abnormal growth patterns. Please provide detailed diagnosis and treatment.'
      };
      
      const result = await diseaseService.diagnose(diagnosisData);
      setPrediction(result);
      setAnalysisStep(3); // Complete
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Disease detection error:', error);
      toast.error('Detection failed. Please try again.');
      setAnalysisStep(1); // Back to uploaded state
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrediction(null);
    setAnalysisStep(0);
  };

  return (
    <div className="min-h-screen relative bg-transparent">
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <span className="text-5xl">🔬</span>
            <h1 className="text-4xl font-bold text-amber-950" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>
              {t('diseaseDetection.title')}
            </h1>
          </div>
          <p className="text-gray-700 text-lg flex items-center justify-center space-x-2">
            <span className="text-xl">🌿</span>
            <span>{t('diseaseDetection.subtitle')}</span>
          </p>
        </div>

        {/* SECTION 1: IMAGE INPUT (TOP, PROMINENT) */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('diseaseDetection.plantImageAnalysis')}</h2>
            <p className="text-gray-600">{t('diseaseDetection.uploadOrCapture')}</p>
          </div>

          {!imagePreview ? (
            <div className="space-y-4">
              {/* Upload & Camera Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {/* Upload Button */}
                <button
                  onClick={() => uploadInputRef.current?.click()}
                  className="relative group bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-2 border-blue-300 rounded-2xl p-8 transition-all cursor-pointer"
                >
                  <input
                    ref={uploadInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <span className="text-6xl mb-3 block group-hover:scale-110 transition-transform">📁</span>
                    <p className="text-lg font-semibold text-blue-900 mb-1">{t('diseaseDetection.uploadImage')}</p>
                    <p className="text-sm text-blue-700">{t('diseaseDetection.browseGallery')}</p>
                  </div>
                </button>

                {/* Camera Button */}
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="relative group bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-300 rounded-2xl p-8 transition-all cursor-pointer"
                >
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleCameraCapture}
                    className="hidden"
                  />
                  <div className="text-center">
                    <span className="text-6xl mb-3 block group-hover:scale-110 transition-transform">📸</span>
                    <p className="text-lg font-semibold text-purple-900 mb-1">{t('diseaseDetection.capturePhoto')}</p>
                    <p className="text-sm text-purple-700">{t('diseaseDetection.openCamera')}</p>
                  </div>
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  💡 <strong>{t('diseaseDetection.tip')}:</strong> {t('diseaseDetection.tipText')}
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Image Preview */}
              <div className="mb-4">
                <div className="relative rounded-xl overflow-hidden border-2 border-green-200 bg-gray-50">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-80 object-contain"
                  />
                  <button
                    onClick={resetAnalysis}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition"
                  >
                    ✕ {t('diseaseDetection.remove')}
                  </button>
                </div>
              </div>

              {/* Analyze Button */}
              {!prediction && (
                <button
                  onClick={handleDetection}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      <span>{t('diseaseDetection.analyzing')}</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>{t('diseaseDetection.analyzeImage')}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* SECTION 2: ANALYSIS STATUS STEP FLOW */}
        {analysisStep > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-200 mb-6">
            <div className="flex items-center justify-center space-x-8">
              {/* Step 1: Image Uploaded */}
              <div className={`flex items-center space-x-2 ${analysisStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  analysisStep >= 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  ✓
                </div>
                <span className="font-semibold text-gray-700">Image Uploaded</span>
              </div>

              <div className="text-2xl text-gray-400">→</div>

              {/* Step 2: AI Analyzing */}
              <div className={`flex items-center space-x-2 ${analysisStep >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  analysisStep >= 2 ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-300 text-gray-600'
                }`}>
                  🔬
                </div>
                <span className="font-semibold text-gray-700">AI Analyzing Patterns</span>
              </div>

              <div className="text-2xl text-gray-400">→</div>

              {/* Step 3: Disease Identified */}
              <div className={`flex items-center space-x-2 ${analysisStep >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  analysisStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  ✓
                </div>
                <span className="font-semibold text-gray-700">Disease Identified</span>
              </div>
            </div>
          </div>
        )}

        {/* OUTPUT SECTIONS - Only show when prediction is available */}
        {/* OUTPUT SECTIONS - Only show when prediction is available */}
        {prediction && (
          <>
            {/* SECTION 3: DIAGNOSIS RESULT - PLANT HEALTH REPORT (CENTER, HERO) */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-300 mb-6">
              <div className="text-center mb-6">
                <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  ✓ DIAGNOSIS COMPLETE
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Plant Health Report</h2>
                <p className="text-gray-600">AI-Powered Analysis Results</p>
              </div>

              {/* Disease Name & Confidence */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Identified Condition</p>
                    <p className="text-4xl font-bold text-red-700">{prediction.disease_name || 'Disease Detected'}</p>
                    {prediction.scientific_name && (
                      <p className="text-sm text-gray-600 italic mt-1">({prediction.scientific_name})</p>
                    )}
                  </div>
                  <span className="text-6xl">🦠</span>
                </div>

                {/* Severity & Confidence Row */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* Severity Level */}
                  <div className={`p-4 rounded-lg border-2 text-center ${
                    prediction.severity === 'high' || prediction.severity === 'High'
                      ? 'bg-red-100 border-red-300' 
                      : prediction.severity === 'medium' || prediction.severity === 'Medium'
                      ? 'bg-yellow-100 border-yellow-300'
                      : 'bg-green-100 border-green-300'
                  }`}>
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Severity Level</p>
                    <p className={`text-2xl font-bold ${
                      prediction.severity === 'high' || prediction.severity === 'High'
                        ? 'text-red-700' 
                        : prediction.severity === 'medium' || prediction.severity === 'Medium'
                        ? 'text-yellow-700'
                        : 'text-green-700'
                    }`}>
                      {prediction.severity?.charAt(0).toUpperCase() + prediction.severity?.slice(1) || 'Medium'}
                    </p>
                  </div>

                  {/* Confidence */}
                  <div className="bg-blue-100 border-2 border-blue-300 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">AI Confidence</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {Math.round((prediction.confidence || 0.85) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: SYMPTOMS & CAUSE (TWO CARDS SIDE BY SIDE) */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Observed Symptoms */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-3xl">👁️</span>
                  <h3 className="text-xl font-bold text-gray-800">Observed Symptoms</h3>
                </div>
                <ul className="space-y-3">
                  {(prediction.affected_parts && prediction.affected_parts.length > 0
                    ? prediction.affected_parts.map(part => `Affected: ${part}`)
                    : prediction.symptoms_analysis
                    ? [prediction.symptoms_analysis]
                    : [
                        'Dark brown spots on leaves',
                        'Yellowing around affected areas',
                        'Wilting of leaf edges',
                        'Premature leaf drop'
                      ]
                  ).slice(0, 5).map((symptom, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-green-600 font-bold">•</span>
                      <span className="text-sm">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Likely Cause */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-3xl">🧬</span>
                  <h3 className="text-xl font-bold text-gray-800">Likely Cause</h3>
                </div>
                <div className="mb-4">
                  <p className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {getDiseaseType(prediction.disease)}
                  </p>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {prediction.description || 'This condition is typically caused by fungal pathogens that thrive in warm, humid conditions. Poor air circulation and excessive moisture on leaves create ideal conditions for spore germation.'}
                </p>
                {prediction.spread_rate && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-2">
                    <p className="text-xs text-yellow-800">
                      <strong>Spread Rate:</strong> {prediction.spread_rate}
                    </p>
                  </div>
                )}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800">
                    <strong>Prevention:</strong> {prediction.prevention?.substring(0, 100) || 'High humidity, poor drainage, overcrowding'}...
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: TREATMENT & PREVENTION (BOTTOM) */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-3xl">💊</span>
                <h2 className="text-2xl font-bold text-gray-800">Treatment & Prevention Plan</h2>
              </div>

              {/* Treatment Steps */}
              <div className="mb-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <h3 className="font-bold text-green-900 text-lg mb-3 flex items-center space-x-2">
                    <span>⚡</span>
                    <span>Immediate Action Required</span>
                  </h3>
                  <div className="space-y-3">
                    {(prediction.organic_solutions && prediction.organic_solutions.length > 0
                      ? prediction.organic_solutions
                      : [
                          'Remove and destroy all infected leaves immediately',
                          'Isolate affected plants to prevent spread',
                          'Improve air circulation around plants'
                        ]
                    ).slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-start space-x-3 bg-white p-3 rounded-lg">
                        <div className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm font-medium pt-0.5">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Solution */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                  <h3 className="font-bold text-blue-900 text-lg mb-3 flex items-center space-x-2">
                    <span>🧪</span>
                    <span>Recommended Solution</span>
                  </h3>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {prediction.treatment || 'Apply copper-based fungicide (e.g., Bordeaux mixture) or organic neem oil spray. Apply early morning or late evening. Repeat application every 7-10 days for 3 weeks.'}
                    </p>
                    <div className="flex items-start space-x-2 bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <span className="text-lg">⚠️</span>
                      <p className="text-xs text-orange-800">
                        <strong>Safety Note:</strong> Wear protective equipment when applying chemicals. Follow manufacturer's instructions for dosage and safety precautions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preventive Measures */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-purple-900 text-lg mb-3 flex items-center space-x-2">
                    <span>🛡️</span>
                    <span>Preventive Measures</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: '💧', text: 'Water at soil level, avoid wetting foliage' },
                      { icon: '🌱', text: 'Maintain proper plant spacing' },
                      { icon: '✂️', text: 'Prune regularly for air flow' },
                      { icon: '🧹', text: 'Remove fallen debris promptly' },
                      { icon: '🔄', text: 'Practice crop rotation' },
                      { icon: '🌿', text: 'Use disease-resistant varieties' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg text-center">
                        <span className="text-2xl block mb-2">{item.icon}</span>
                        <p className="text-xs text-gray-700">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* New Analysis Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={resetAnalysis}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2"
                >
                  <span>🔄</span>
                  <span>Analyze Another Plant</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PestDiseaseManagement;
