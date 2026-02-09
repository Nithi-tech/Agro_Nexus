# Groq AI Integration Guide

## 🚀 Overview

Your Smart Agriculture Platform is now powered by **Groq AI** with the lightning-fast **Llama 3.1 70B** model, providing:

- **Multilingual Support**: English, Hindi, Tamil, Urdu, Malayalam
- **Detailed AI Responses**: Comprehensive crop predictions, disease diagnosis, and pest management
- **Ultra-Fast Inference**: Groq's LPU technology delivers responses in seconds
- **Cost-Effective**: More affordable than OpenAI GPT-4

## 🔑 API Key Configuration

You need to configure your Groq API key in the `.env` file:
```
GROQ_API_KEY=your-groq-api-key-here
```

The key is set in:
- `backend/app/config.py` (default value)
- `backend/.env` (environment variable)

## 🌍 Supported Languages

The system automatically responds in the user's selected language:

| Code | Language | Script |
|------|----------|--------|
| `en` | English | Latin |
| `hi` | Hindi | देवनागरी |
| `ta` | Tamil | தமிழ் |
| `ur` | Urdu | اردو |
| `ml` | Malayalam | മലയാളം |

## 🎯 Features

### 1. Crop Prediction (Multilingual)
```javascript
// Frontend Usage
const result = await cropService.predict({
  nitrogen: 80,
  phosphorus: 40,
  potassium: 40,
  temperature: 25,
  humidity: 80,
  ph: 6.5,
  rainfall: 200,
  language: 'hi' // Hindi
});
```

**Response includes:**
- Recommended crop with confidence score
- Detailed reasoning in selected language
- Yield potential information
- Growing tips and best practices
- 3 alternative crop options with explanations

### 2. Disease Diagnosis (Multilingual)
```javascript
// Frontend Usage
const result = await diseaseService.diagnose({
  crop_type: 'tomato',
  symptoms: 'Yellow leaves with brown spots',
  language: 'ta' // Tamil
});
```

**Response includes:**
- Disease name (common and scientific)
- Detailed description
- Symptoms analysis
- Step-by-step treatment plan
- Prevention measures
- Organic and chemical solutions
- Treatment timeline
- Safety precautions

### 3. Pest Management (NEW!)
```javascript
// Frontend Usage
const result = await diseaseService.getPestManagement(
  'rice',
  'Brown planthopper infestation',
  'ml' // Malayalam
);
```

**Response includes:**
- Pest identification
- Damage description
- Pest lifecycle information
- Integrated Pest Management (IPM) strategy
- Biological control methods
- Cultural control practices
- Chemical control options
- Monitoring guidelines
- Economic threshold levels

## 📋 Installation Steps

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Verify Groq Installation**
```bash
python -c "from groq import Groq; print('Groq SDK installed successfully!')"
```

3. **Start Backend Server**
```bash
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Frontend**
```bash
npm run dev
```

## 🧪 Testing the Integration

### Test Crop Prediction (English)
```bash
curl -X POST http://localhost:8000/api/crop/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 80,
    "phosphorus": 40,
    "potassium": 40,
    "temperature": 25,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200,
    "language": "en"
  }'
```

### Test Disease Diagnosis (Hindi)
```bash
curl -X POST http://localhost:8000/api/disease/diagnose \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "crop_type": "rice",
    "symptoms": "पत्तियों पर भूरे धब्बे",
    "language": "hi"
  }'
```

### Test Pest Management (Tamil)
```bash
curl -X POST "http://localhost:8000/api/disease/pest-management?crop_type=tomato&pest_issue=leaf%20miner&language=ta" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🎨 Frontend Language Selection

The language is automatically selected from the user's preference stored in localStorage:

```javascript
// User selects language in UI
localStorage.setItem('language', 'hi'); // Hindi

// All API calls automatically include this language
const result = await cropService.predict(data);
// Response will be in Hindi
```

## 📊 Model Information

**Model**: Llama 3.1 70B Versatile
- **Parameters**: 70 billion
- **Context Window**: 128K tokens
- **Speed**: Ultra-fast (Groq LPU)
- **Capabilities**: Multilingual, Reasoning, JSON mode
- **Best For**: Detailed agricultural advice

## 🔧 Advanced Configuration

### Change AI Model

Edit `backend/app/services/ai_service.py`:

```python
# Line 67: Change model
model="llama-3.1-70b-versatile",  # Current
# Options:
# - "llama-3.1-8b-instant" (Faster, less detailed)
# - "mixtral-8x7b-32768" (Alternative)
# - "llama-3.2-90b-vision-preview" (Vision support)
```

### Adjust Temperature

```python
# Line 68: Control randomness
temperature=0.3,  # Lower = More deterministic
# Range: 0.0 to 2.0
# Recommended: 0.2-0.4 for agriculture
```

### Increase Response Length

```python
# Line 69: Max tokens
max_tokens=2000,  # Current
# Increase for more detailed responses
```

## 🌟 Key Advantages

| Feature | Groq Llama 3.1 | OpenAI GPT-3.5 |
|---------|---------------|----------------|
| Speed | ⚡ Ultra Fast | 🐢 Moderate |
| Cost | 💰 Low | 💰💰 Higher |
| Multilingual | ✅ Excellent | ✅ Good |
| Agricultural Knowledge | ✅ Strong | ✅ Strong |
| JSON Mode | ✅ Native | ⚠️ Beta |
| Context Window | 128K tokens | 16K tokens |

## 🔗 API Endpoints

### Crop Prediction
`POST /api/crop/predict`
- Input: Soil/climate data + language
- Output: Detailed crop recommendation

### Disease Diagnosis
`POST /api/disease/diagnose`
- Input: Crop type, symptoms + language
- Output: Comprehensive diagnosis & treatment

### Pest Management
`POST /api/disease/pest-management`
- Input: Crop type, pest issue + language
- Output: IPM strategy & solutions

## 🐛 Troubleshooting

### Issue: "Groq API error"
**Solution**: 
1. Check your API key in `.env`
2. Verify internet connection
3. Check Groq API status: https://status.groq.com

### Issue: Responses not in expected language
**Solution**:
1. Verify `language` parameter is sent
2. Check localStorage: `localStorage.getItem('language')`
3. Supported: en, hi, ta, ur, ml only

### Issue: "Module 'groq' not found"
**Solution**:
```bash
cd backend
pip install groq==0.4.2
```

## 📱 Mobile App Integration

The multilingual API works seamlessly with mobile apps:

```javascript
// React Native / Mobile
const language = DeviceInfo.getDeviceLocale(); // 'hi-IN'
const langCode = language.split('-')[0]; // 'hi'

const result = await fetch('http://your-api.com/api/crop/predict', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    ...cropData,
    language: langCode
  })
});
```

## 🎓 Best Practices

1. **Always specify language**: Include language code in all requests
2. **Cache responses**: Store AI responses to reduce API costs
3. **Validate inputs**: Ensure data quality before sending to AI
4. **Handle errors**: Implement fallback for API failures
5. **Monitor usage**: Track API calls and costs

## 📈 Next Steps

1. ✅ Test all features in different languages
2. ✅ Collect user feedback on AI responses
3. 🔄 Fine-tune prompts for better regional advice
4. 🔄 Add image analysis for disease detection
5. 🔄 Integrate with local agricultural databases

## 🆘 Support

For issues or questions:
1. Check API logs: `backend/app.log`
2. Review Groq documentation: https://console.groq.com/docs
3. Test with curl commands above

---

**Status**: ✅ Fully Integrated & Operational
**Last Updated**: February 2026
