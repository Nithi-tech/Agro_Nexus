import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-amber-950 mb-4" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>
          {t('welcome') || 'Welcome to Smart Agriculture Platform'}
        </h1>
        <p className="text-xl text-gray-600">
          {t('tagline') || 'AI-Powered Farming Solutions for Better Yields'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/dashboard')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-4">📊</div>
          <h2 className="text-xl font-bold mb-2">{t('dashboard') || 'Dashboard'}</h2>
          <p className="text-gray-600">
            {t('dashboard_desc') || 'Monitor real-time sensor data and farm conditions'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/predict')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-4">🌾</div>
          <h2 className="text-xl font-bold mb-2">{t('crop_predict') || 'Crop Prediction'}</h2>
          <p className="text-gray-600">
            {t('crop_predict_desc') || 'Get AI-powered crop recommendations'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/disease')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-4">🔬</div>
          <h2 className="text-xl font-bold mb-2">{t('disease_detection') || 'Disease Detection'}</h2>
          <p className="text-gray-600">
            {t('disease_desc') || 'Diagnose plant diseases with AI'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/fertilizer')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-4">🧪</div>
          <h2 className="text-xl font-bold mb-2">{t('fertilizer') || 'Fertilizer Recommendation'}</h2>
          <p className="text-gray-600">
            {t('fertilizer_desc') || 'Get personalized fertilizer suggestions'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/history')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-4">📜</div>
          <h2 className="text-xl font-bold mb-2">{t('history') || 'History'}</h2>
          <p className="text-gray-600">
            {t('history_desc') || 'View past predictions and recommendations'}
          </p>
        </div>

        <div 
          onClick={() => navigate('/settings')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition cursor-pointer"
        >
          <div className="text-4xl mb-4">⚙️</div>
          <h2 className="text-xl font-bold mb-2">{t('settings') || 'Settings'}</h2>
          <p className="text-gray-600">
            {t('settings_desc') || 'Configure your preferences'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
