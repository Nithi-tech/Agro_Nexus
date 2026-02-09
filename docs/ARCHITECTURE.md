# 🏗️ System Architecture - Smart Agriculture Predictor

## Overview

The Smart Agriculture Predictor is a full-stack, production-ready platform built with modern technologies for climate-resilient agriculture. This document provides a comprehensive technical architecture overview.

---

## 🎯 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              React Frontend (Vite)                       │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Components                                      │    │   │
│  │  │  • Navbar (Language Selector)                   │    │   │
│  │  │  • Dashboard (Live Sensors)                     │    │   │
│  │  │  • CropPredict                                  │    │   │
│  │  │  • FertilizerRecommend                          │    │   │
│  │  │  • DiseaseDialog                                │    │   │
│  │  │  • History, Settings                            │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  Services                                        │    │   │
│  │  │  • API Client (Axios)                           │    │   │
│  │  │  • WebSocket Client                             │    │   │
│  │  │  • Auth Service                                 │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │  i18n (React-i18next)                           │    │   │
│  │  │  • English, Hindi, Tamil, Urdu, Malayalam       │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                          HTTP/WS                                 │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                         APPLICATION LAYER                         │
├──────────────────────────────┼───────────────────────────────────┤
│                              │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │              FastAPI Backend                              │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  API Routes                                         │   │  │
│  │  │  • /api/auth      (Login, Register)               │   │  │
│  │  │  • /api/crop      (Predict, Get Crops)            │   │  │
│  │  │  • /api/disease   (Diagnose)                      │   │  │
│  │  │  • /api/fertilizer (Recommend)                    │   │  │
│  │  │  • /api/sensor    (WebSocket, History)            │   │  │
│  │  │  • /api/weather   (Get Weather)                   │   │  │
│  │  │  • /api/history   (Predictions)                   │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  Services Layer                                     │   │  │
│  │  │  • AIService (OpenAI/Gemini + Fallback)           │   │  │
│  │  │  • FertilizerService (Rule-based Engine)          │   │  │
│  │  │  • WeatherService (OpenWeatherMap)                │   │  │
│  │  │  • SensorSimulator (IoT Data Generation)          │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  Middleware                                         │   │  │
│  │  │  • CORS                                            │   │  │
│  │  │  • JWT Authentication                              │   │  │
│  │  │  • Error Handling                                  │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                      SQLAlchemy ORM                              │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
┌──────────────────────────────┼───────────────────────────────────┐
│                           DATA LAYER                              │
├──────────────────────────────┼───────────────────────────────────┤
│                              │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │              PostgreSQL / SQLite Database                 │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │  Tables                                             │   │  │
│  │  │  • users                                           │   │  │
│  │  │  • predictions                                     │   │  │
│  │  │  • sensor_readings                                 │   │  │
│  │  │  • crop_data                                       │   │  │
│  │  │  • fertilizer_recommendations                      │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                            │
├───────────────────────────────────────────────────────────────────┤
│  • OpenAI API (GPT-3.5)                                           │
│  • Google Gemini API                                              │
│  • OpenWeatherMap API                                             │
│  • XGBoost Models (Local Fallback)                               │
└───────────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Details

### Frontend (React + Vite)

**Technology Stack:**
- React 18 (UI Library)
- Vite (Build Tool)
- React Router v6 (Navigation)
- React-i18next (Internationalization)
- Axios (HTTP Client)
- Tailwind CSS (Styling)
- Material-UI (Component Library)
- Recharts (Data Visualization)
- React-Hot-Toast (Notifications)

**Key Features:**
1. **Multilingual Support**: Complete i18n with 5 languages
2. **Real-time Updates**: WebSocket integration for live sensor data
3. **Responsive Design**: Mobile-first, farmer-friendly UI
4. **PWA Ready**: Can be converted to Progressive Web App

**File Structure:**
```
frontend/src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── services/        # API integration
├── locales/         # Translation files
├── i18n.js          # i18n configuration
├── App.jsx          # Root component
└── main.jsx         # Entry point
```

---

### Backend (FastAPI)

**Technology Stack:**
- FastAPI (Web Framework)
- Uvicorn (ASGI Server)
- SQLAlchemy (ORM)
- Pydantic (Validation)
- Python-Jose (JWT)
- Passlib (Password Hashing)
- Httpx (Async HTTP Client)
- WebSockets (Real-time Communication)

**Architecture Pattern:** Layered Architecture
1. **Routes Layer**: API endpoints
2. **Services Layer**: Business logic
3. **Models Layer**: Data models
4. **Utils Layer**: Helper functions

**File Structure:**
```
backend/app/
├── routes/          # API endpoints
│   ├── auth.py
│   ├── crop.py
│   ├── disease.py
│   ├── fertilizer.py
│   ├── sensor.py
│   ├── weather.py
│   └── history.py
├── services/        # Business logic
│   ├── ai_service.py
│   ├── fertilizer_service.py
│   └── weather_service.py
├── models/          # Data models
│   ├── models.py    # SQLAlchemy models
│   └── schemas.py   # Pydantic schemas
├── utils/           # Utilities
│   └── auth.py
├── ml_models/       # ML models storage
├── main.py          # FastAPI app
├── config.py        # Configuration
├── database.py      # Database setup
└── sensor_simulator.py  # IoT simulation
```

---

## 🔄 Data Flow

### 1. Crop Prediction Flow

```
User Input (Frontend)
    ↓
API Request: POST /api/crop/predict
    ↓
FastAPI Route (crop.py)
    ↓
AIService.predict_crop_ai()
    ↓
┌─────────────────┐
│ Try OpenAI API  │
└────────┬────────┘
         │
    Success? ────Yes──→ Return AI Result
         │
        No
         ↓
┌─────────────────┐
│ Try Gemini API  │
└────────┬────────┘
         │
    Success? ────Yes──→ Return AI Result
         │
        No
         ↓
┌─────────────────┐
│ Use Rule-based  │
│   (Fallback)    │
└────────┬────────┘
         │
         ↓
    Return Result
         ↓
Save to Database (Prediction table)
         ↓
Return JSON Response to Frontend
         ↓
Display Result with Translation
```

### 2. Real-time Sensor Flow

```
Backend: sensor_simulator.get_reading()
    ↓
Generate Random Sensor Data
    ↓
WebSocket Connection: /api/sensor/stream
    ↓
Send JSON to All Connected Clients
    ↓
Frontend: WebSocket onMessage
    ↓
Update State (sensorData)
    ↓
Re-render Dashboard Components
    ↓
Display Live Data
    ↓
Update Charts (History)
    ↓
Repeat every 5 seconds
```

### 3. Fertilizer Recommendation Flow

```
User Input + Sensor Data
    ↓
API Request: POST /api/fertilizer/recommend
    ↓
FertilizerService.recommend_fertilizer()
    ↓
Get Crop NPK Requirements
    ↓
Calculate Deficiency (Required - Current)
    ↓
Apply Rule-based Logic
    ├─ High N Deficiency? → Recommend Urea
    ├─ High P Deficiency? → Recommend DAP
    ├─ High K Deficiency? → Recommend MOP
    └─ Balanced Deficiency? → Recommend NPK Complex
    ↓
Calculate Quantity (kg/acre)
    ↓
Determine Application Timing (Crop-specific)
    ↓
Adjust for Soil pH
    ↓
Generate Precautions
    ↓
Estimate Cost
    ↓
Save to Database
    ↓
Return Comprehensive Recommendation
```

---

## 🔐 Security Architecture

### Authentication Flow (JWT)

```
1. User Login/Register
    ↓
2. Verify Credentials (BCrypt)
    ↓
3. Generate JWT Token (Python-Jose)
    │  - Payload: {sub: username, exp: timestamp}
    │  - Sign with SECRET_KEY
    ↓
4. Return Token to Frontend
    ↓
5. Frontend Stores in localStorage
    ↓
6. Subsequent Requests Include:
    │  Header: Authorization: Bearer <token>
    ↓
7. Backend Verifies Token
    │  - Decode & Verify Signature
    │  - Check Expiration
    │  - Extract User
    ↓
8. Grant/Deny Access
```

### Security Measures

1. **Password Hashing**: BCrypt (Passlib)
2. **JWT Tokens**: Secure, expirable
3. **HTTPS**: Required in production
4. **CORS**: Whitelist allowed origins
5. **SQL Injection**: SQLAlchemy ORM (parameterized queries)
6. **XSS**: React auto-escapes
7. **Environment Variables**: Sensitive data in .env

---

## 📊 Database Schema

### ER Diagram

```
┌──────────────┐         ┌─────────────────┐
│    users     │         │  predictions    │
├──────────────┤         ├─────────────────┤
│ id (PK)      │◄────────┤ id (PK)         │
│ username     │    1:N  │ user_id (FK)    │
│ email        │         │ type            │
│ hashed_pwd   │         │ input_data      │
│ full_name    │         │ output_data     │
│ language     │         │ confidence      │
│ created_at   │         │ created_at      │
└──────────────┘         └─────────────────┘
       │
       │ 1:N
       ▼
┌─────────────────┐      ┌─────────────────────────┐
│ sensor_readings │      │ fertilizer_recommendations│
├─────────────────┤      ├─────────────────────────┤
│ id (PK)         │      │ id (PK)                 │
│ user_id (FK)    │      │ user_id (FK)            │
│ soil_moisture   │      │ crop_type               │
│ soil_ph         │      │ fertilizer_name         │
│ nitrogen        │      │ quantity                │
│ phosphorus      │      │ timing                  │
│ potassium       │      │ created_at              │
│ temperature     │      └─────────────────────────┘
│ humidity        │
│ timestamp       │
└─────────────────┘
```

---

## 🌐 API Architecture

### RESTful Design

**Endpoints follow REST principles:**
- GET: Retrieve data
- POST: Create/Submit data
- PUT: Update data
- DELETE: Remove data

**Example API Contract:**

```yaml
POST /api/crop/predict
Request:
  Content-Type: application/json
  Authorization: Bearer <token>
  Body:
    {
      "nitrogen": 45.0,
      "phosphorus": 38.0,
      "potassium": 42.0,
      "temperature": 28.5,
      "humidity": 65.0,
      "ph": 6.5,
      "rainfall": 120.0
    }

Response: 200 OK
  {
    "recommended_crop": "rice",
    "confidence": 0.92,
    "alternative_crops": [
      {"crop": "wheat", "confidence": 0.78},
      {"crop": "maize", "confidence": 0.65}
    ],
    "reasoning": "Optimal NPK and climate for rice cultivation",
    "model_used": "OpenAI GPT-3.5"
  }
```

### WebSocket Protocol

```yaml
WS /api/sensor/stream
Connection: Upgrade
Authorization: Bearer <token>

Message Format (Server → Client):
  {
    "soil_moisture": 67.3,
    "soil_ph": 6.52,
    "nitrogen": 46.2,
    "phosphorus": 39.1,
    "potassium": 43.5,
    "temperature": 28.7,
    "humidity": 66.4,
    "timestamp": "2024-03-15T10:30:45.123Z",
    "location": "Farm-1"
  }

Frequency: Every 5 seconds
```

---

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────┐
│                  Vercel CDN (Frontend)              │
│  • Static files cached globally                    │
│  • Auto HTTPS                                       │
│  • https://smart-agriculture.vercel.app            │
└────────────────────┬────────────────────────────────┘
                     │
                  HTTPS
                     │
┌────────────────────▼────────────────────────────────┐
│              Render.com (Backend)                   │
│  • Python 3.10 container                           │
│  • Uvicorn server                                  │
│  • Auto-scaling                                    │
│  • https://smart-agriculture-api.onrender.com      │
└────────────────────┬────────────────────────────────┘
                     │
                  TCP/SSL
                     │
┌────────────────────▼────────────────────────────────┐
│         PostgreSQL Database (Render/Supabase)      │
│  • Automatic backups                               │
│  • Connection pooling                              │
│  • Encrypted at rest                               │
└─────────────────────────────────────────────────────┘

External APIs:
  • OpenAI (https://api.openai.com)
  • OpenWeatherMap (https://api.openweathermap.org)
  • Google Gemini (https://generativelanguage.googleapis.com)
```

---

## 🔄 CI/CD Pipeline

```
Developer Push to GitHub
    ↓
Automatic Triggers:
    │
    ├──► Vercel (Frontend)
    │      ├─ npm install
    │      ├─ npm run build
    │      ├─ Deploy to CDN
    │      └─ Invalidate cache
    │
    └──► Render (Backend)
           ├─ pip install -r requirements.txt
           ├─ Run migrations
           ├─ Build container
           ├─ Health check
           └─ Live deployment
```

---

## 📈 Scalability Considerations

### Current Capacity
- **Concurrent Users**: 100-500
- **Requests/sec**: 50-100
- **Database**: 1GB-10GB
- **Response Time**: <500ms

### Scaling Strategy

**Horizontal Scaling:**
- Add more Render instances
- Load balancer (Render Pro)
- Database read replicas

**Vertical Scaling:**
- Upgrade instance size
- More RAM/CPU

**Optimizations:**
- Redis caching for frequent requests
- CDN for static assets
- Database indexing
- Connection pooling
- Async operations

---

## 🛠️ Technology Justification

### Why FastAPI?
- High performance (async)
- Automatic API docs
- Type validation
- Modern Python features
- WebSocket support

### Why React?
- Component reusability
- Virtual DOM performance
- Large ecosystem
- i18n support
- Active community

### Why PostgreSQL?
- ACID compliance
- JSON support
- Scalable
- Free tier available
- Production-ready

### Why React-i18next?
- Industry standard
- Dynamic language switching
- Namespace support
- Easy translation management
- Minimal bundle size

---

## 📊 Performance Metrics

### Target SLAs
- **Uptime**: 99.5%
- **API Response**: <500ms (95th percentile)
- **WebSocket Latency**: <100ms
- **Page Load**: <2s
- **Error Rate**: <0.1%

### Monitoring
- Render built-in metrics
- Vercel Analytics
- Error logging (console/Sentry)
- Database query performance

---

**Built for Hackathons, Ready for Production!** 🚀
