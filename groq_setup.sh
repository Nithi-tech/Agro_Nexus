#!/bin/bash

# Groq AI Integration - Quick Start Script
# This script will set up and test the Groq AI integration

echo "🚀 Groq AI Integration - Quick Start"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Python version
echo -e "${BLUE}Step 1: Checking Python version...${NC}"
python_version=$(python --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"
echo ""

# Step 2: Navigate to backend
echo -e "${BLUE}Step 2: Setting up backend...${NC}"
cd backend

# Step 3: Install/Upgrade requirements
echo -e "${BLUE}Step 3: Installing dependencies (including Groq SDK)...${NC}"
pip install -r requirements.txt --quiet
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 4: Verify Groq installation
echo -e "${BLUE}Step 4: Verifying Groq SDK installation...${NC}"
python -c "from groq import Groq; print('✓ Groq SDK installed successfully!')" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Groq SDK is working!${NC}"
else
    echo -e "${YELLOW}⚠ Groq SDK installation failed. Installing manually...${NC}"
    pip install groq==0.4.2
fi
echo ""

# Step 5: Check .env file
echo -e "${BLUE}Step 5: Checking environment configuration...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    if grep -q "GROQ_API_KEY" .env; then
        echo -e "${GREEN}✓ GROQ_API_KEY found in .env${NC}"
    else
        echo -e "${YELLOW}⚠ Adding GROQ_API_KEY to .env${NC}"
        echo "" >> .env
        echo "# Groq AI API Key" >> .env
        echo "GROQ_API_KEY=your-groq-api-key-here" >> .env
    fi
else
    echo -e "${YELLOW}⚠ .env file not found. Creating...${NC}"
    cp .env .env 2>/dev/null || cat > .env << EOF
# Database
DATABASE_URL=sqlite:///./agriculture.db

# Security
SECRET_KEY=dev-secret-key-change-me
JWT_SECRET_KEY=jwt-secret-key-change-me

# AI API Keys
GROQ_API_KEY=your-groq-api-key-here
OPENAI_API_KEY=
GEMINI_API_KEY=

# Weather API
WEATHER_API_KEY=

# Environment
ENVIRONMENT=development
DEBUG=True
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
fi
echo ""

# Step 6: Test Groq API connection
echo -e "${BLUE}Step 6: Testing Groq API connection...${NC}"
python << 'PYTHON_TEST'
import os
from groq import Groq

try:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "Say 'Groq is working!' in one sentence"}],
        model="llama-3.1-70b-versatile",
        temperature=0.1,
        max_tokens=50
    )
    print("✓ Groq API Connection Test:")
    print(f"  Response: {chat_completion.choices[0].message.content}")
    print("✓ Groq AI is ready to use!")
except Exception as e:
    print(f"✗ Groq API test failed: {e}")
    print("  Please check your API key and internet connection")
PYTHON_TEST
echo ""

# Step 7: Database initialization
echo -e "${BLUE}Step 7: Initializing database...${NC}"
python -c "from app.database import init_db; init_db(); print('✓ Database initialized')" 2>/dev/null
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database ready${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend server:"
echo -e "   ${YELLOW}uvicorn app.main:app --reload --port 8000${NC}"
echo ""
echo "2. In a new terminal, start the frontend:"
echo -e "   ${YELLOW}cd frontend && npm install && npm run dev${NC}"
echo ""
echo "3. Test the AI features:"
echo "   - Visit http://localhost:5173"
echo "   - Login or Register"
echo "   - Try Crop Prediction or Disease Detection"
echo "   - Select language (EN, HI, TA, UR, ML)"
echo ""
echo "📚 Documentation:"
echo "   - Integration Guide: GROQ_INTEGRATION_GUIDE.md"
echo "   - User Guide: CHATBOT_USAGE_GUIDE.md"
echo "   - API Docs: http://localhost:8000/api/docs (when server is running)"
echo ""
echo -e "${GREEN}🎉 Ready to use Groq AI-powered Smart Agriculture!${NC}"
