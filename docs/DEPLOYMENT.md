# 🚀 Deployment Guide - Smart Agriculture System

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- GitHub account
- Render.com account (for backend) OR Railway.app
- Vercel account (for frontend) OR Netlify
- OpenAI account (for AI features) - Get API key from platform.openai.com
- OpenWeatherMap account (for weather) - Free tier available

### Required Software (for local development)
- Python 3.10+
- Node.js 18+
- Git

---

## Backend Deployment

### Option 1: Render.com (Recommended)

#### Step 1: Prepare Repository
```bash
# Push your code to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### Step 2: Create Web Service on Render
1. Go to https://render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `smart-agriculture-api`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid for production)

#### Step 3: Set Environment Variables
In Render dashboard → Environment:
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=generate-with-openssl-rand-hex-32
JWT_SECRET_KEY=generate-with-openssl-rand-hex-32
OPENAI_API_KEY=sk-your-key-here
WEATHER_API_KEY=your-weather-api-key
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
ENVIRONMENT=production
DEBUG=False
```

#### Step 4: Deploy
Click "Create Web Service" - Render will automatically deploy!

#### Step 5: Get Backend URL
Your backend will be available at: `https://smart-agriculture-api.onrender.com`

---

### Option 2: Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add PostgreSQL database
railway add --database postgresql

# Set environment variables
railway variables set SECRET_KEY=your-secret-key
railway variables set OPENAI_API_KEY=sk-your-key

# Deploy
railway up
```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

#### Step 2: Deploy
```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Step 3: Configure Environment
Create `.env.production` in Vercel dashboard:
```env
VITE_API_URL=https://smart-agriculture-api.onrender.com
```

#### Step 4: Redeploy
```bash
vercel --prod
```

Your frontend will be at: `https://smart-agriculture.vercel.app`

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

## Database Setup

### Option 1: Render PostgreSQL (Free Tier)

1. In Render Dashboard → New → PostgreSQL
2. Configure:
   - **Name**: `agriculture-db`
   - **Database**: `agriculture`
   - **User**: auto-generated
   - **Region**: Same as backend
3. Copy **Internal Database URL**
4. Add to backend environment variables as `DATABASE_URL`

### Option 2: Supabase (Free Tier)

1. Go to https://supabase.com/
2. Create new project
3. Copy connection string from Settings → Database
4. Format: `postgresql://postgres:password@host:5432/postgres`
5. Add to backend as `DATABASE_URL`

### Option 3: SQLite (Development Only)

```env
DATABASE_URL=sqlite:///./agriculture.db
```

---

## Environment Variables

### Backend (.env)

**Required:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=<generate-32-char-hex>
JWT_SECRET_KEY=<generate-32-char-hex>
```

**Optional but Recommended:**
```env
OPENAI_API_KEY=sk-...
WEATHER_API_KEY=your-key
GEMINI_API_KEY=your-key
```

**Generate Secret Keys:**
```bash
# Linux/Mac
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

---

## Testing Deployment

### Backend Health Check
```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Smart Agriculture API",
  "version": "1.0.0"
}
```

### Frontend Check
Open browser: `https://your-frontend-url.vercel.app`
- Should load login page
- Check language selector
- Test login/register

### Full Integration Test

1. **Register User**
   - Go to register page
   - Create account
   - Should redirect to dashboard

2. **Test Sensor Dashboard**
   - Navigate to Dashboard
   - Should see live sensor data updating

3. **Test Crop Prediction**
   - Go to Predict page
   - Enter soil parameters
   - Click "Predict Crop"
   - Should get recommendation

4. **Test Multilingual**
   - Change language at top
   - All UI text should translate

---

## Local Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Initialize database
python -m app.database

# Run server
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

---

## Troubleshooting

### Backend Issues

**Problem: Module not found**
```bash
pip install -r requirements.txt --no-cache-dir
```

**Problem: Database connection failed**
- Check DATABASE_URL format
- Ensure database is accessible
- Check firewall rules

**Problem: CORS errors**
- Add frontend URL to ALLOWED_ORIGINS
- Check CORS middleware configuration

### Frontend Issues

**Problem: API calls failing**
- Verify VITE_API_URL is correct
- Check backend is running
- Inspect Network tab in browser DevTools

**Problem: Build fails**
```bash
rm -rf node_modules
npm install
npm run build
```

**Problem: Translations not working**
- Clear browser cache
- Check i18n.js configuration
- Verify language files exist

---

## Production Checklist

- [ ] All API keys set in environment variables
- [ ] SECRET_KEY and JWT_SECRET_KEY are strong and unique
- [ ] DEBUG=False in production
- [ ] Database backups enabled
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] CORS properly configured
- [ ] Error logging enabled
- [ ] Rate limiting configured (optional)
- [ ] Database migrations applied
- [ ] Frontend build optimized

---

## Monitoring & Maintenance

### Render Monitoring
- Check Logs tab for errors
- Monitor Events for deployments
- Set up health check alerts

### Database Backups
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Updating Application
```bash
# Push changes to GitHub
git add .
git commit -m "Update features"
git push

# Render auto-deploys on push
# Vercel auto-deploys on push
```

---

## Cost Estimation

### Free Tier (Hackathon/Demo)
- Render Free: $0
- Vercel Free: $0
- Supabase Free: $0
- OpenAI (trial): $5 credit
- **Total: ~$0-5/month**

### Production (100-1000 users)
- Render Starter: $7/month
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- OpenAI API: ~$20-50/month
- **Total: ~$72-102/month**

---

## Support & Resources

- **Backend API Docs**: `your-backend-url/api/docs`
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev

---

**🎉 Your Smart Agriculture Platform is now LIVE!**
