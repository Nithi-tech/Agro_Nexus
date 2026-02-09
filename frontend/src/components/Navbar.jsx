import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/api';

const Navbar = ({ setIsAuthenticated }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    navigate('/login');
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇵🇰' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' }
  ];

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
              🌾 {t('home.title')}
            </h1>
            
            <div className="hidden md:flex space-x-4">
              <button onClick={() => navigate('/')} className="hover:bg-primary-700 px-3 py-2 rounded">
                {t('nav.home')}
              </button>
              <button onClick={() => navigate('/dashboard')} className="hover:bg-primary-700 px-3 py-2 rounded">
                {t('nav.dashboard')}
              </button>
              <button onClick={() => navigate('/predict')} className="hover:bg-primary-700 px-3 py-2 rounded">
                {t('nav.predict')}
              </button>
              <button onClick={() => navigate('/fertilizer')} className="hover:bg-primary-700 px-3 py-2 rounded">
                {t('nav.fertilizer')}
              </button>
              <button onClick={() => navigate('/disease')} className="hover:bg-primary-700 px-3 py-2 rounded">
                {t('nav.disease')}
              </button>
              <button onClick={() => navigate('/history')} className="hover:bg-primary-700 px-3 py-2 rounded">
                {t('nav.history')}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector - PROMINENTLY AT TOP */}
            <select 
              value={i18n.language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold cursor-pointer text-lg border-2 border-primary-400"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>

            <div className="flex items-center space-x-2">
              <span className="hidden md:inline">{user?.username}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
