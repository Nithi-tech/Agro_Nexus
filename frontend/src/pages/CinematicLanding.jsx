import React from 'react';
import { useNavigate } from 'react-router-dom';

const CinematicLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #86efac 0%, #a7f3d0 30%, #bfdbfe 60%, #93c5fd 100%)',
        }}
      />

      {/* Gradient overlays for depth */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(34, 139, 34, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 69, 19, 0.05) 0%, transparent 50%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/20"
          style={{
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${20 + Math.random() * 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Sunlight glow */}
      <div 
        className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 200, 0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6 tracking-tight">
          Smart Agriculture Platform
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-800 font-medium mb-4">
          AI-powered farming intelligence for better yields
        </p>
        
        <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
          Real-time insights from soil, crops, and weather — all in one platform.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl w-full">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Crop Prediction</h3>
            <p className="text-gray-700">ML-based recommendations for optimal crop selection</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3">🔬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Disease Detection</h3>
            <p className="text-gray-700">Instant plant disease identification using AI vision</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Analytics</h3>
            <p className="text-gray-700">Real-time sensor data and weather insights</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started
          </button>
          
          <button
            onClick={() => navigate('/login')}
            className="px-10 py-4 bg-white/80 hover:bg-white text-gray-900 text-lg font-semibold rounded-full shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(-20px) translateX(10px);
            }
            50% {
              transform: translateY(-10px) translateX(-10px);
            }
            75% {
              transform: translateY(-30px) translateX(5px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default CinematicLanding;
