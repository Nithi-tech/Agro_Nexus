from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.database import init_db, seed_demo_user
import logging

# Import routes
from app.routes import auth, crop, disease, fertilizer, sensor, weather, history

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Smart Agriculture API",
    description="Climate-Resilient Agriculture Platform with AI-powered predictions",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Health check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Smart Agriculture API",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """API information"""
    return {
        "message": "Smart Agriculture API",
        "description": "Climate-Resilient Agriculture Platform",
        "version": "1.0.0",
        "docs": "/api/docs",
        "endpoints": {
            "auth": "/api/auth",
            "crop": "/api/crop",
            "disease": "/api/disease",
            "fertilizer": "/api/fertilizer",
            "sensor": "/api/sensor",
            "weather": "/api/weather",
            "history": "/api/history"
        }
    }

# Include routers
app.include_router(auth.router)
app.include_router(crop.router)
app.include_router(disease.router)
app.include_router(fertilizer.router)
app.include_router(sensor.router)
app.include_router(weather.router)
app.include_router(history.router)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    logger.info("Starting Smart Agriculture API...")
    init_db()
    logger.info("✅ Database initialized")
    seed_demo_user()
    logger.info(f"🌍 Environment: {settings.ENVIRONMENT}")
    logger.info(f"🔐 CORS Origins: {settings.ALLOWED_ORIGINS}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down Smart Agriculture API...")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
