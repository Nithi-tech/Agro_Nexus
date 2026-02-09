# 🌾 Smart Agriculture Predictor System

## Climate-Resilient Agriculture Platform

A complete, production-ready multilingual web platform for smart farming with AI-powered predictions, real-time sensor monitoring, and intelligent fertilizer recommendations.

## 🎯 Features

### 1. **AI-Powered Predictions**
- Crop recommendation based on soil & climate
- Disease diagnosis with image analysis
- Hybrid API + local ML models (XGBoost)

### 2. **Real-Time IoT Sensor Dashboard**
- Live soil moisture, pH, NPK monitoring
- Temperature & humidity tracking
- WebSocket streaming updates

### 3. **Intelligent Fertilizer Engine**
- Rule-based + AI hybrid recommendations
- Customized quantity & timing
- Soil data integration

### 4. **Multilingual Support** 🌍
- English, Hindi, Tamil, Urdu, Malayalam
- Complete UI translation
- Dynamic language switching

### 5. **Weather Integration**
- Real-time weather data
- Location-based forecasts
- Climate-aware predictions

### 6. **Reporting & Analytics**
- PDF report generation
- Historical data tracking
- Multilingual reports

## 🚀 Tech Stack

**Backend:**
- FastAPI (Python 3.10+)
- SQLAlchemy + PostgreSQL/SQLite
- JWT Authentication
- WebSocket support

**Frontend:**
- React 18
- Tailwind CSS + Material-UI
- React-i18next
- Recharts
- Axios

**AI/ML:**
- **Groq API (Llama 3.1 70B)** - Primary AI engine 🚀
- OpenAI API / Gemini API (alternatives)
- XGBoost (offline fallback)
- scikit-learn
- Multilingual responses (EN, HI, TA, UR, ML)

**Deployment:**
- Backend: Render / Railway
- Frontend: Vercel / Netlify
- Database: PostgreSQL (Supabase/Render)

## 📁 Project Structure

```
smart-agriculture/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── config.py            # Configuration
│   │   ├── database.py          # Database setup
│   │   ├── models/              # SQLAlchemy models
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Business logic
│   │   ├── ml_models/           # XGBoost models
│   │   ├── utils/               # Utilities
│   │   └── sensor_simulator.py  # IoT simulation
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── locales/             # i18n translations
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── datasets/                    # Training data
├── docs/                        # Documentation
└── deployment/                  # Deployment configs
```

## 🛠️ Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (optional, SQLite works too)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Run migrations
python -m app.database

# Start server
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./agriculture.db
SECRET_KEY=your-secret-key-here
GROQ_API_KEY=your-groq-api-key-here
OPENAI_API_KEY=sk-... (optional)
GEMINI_API_KEY=... (optional)
WEATHER_API_KEY=your-weather-api-key
JWT_SECRET_KEY=your-jwt-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/crop/predict` | Crop recommendation (multilingual) |
| POST | `/api/disease/diagnose` | Disease diagnosis (multilingual) |
| POST | `/api/disease/pest-management` | Pest management advice (NEW) |
| POST | `/api/fertilizer/recommend` | Fertilizer suggestion |
| GET | `/api/sensor/stream` | WebSocket sensor data |
| GET | `/api/weather/{location}` | Weather data |
| GET | `/api/history` | User history |
| GET | `/api/report/generate` | PDF report |

## 🌍 Supported Languages

- 🇬🇧 English
- 🇮🇳 हिंदी (Hindi)
- 🇮🇳 தமிழ் (Tamil)
- 🇵🇰 اردو (Urdu)
- 🇮🇳 മലയാളം (Malayalam)

## 📊 Datasets

Training datasets included for:
- Crop recommendation (soil parameters)
- Disease classification
- Fertilizer optimization

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## 📚 Complete Documentation

| Document | Description | Read Time |
|----------|-------------|-----------|
| [QUICKSTART.md](QUICKSTART.md) | Get running in 5 minutes | 2 min |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Complete project overview | 10 min |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical architecture & design | 15 min |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment guide | 20 min |
| [docs/FEATURES.md](docs/FEATURES.md) | Detailed feature documentation | 12 min |
| [docs/PRESENTATION.md](docs/PRESENTATION.md) | Hackathon presentation script | 10 min |
| [docs/INDEX.md](docs/INDEX.md) | Documentation index & navigation | 3 min |

## 🎥 Demo & Presentation

**Live Demo:** [Add your deployed URL here]

**Video Demo:** [Add YouTube link here]

**Presentation:** See [docs/PRESENTATION.md](docs/PRESENTATION.md) for complete 7-minute hackathon presentation script with Q&A preparation.

## 📄 License

MIT License - Built for hackathon purposes, free for personal and commercial use.

## 👥 Contributing

This is a hackathon project open for contributions!

**Areas for contribution:**
- Additional languages (Spanish, French, etc.)
- Mobile app development (React Native)
- More ML models and crop types
- UI/UX improvements
- Testing and documentation
- Deployment guides for other platforms

**How to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🏆 Hackathon Theme

**Climate-Resilient Agriculture** - Building sustainable, AI-powered solutions for modern farming challenges.

### Key Innovation Points
- ✅ Complete end-to-end platform (not just a feature)
- ✅ True multilingual support (5 languages, full translation)
- ✅ Hybrid AI (works online AND offline)
- ✅ Real-time IoT integration (WebSocket streaming)
- ✅ Production-ready architecture (deployable today)
- ✅ Open-source and sustainable (free tools used)
- ✅ Farmer-first design (accessibility focused)

## 🌟 Project Statistics

- **Total Files:** 45+
- **Lines of Code:** 8,000+
- **Languages Supported:** 5
- **API Endpoints:** 20+
- **Database Tables:** 5
- **Technologies Used:** 25+
- **Development Time:** 48-72 hours
- **Documentation Pages:** 50+

## 🔗 Quick Links

- **API Documentation:** `/api/docs` (when backend is running)
- **Architecture Diagram:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Setup Scripts:** [setup.sh](setup.sh) (Linux/Mac) | [setup.bat](setup.bat) (Windows)
- **Environment Setup:** [backend/.env.example](backend/.env.example)
- **🚀 NEW: Groq AI Integration:** [GROQ_INTEGRATION_GUIDE.md](GROQ_INTEGRATION_GUIDE.md)
- **🤖 Chatbot User Guide:** [CHATBOT_USAGE_GUIDE.md](CHATBOT_USAGE_GUIDE.md)

## 🤖 AI-Powered Chatbot (NEW!)

This platform now features a **powerful multilingual AI chatbot** powered by Groq's Llama 3.1 70B model:

### ✨ Key Features
- **Ultra-Fast Responses**: Powered by Groq's LPU technology (2-5 seconds)
- **Multilingual**: Detailed responses in EN, HI, TA, UR, ML
- **Comprehensive Advice**: Not just recommendations, but detailed explanations
- **3 Core Functions**:
  - 🌾 Crop Prediction with growing tips
  - 🦠 Disease Diagnosis with treatment plans
  - 🐛 Pest Management with IPM strategies

### 📖 Documentation
- **Integration Guide**: [GROQ_INTEGRATION_GUIDE.md](GROQ_INTEGRATION_GUIDE.md) - Technical setup & API details
- **User Guide**: [CHATBOT_USAGE_GUIDE.md](CHATBOT_USAGE_GUIDE.md) - How to use the chatbot with examples

### 🎯 What Makes It Special
- Provides **detailed reasoning** for every recommendation
- Includes **actionable steps** you can follow immediately
- Offers **multiple solutions** (organic, chemical, cultural)
- Gives **prevention tips** to avoid future problems
- All responses **tailored to Indian agriculture**

## 💬 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email:** [your-email@example.com]

---

**Built with ❤️ for farmers and sustainable agriculture**

**🌾 Empowering 1.5+ billion farmers through AI and technology 🌾**
