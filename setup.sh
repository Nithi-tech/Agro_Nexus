#!/bin/bash

# Smart Agriculture Platform - Complete Setup Script
# This script sets up both backend and frontend for development

echo "🌾 Smart Agriculture Platform - Setup Script"
echo "=============================================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
python_version=$(python3 --version 2>&1 | grep -oP '\d+\.\d+' | head -1)
required_version="3.10"

if [ "$(printf '%s\n' "$required_version" "$python_version" | sort -V | head -n1)" != "$required_version" ]; then
    echo "❌ Python 3.10+ required. Found: $python_version"
    exit 1
fi
echo "✅ Python $python_version found"

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node --version 2>&1 | grep -oP '\d+' | head -1)
required_node="18"

if [ "$node_version" -lt "$required_node" ]; then
    echo "❌ Node.js 18+ required. Found: $node_version"
    exit 1
fi
echo "✅ Node.js $node_version found"

echo ""
echo "🔧 Setting up Backend..."
echo "========================"

# Backend setup
cd backend || exit

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your API keys!"
else
    echo "✅ .env file already exists"
fi

# Initialize database
echo "🗄️  Initializing database..."
python -m app.database

echo "✅ Backend setup complete!"
echo ""

# Return to root
cd ..

echo "🎨 Setting up Frontend..."
echo "=========================="

# Frontend setup
cd frontend || exit

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

# Return to root
cd ..

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend"
echo "  source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "  uvicorn app.main:app --reload --port 8000"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "📍 Access the application:"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000/api/docs"
echo ""
echo "⚙️  Don't forget to:"
echo "  1. Edit backend/.env with your API keys"
echo "  2. Restart backend after updating .env"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: QUICKSTART.md"
echo "  - Deployment: docs/DEPLOYMENT.md"
echo "  - Architecture: docs/ARCHITECTURE.md"
echo "  - Presentation: docs/PRESENTATION.md"
echo ""
echo "🎉 Happy Hacking!"
