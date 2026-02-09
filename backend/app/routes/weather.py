from fastapi import APIRouter, Depends, HTTPException
from app.services.weather_service import weather_service
from app.models.schemas import WeatherData

router = APIRouter(prefix="/api/weather", tags=["Weather"])

@router.get("/{location}", response_model=WeatherData)
async def get_weather(location: str):
    """
    Get weather data for a specific location
    
    Integrates with OpenWeatherMap API
    """
    
    try:
        weather_data = await weather_service.get_weather(location)
        return WeatherData(**weather_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather fetch error: {str(e)}")

@router.get("/coordinates/{lat}/{lon}")
async def get_weather_by_coords(lat: float, lon: float):
    """Get weather data by GPS coordinates"""
    
    try:
        weather_data = await weather_service.get_weather(
            location="",
            lat=lat,
            lon=lon
        )
        return weather_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather fetch error: {str(e)}")
