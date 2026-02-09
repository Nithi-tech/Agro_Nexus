import httpx
from typing import Dict, Any
from app.config import settings

class WeatherService:
    """Weather data integration service"""
    
    @staticmethod
    async def get_weather(location: str, lat: float = None, lon: float = None) -> Dict[str, Any]:
        """Fetch weather data from OpenWeatherMap API"""
        
        if not settings.WEATHER_API_KEY:
            return WeatherService._get_mock_weather(location)
        
        try:
            async with httpx.AsyncClient() as client:
                # Current weather
                if lat and lon:
                    url = f"{settings.WEATHER_API_URL}/weather?lat={lat}&lon={lon}&appid={settings.WEATHER_API_KEY}&units=metric"
                else:
                    url = f"{settings.WEATHER_API_URL}/weather?q={location}&appid={settings.WEATHER_API_KEY}&units=metric"
                
                response = await client.get(url, timeout=10)
                response.raise_for_status()
                current = response.json()
                
                # 5-day forecast
                if lat and lon:
                    forecast_url = f"{settings.WEATHER_API_URL}/forecast?lat={lat}&lon={lon}&appid={settings.WEATHER_API_KEY}&units=metric"
                else:
                    forecast_url = f"{settings.WEATHER_API_URL}/forecast?q={location}&appid={settings.WEATHER_API_KEY}&units=metric"
                
                forecast_response = await client.get(forecast_url, timeout=10)
                forecast_response.raise_for_status()
                forecast_data = forecast_response.json()
                
                return {
                    "location": current.get("name", location),
                    "temperature": current["main"]["temp"],
                    "humidity": current["main"]["humidity"],
                    "rainfall": current.get("rain", {}).get("1h", 0),
                    "wind_speed": current["wind"]["speed"],
                    "description": current["weather"][0]["description"],
                    "pressure": current["main"]["pressure"],
                    "visibility": current.get("visibility", 10000) / 1000,
                    "forecast": [
                        {
                            "datetime": item["dt_txt"],
                            "temperature": item["main"]["temp"],
                            "humidity": item["main"]["humidity"],
                            "description": item["weather"][0]["description"],
                            "rain_probability": item.get("pop", 0) * 100
                        }
                        for item in forecast_data["list"][:8]  # Next 24 hours
                    ]
                }
                
        except Exception as e:
            print(f"Weather API error: {e}")
            return WeatherService._get_mock_weather(location)
    
    @staticmethod
    def _get_mock_weather(location: str) -> Dict[str, Any]:
        """Return mock weather data for testing"""
        
        return {
            "location": location,
            "temperature": 28.5,
            "humidity": 65,
            "rainfall": 0,
            "wind_speed": 3.5,
            "description": "partly cloudy",
            "pressure": 1013,
            "visibility": 10,
            "forecast": [
                {
                    "datetime": "2024-03-15 12:00:00",
                    "temperature": 30,
                    "humidity": 60,
                    "description": "clear sky",
                    "rain_probability": 10
                },
                {
                    "datetime": "2024-03-15 15:00:00",
                    "temperature": 32,
                    "humidity": 55,
                    "description": "clear sky",
                    "rain_probability": 5
                }
            ]
        }

weather_service = WeatherService()
