import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

function Settings() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' }
  ];

  const handleLanguageChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    toast.success(t('language_changed') || 'Language changed successfully!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-amber-950 mb-8" style={{textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(255,255,255,0.6)'}}>
        {t('settings') || 'Settings'}
      </h1>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{t('language') || 'Language'}</h2>
          <p className="text-gray-600 mb-4">
            {t('language_desc') || 'Choose your preferred language for the application'}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`p-4 border-2 rounded-lg text-left transition ${
                  language === lang.code
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{lang.flag}</span>
                  <span className="font-semibold text-lg">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{t('notifications') || 'Notifications'}</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">{t('sensor_alerts') || 'Sensor Alerts'}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">{t('weather_updates') || 'Weather Updates'}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">{t('recommendations') || 'Recommendations'}</span>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">{t('about') || 'About'}</h2>
          <div className="space-y-2 text-gray-600">
            <p><strong>{t('version') || 'Version'}:</strong> 1.0.0</p>
            <p><strong>{t('platform') || 'Platform'}:</strong> Smart Agriculture Platform</p>
            <p className="mt-4">
              {t('about_desc') || 'AI-powered platform for modern farming solutions'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
