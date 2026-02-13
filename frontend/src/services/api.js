import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add language to POST requests
  if (config.method === 'post' && config.data) {
    const language = localStorage.getItem('language') || 'en';
    if (typeof config.data === 'object' && !config.data.language) {
      config.data.language = language;
    }
  }
  
  return config;
});

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Crop Service
export const cropService = {
  predict: async (data) => {
    const response = await api.post('/api/crop/predict', data);
    return response.data;
  },
  
  predictCrop: async (data) => {
    const response = await api.post('/api/crop/predict', data);
    return response.data;
  },
  
  getCrops: async () => {
    const response = await api.get('/api/crop/crops');
    return response.data;
  },
  
  getCropInfo: async (cropName) => {
    const response = await api.get(`/api/crop/crop/${cropName}`);
    return response.data;
  }
};

// Disease Service
export const diseaseService = {
  diagnose: async (data) => {
    const response = await api.post('/api/disease/diagnose', data);
    return response.data;
  },
  
  detect: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('crop_type', 'general');
    const language = localStorage.getItem('language') || 'en';
    formData.append('language', language);
    
    const response = await api.post('/api/disease/detect-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  detectDisease: async (formData) => {
    const response = await api.post('/api/disease/detect-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getCommonDiseases: async (cropType) => {
    const response = await api.get(`/api/disease/common-diseases/${cropType}`);
    return response.data;
  },
  
  getPestManagement: async (cropType, pestIssue, language = null) => {
    const lang = language || localStorage.getItem('language') || 'en';
    const response = await api.post('/api/disease/pest-management', null, {
      params: { crop_type: cropType, pest_issue: pestIssue, language: lang }
    });
    return response.data;
  }
};

// Fertilizer Service
export const fertilizerService = {
  recommendFertilizer: async (data) => {
    const response = await api.post('/api/fertilizer/recommend', data);
    return response.data;
  },
  recommend: async (data) => {
    const response = await api.post('/api/fertilizer/recommend', data);
    return response.data;
  },
  
  getFertilizers: async () => {
    const response = await api.get('/api/fertilizer/fertilizers');
    return response.data;
  },
  
  getSoilTypes: async () => {
    const response = await api.get('/api/fertilizer/soil-types');
    return response.data;
  }
};

// Sensor Service
export const sensorService = {
  getLatest: async () => {
    const response = await api.get('/api/sensor/latest');
    return response.data;
  },
  
  getHistory: async (limit = 100) => {
    const response = await api.get(`/api/sensor/history?limit=${limit}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/api/sensor/stats');
    return response.data;
  },
  
  connectWebSocket: (onMessage) => {
    const wsUrl = API_URL.replace('http', 'ws');
    const ws = new WebSocket(`${wsUrl}/api/sensor/stream`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    return ws;
  }
};

// Weather Service
export const weatherService = {
  getWeather: async (location) => {
    const response = await api.get(`/api/weather/${location}`);
    return response.data;
  },
  
  getWeatherByCoords: async (lat, lon) => {
    const response = await api.get(`/api/weather/coordinates/${lat}/${lon}`);
    return response.data;
  }
};

// History Service
export const historyService = {
  getHistory: async (type = null, limit = 50) => {
    let url = `/api/history/predictions?limit=${limit}`;
    if (type) url += `&prediction_type=${type}`;
    const response = await api.get(url);
    return response.data;
  },
  
  getPredictions: async (type = null, limit = 50) => {
    let url = `/api/history/predictions?limit=${limit}`;
    if (type) url += `&prediction_type=${type}`;
    const response = await api.get(url);
    return response.data;
  },
  
  getPredictionDetail: async (id) => {
    const response = await api.get(`/api/history/predictions/${id}`);
    return response.data;
  },
  
  getSummary: async () => {
    const response = await api.get('/api/history/summary');
    return response.data;
  }
};

export default api;
