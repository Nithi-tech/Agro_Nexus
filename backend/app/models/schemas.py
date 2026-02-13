from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Authentication Schemas
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    language: str = "en"

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    location: Optional[str]
    language: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Crop Prediction Schemas
class CropPredictionInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200)
    phosphorus: float = Field(..., ge=0, le=200)
    potassium: float = Field(..., ge=0, le=200)
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0, le=500)
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    language: str = "en"

class CropPredictionOutput(BaseModel):
    recommended_crop: str
    confidence: float
    alternative_crops: List[Dict[str, Any]]
    reasoning: str
    model_used: str
    yield_potential: Optional[str] = None
    growing_tips: Optional[List[str]] = None

# Disease Diagnosis Schemas
class DiseaseDiagnosisInput(BaseModel):
    crop_type: str
    symptoms: str
    image_url: Optional[str] = None
    location: Optional[str] = None
    language: str = "en"

class DiseaseDiagnosisOutput(BaseModel):
    disease_name: str
    confidence: float
    description: str
    treatment: str
    prevention: str
    severity: str

# Fertilizer Recommendation Schemas
class FertilizerInput(BaseModel):
    crop_type: str
    soil_type: str
    nitrogen: float
    phosphorus: float
    potassium: float
    soil_ph: float
    moisture: float
    language: str = "en"

class FertilizerOutput(BaseModel):
    fertilizer_name: str
    fertilizer_type: str
    quantity_kg_per_acre: float
    application_method: str
    timing: str
    frequency: str
    precautions: List[str]
    cost_estimate: Optional[float] = None

# Sensor Schemas
class SensorData(BaseModel):
    soil_moisture: float
    soil_ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    timestamp: datetime
    location: Optional[str] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Weather Schemas
class WeatherData(BaseModel):
    location: str
    temperature: float
    humidity: float
    rainfall: float
    wind_speed: float
    description: str
    forecast: List[Dict[str, Any]]

# Report Schemas
class ReportRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    include_predictions: bool = True
    include_sensors: bool = True
    include_fertilizers: bool = True
    language: str = "en"
