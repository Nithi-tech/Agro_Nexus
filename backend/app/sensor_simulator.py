import asyncio
import random
from datetime import datetime
from typing import Dict, Any

class SensorSimulator:
    """Simulates IoT sensor data for agriculture monitoring"""
    
    def __init__(self):
        self.base_values = {
            "soil_moisture": 65.0,
            "soil_ph": 6.5,
            "nitrogen": 45.0,
            "phosphorus": 38.0,
            "potassium": 42.0,
            "temperature": 28.0,
            "humidity": 70.0
        }
        
    def get_reading(self, location: str = "Farm-1") -> Dict[str, Any]:
        """Generate a single sensor reading with realistic variations"""
        
        # Add random variations
        reading = {
            "soil_moisture": max(0, min(100, self.base_values["soil_moisture"] + random.uniform(-5, 5))),
            "soil_ph": max(4.0, min(9.0, self.base_values["soil_ph"] + random.uniform(-0.3, 0.3))),
            "nitrogen": max(0, min(200, self.base_values["nitrogen"] + random.uniform(-5, 5))),
            "phosphorus": max(0, min(200, self.base_values["phosphorus"] + random.uniform(-3, 3))),
            "potassium": max(0, min(200, self.base_values["potassium"] + random.uniform(-4, 4))),
            "temperature": max(-10, min(50, self.base_values["temperature"] + random.uniform(-2, 2))),
            "humidity": max(0, min(100, self.base_values["humidity"] + random.uniform(-5, 5))),
            "timestamp": datetime.utcnow(),
            "location": location
        }
        
        # Slowly drift base values to simulate real conditions
        for key in self.base_values:
            self.base_values[key] += random.uniform(-0.1, 0.1)
        
        return reading
    
    async def stream_readings(self, interval: int = 5):
        """Async generator for continuous sensor data"""
        while True:
            yield self.get_reading()
            await asyncio.sleep(interval)
    
    def simulate_day_cycle(self, hour: int) -> Dict[str, Any]:
        """Simulate sensor values based on time of day"""
        
        # Temperature and humidity vary with time
        if 6 <= hour <= 18:  # Daytime
            temp_offset = 5 + (hour - 12) * -0.5
            humidity_offset = -10
        else:  # Nighttime
            temp_offset = -5
            humidity_offset = 10
        
        reading = self.get_reading()
        reading["temperature"] += temp_offset
        reading["humidity"] += humidity_offset
        
        return reading

# Global instance
sensor_simulator = SensorSimulator()
