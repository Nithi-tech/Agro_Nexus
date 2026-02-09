from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))
    phone = Column(String(20))
    location = Column(String(100))
    language = Column(String(10), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    predictions = relationship("Prediction", back_populates="user")
    sensor_readings = relationship("SensorReading", back_populates="user")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    prediction_type = Column(String(50))  # crop, disease, fertilizer
    input_data = Column(Text)  # JSON string
    output_data = Column(Text)  # JSON string
    confidence = Column(Float)
    model_used = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="predictions")

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    soil_moisture = Column(Float)
    soil_ph = Column(Float)
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)
    location = Column(String(100))
    
    # Relationships
    user = relationship("User", back_populates="sensor_readings")

class CropData(Base):
    __tablename__ = "crop_data"
    
    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False)
    nitrogen_min = Column(Float)
    nitrogen_max = Column(Float)
    phosphorus_min = Column(Float)
    phosphorus_max = Column(Float)
    potassium_min = Column(Float)
    potassium_max = Column(Float)
    temperature_min = Column(Float)
    temperature_max = Column(Float)
    humidity_min = Column(Float)
    humidity_max = Column(Float)
    ph_min = Column(Float)
    ph_max = Column(Float)
    rainfall_min = Column(Float)
    rainfall_max = Column(Float)

class FertilizerRecommendation(Base):
    __tablename__ = "fertilizer_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_type = Column(String(100))
    soil_type = Column(String(50))
    nitrogen = Column(Float)
    phosphorus = Column(Float)
    potassium = Column(Float)
    fertilizer_name = Column(String(100))
    quantity_kg_per_acre = Column(Float)
    application_method = Column(Text)
    timing = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
