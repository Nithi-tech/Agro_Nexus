# 📋 Quick Start Guide

## For Hackathon Judges & Evaluators

### 🚀 Running the Project Locally (5 minutes)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python -m app.database
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### 🌐 Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/docs

### 👤 Test Account
- Username: `demo_farmer`
- Password: `demo123`
(Or create new account via Register)

---

## 🎯 Key Features to Test

1. **Multilingual** - Click language selector (top-right)
2. **Dashboard** - Real-time sensor data updates every 5s
3. **Crop Predict** - Use "Use Live Sensor Data" button
4. **Fertilizer** - Get personalized recommendations
5. **Disease** - AI-based diagnosis

---

## 🔑 API Keys (Optional)

For full AI features, add to `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key
WEATHER_API_KEY=your-key
```

**Note:** System works without API keys using fallback models!

---

## 📊 Architecture

```
React Frontend (Port 5173)
    ↓ REST API / WebSocket
FastAPI Backend (Port 8000)
    ↓
PostgreSQL / SQLite Database
    ↓
OpenAI API (optional)
Weather API (optional)
```

---

## 🎤 Presentation

See `docs/PRESENTATION.md` for complete presentation script.

---

## 📞 Support

Issues? Check:
1. Python 3.10+ installed?
2. Node.js 18+ installed?
3. All dependencies installed?
4. Ports 5173 and 8000 available?
