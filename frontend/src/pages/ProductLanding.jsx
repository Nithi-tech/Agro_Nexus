import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductLanding = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();

    return (
        <div ref={containerRef} className="fixed inset-0 bg-gradient-to-br from-green-900 via-green-700 to-green-500 flex items-center justify-center p-8 overflow-auto">
            <div className="max-w-4xl text-center text-white space-y-8">
                <h1 className="text-6xl font-bold mb-4 animate-fade-in">
                    🌾 Smart Agriculture Platform
                </h1>
                <p className="text-2xl mb-8 text-white/90">
                    AI-Powered Farming Solutions for Better Yields
                </p>
                
                <button 
                    onClick={() => navigate('/register')}
                    className="bg-green-500 hover:bg-green-600 text-black text-xl font-bold py-4 px-12 rounded-full transition-transform hover:scale-105 shadow-xl shadow-green-500/20"
                >
                    Get Started Now
                </button>

                <footer className="absolute bottom-10 text-white/30 text-sm">
                    © 2026 AgriIntel Platform. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default ProductLanding;
