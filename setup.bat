@echo off
REM Smart Agriculture Platform - Windows Setup Script

echo ========================================
echo Smart Agriculture Platform - Setup
echo ========================================
echo.

REM Check Python
echo Checking Python version...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.10+
    exit /b 1
)
echo Python found

REM Check Node
echo Checking Node.js version...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    exit /b 1
)
echo Node.js found
echo.

echo ========================
echo Setting up Backend...
echo ========================
cd backend

REM Create virtual environment
echo Creating Python virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM Setup environment file
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo WARNING: Please edit backend\.env and add your API keys!
) else (
    echo .env file already exists
)

REM Initialize database
echo Initializing database...
python -m app.database

echo Backend setup complete!
echo.

cd ..

echo ========================
echo Setting up Frontend...
echo ========================
cd frontend

REM Install dependencies
echo Installing npm dependencies...
call npm install

echo Frontend setup complete!
echo.

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo Backend (Terminal 1):
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn app.main:app --reload --port 8000
echo.
echo Frontend (Terminal 2):
echo   cd frontend
echo   npm run dev
echo.
echo Access the application:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:8000/api/docs
echo.
echo Don't forget to:
echo   1. Edit backend\.env with your API keys
echo   2. Restart backend after updating .env
echo.
echo Happy Hacking!
echo.

pause
