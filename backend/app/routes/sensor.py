from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import SensorReading
from app.sensor_simulator import sensor_simulator
from app.models.schemas import SensorData
from typing import List
import json
import asyncio

router = APIRouter(prefix="/api/sensor", tags=["Sensor Data"])

# Active WebSocket connections
active_connections: List[WebSocket] = []

@router.websocket("/stream")
async def sensor_stream(websocket: WebSocket):
    """
    WebSocket endpoint for real-time sensor data streaming
    
    Clients can connect and receive live sensor updates every 5 seconds
    """
    
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            # Generate sensor reading
            reading = sensor_simulator.get_reading()
            
            # Convert datetime to ISO string for JSON serialization
            reading_json = {**reading, "timestamp": reading["timestamp"].isoformat()}
            
            # Send to client
            await websocket.send_json(reading_json)
            
            # Wait for next update
            await asyncio.sleep(5)
            
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        print("Client disconnected from sensor stream")
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket in active_connections:
            active_connections.remove(websocket)

@router.get("/latest", response_model=SensorData)
async def get_latest_reading(db: Session = Depends(get_db)):
    """Get the latest sensor reading"""
    
    # Get from simulator
    reading = sensor_simulator.get_reading()
    
    # Save to database
    sensor_data = SensorReading(**reading)
    db.add(sensor_data)
    db.commit()
    
    return SensorData(**reading)

@router.get("/history")
async def get_sensor_history(
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get historical sensor readings"""
    
    readings = db.query(SensorReading).order_by(
        SensorReading.timestamp.desc()
    ).limit(limit).all()
    
    return {
        "readings": [
            {
                "soil_moisture": r.soil_moisture,
                "soil_ph": r.soil_ph,
                "nitrogen": r.nitrogen,
                "phosphorus": r.phosphorus,
                "potassium": r.potassium,
                "temperature": r.temperature,
                "humidity": r.humidity,
                "timestamp": r.timestamp.isoformat(),
                "location": r.location
            }
            for r in readings
        ],
        "total": len(readings)
    }

@router.get("/stats")
async def get_sensor_stats(db: Session = Depends(get_db)):
    """Get statistical summary of sensor data"""
    
    from sqlalchemy import func
    
    stats = db.query(
        func.avg(SensorReading.soil_moisture).label("avg_moisture"),
        func.avg(SensorReading.soil_ph).label("avg_ph"),
        func.avg(SensorReading.nitrogen).label("avg_nitrogen"),
        func.avg(SensorReading.phosphorus).label("avg_phosphorus"),
        func.avg(SensorReading.potassium).label("avg_potassium"),
        func.avg(SensorReading.temperature).label("avg_temperature"),
        func.avg(SensorReading.humidity).label("avg_humidity"),
        func.min(SensorReading.timestamp).label("first_reading"),
        func.max(SensorReading.timestamp).label("last_reading"),
        func.count(SensorReading.id).label("total_readings")
    ).first()
    
    return {
        "averages": {
            "soil_moisture": round(stats.avg_moisture or 0, 2),
            "soil_ph": round(stats.avg_ph or 0, 2),
            "nitrogen": round(stats.avg_nitrogen or 0, 2),
            "phosphorus": round(stats.avg_phosphorus or 0, 2),
            "potassium": round(stats.avg_potassium or 0, 2),
            "temperature": round(stats.avg_temperature or 0, 2),
            "humidity": round(stats.avg_humidity or 0, 2)
        },
        "total_readings": stats.total_readings or 0,
        "first_reading": stats.first_reading.isoformat() if stats.first_reading else None,
        "last_reading": stats.last_reading.isoformat() if stats.last_reading else None
    }
