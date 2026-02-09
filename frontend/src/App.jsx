import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropPredict from './pages/CropPredict';
import DiseaseDialog from './pages/DiseaseDialog';
import FertilizerRecommend from './pages/FertilizerRecommend';
import History from './pages/History';
import Settings from './pages/Settings';
import { authService } from './services/api';
import './i18n';

import ProductLanding from './pages/ProductLanding';
import CinematicLanding from './pages/CinematicLanding';

// New Futuristic Advisory Pages
import SmartDashboard from './pages/SmartDashboard';
import IrrigationAdvisory from './pages/IrrigationAdvisory';
import CropSelection from './pages/CropSelection';
import ClimateIntelligence from './pages/ClimateIntelligence';
import PestDiseaseManagement from './pages/PestDiseaseManagement';
import AdvisoryHistory from './pages/AdvisoryHistory';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { i18n } = useTranslation();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <div className="min-h-screen">
      {/* Global semi-transparent overlay for readability - increased opacity */}
      <div className="min-h-screen bg-white/92 backdrop-blur-sm">
        <Toaster position="top-right" />
        {isAuthenticated && !isLandingPage && !isAuthPage && <Navbar setIsAuthenticated={setIsAuthenticated} />}

          <Routes>
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />

          <Route path="/" element={<CinematicLanding />} />
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            
            {/* New Futuristic Advisory Routes */}
            <Route path="/smart-dashboard" element={<PrivateRoute><SmartDashboard /></PrivateRoute>} />
            <Route path="/irrigation" element={<PrivateRoute><IrrigationAdvisory /></PrivateRoute>} />
            <Route path="/crop-selection" element={<PrivateRoute><CropSelection /></PrivateRoute>} />
            <Route path="/climate" element={<PrivateRoute><ClimateIntelligence /></PrivateRoute>} />
            <Route path="/pest-disease" element={<PrivateRoute><PestDiseaseManagement /></PrivateRoute>} />
            <Route path="/advisory-history" element={<PrivateRoute><AdvisoryHistory /></PrivateRoute>} />
            
            <Route path="/predict" element={<PrivateRoute><CropPredict /></PrivateRoute>} />
            <Route path="/disease" element={<PrivateRoute><DiseaseDialog /></PrivateRoute>} />
            <Route path="/fertilizer" element={<PrivateRoute><FertilizerRecommend /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
