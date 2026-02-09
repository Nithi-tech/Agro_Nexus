@echo off
REM Groq AI Integration - Quick Start Script (Windows)
REM This script will set up and test the Groq AI integration

echo ================================
echo Groq AI Integration - Quick Start
echo ================================
echo.

REM Step 1: Check Python version
echo Step 1: Checking Python version...
python --version
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.10+
    exit /b 1
)
echo.

REM Step 2: Navigate to backend
echo Step 2: Setting up backend...
cd backend
echo.

REM Step 3: Install/Upgrade requirements
echo Step 3: Installing dependencies (including Groq SDK)...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo WARNING: Some packages may have failed to install
) else (
    echo [OK] Dependencies installed
)
echo.

REM Step 4: Verify Groq installation
echo Step 4: Verifying Groq SDK installation...
python -c "from groq import Groq; print('[OK] Groq SDK installed successfully!')" 2>nul
if errorlevel 1 (
    echo WARNING: Groq SDK installation failed. Installing manually...
    pip install groq==0.4.2
) else (
    echo [OK] Groq SDK is working!
)
echo.

REM Step 5: Check .env file
echo Step 5: Checking environment configuration...
if exist .env (
    echo [OK] .env file exists
    findstr /C:"GROQ_API_KEY" .env >nul
    if errorlevel 1 (
        echo WARNING: Adding GROQ_API_KEY to .env
        echo. >> .env
        echo # Groq AI API Key >> .env
        echo GROQ_API_KEY=your-groq-api-key-here >> .env
    ) else (
        echo [OK] GROQ_API_KEY found in .env
    )
) else (
    echo WARNING: .env file not found. Creating...
    (
        echo # Database
        echo DATABASE_URL=sqlite:///./agriculture.db
        echo.
        echo # Security
        echo SECRET_KEY=dev-secret-key-change-me
        echo JWT_SECRET_KEY=jwt-secret-key-change-me
        echo.
        echo # AI API Keys
        echo GROQ_API_KEY=your-groq-api-key-here
        echo OPENAI_API_KEY=
        echo GEMINI_API_KEY=
        echo.
        echo # Weather API
        echo WEATHER_API_KEY=
        echo.
        echo # Environment
        echo ENVIRONMENT=development
        echo DEBUG=True
    ) > .env
    echo [OK] .env file created
)
echo.

REM Step 6: Test Groq API connection
echo Step 6: Testing Groq API connection...
python -c "import os; from groq import Groq; client = Groq(api_key=os.getenv('GROQ_API_KEY')); completion = client.chat.completions.create(messages=[{'role':'user','content':'Say \"Groq is working!\" in one sentence'}],model='llama-3.3-70b-versatile',temperature=0.1,max_tokens=50); print('[OK] Groq API Test:'); print('  Response:', completion.choices[0].message.content); print('[OK] Groq AI is ready to use!')"
if errorlevel 1 (
    echo ERROR: Groq API test failed
    echo Please check your API key and internet connection
)
echo.

REM Step 7: Database initialization
echo Step 7: Initializing database...
python -c "from app.database import init_db; init_db(); print('[OK] Database initialized')" 2>nul
if errorlevel 1 (
    echo WARNING: Database initialization may have failed
) else (
    echo [OK] Database ready
)
echo.

REM Summary
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo.
echo 1. Start the backend server:
echo    python -m uvicorn app.main:app --reload --port 8000
echo.
echo 2. In a new terminal, start the frontend:
echo    cd frontend
echo    npm install
echo    npm run dev
echo.
echo 3. Test the AI features:
echo    - Visit http://localhost:5173
echo    - Login or Register
echo    - Try Crop Prediction or Disease Detection
echo    - Select language (EN, HI, TA, UR, ML)
echo.
echo Documentation:
echo    - Integration Guide: GROQ_INTEGRATION_GUIDE.md
echo    - User Guide: CHATBOT_USAGE_GUIDE.md
echo    - API Docs: http://localhost:8000/api/docs
echo.
echo Ready to use Groq AI-powered Smart Agriculture!
echo.
pause
