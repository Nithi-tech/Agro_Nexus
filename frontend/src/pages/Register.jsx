import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

function Register({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    location: '',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Authentication disabled - go directly to dashboard
    setIsAuthenticated(true);
    localStorage.setItem('token', 'demo-token');
    toast.success(t('register_success') || 'Welcome to Smart Agriculture!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #86efac 0%, #a7f3d0 30%, #bfdbfe 60%, #93c5fd 100%)' }}>
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${20 + Math.random() * 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      <div className="max-w-md w-full bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Back to Home Link */}
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-green-600 mb-4 text-sm font-medium transition-colors">
          ← Back to Home
        </Link>

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌾</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {t('register') || 'Create Account'}
          </h2>
          <p className="text-gray-700 text-lg">
            {t('register_subtitle') || 'Join Smart Agriculture Platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              👤 {t('username') || 'Username'}
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 placeholder-gray-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              📧 {t('email') || 'Email'}
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 placeholder-gray-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🧑 {t('full_name') || 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 placeholder-gray-500"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              📍 {t('location') || 'Location'}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 placeholder-gray-500"
              placeholder="Your farming location"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🔒 {t('password') || 'Password'}
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 placeholder-gray-500"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
          >
            {loading ? '⏳ ' + (t('registering') || 'Creating Account...') : '🚀 ' + (t('register') || 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-800 text-base">
            {t('have_account') || 'Already have an account?'}{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-bold text-lg hover:underline">
              {t('login') || 'Sign In'}
            </Link>
          </p>
        </div>
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-30px) translateX(5px); }
          }
        `}
      </style>
    </div>
  );
}

export default Register;
