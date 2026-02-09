import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Authentication disabled - go directly to dashboard
    setIsAuthenticated(true);
    localStorage.setItem('token', 'demo-token');
    toast.success(t('login_success') || 'Login successful!');
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
            {t('login') || 'Welcome Back'}
          </h2>
          <p className="text-gray-700 text-lg">
            {t('login_subtitle') || 'Sign in to Smart Agriculture'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder={t('enter_username') || 'Enter your username'}
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
              placeholder={t('enter_password') || 'Enter your password'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
          >
            {loading ? '⏳ ' + (t('logging_in') || 'Signing in...') : '🚀 ' + (t('login') || 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-800 text-base">
            {t('no_account') || "Don't have an account?"}{' '}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-bold text-lg hover:underline">
              {t('register') || 'Create One'}
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-blue-800 mb-1">🎯 Demo Account</p>
            <p className="text-xs text-blue-700">
              <span className="font-mono bg-blue-100 px-2 py-1 rounded">demo_farmer</span> / <span className="font-mono bg-blue-100 px-2 py-1 rounded">demo123</span>
            </p>
          </div>
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

export default Login;
