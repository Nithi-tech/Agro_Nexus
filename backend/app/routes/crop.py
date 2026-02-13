from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Prediction
from app.models.schemas import CropPredictionInput, CropPredictionOutput
from app.services.ai_service import AIService
from app.utils.auth import get_current_active_user
import json

router = APIRouter(prefix="/api/crop", tags=["Crop Prediction"])

@router.post("/predict", response_model=CropPredictionOutput)
async def predict_crop(
    input_data: CropPredictionInput,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Predict best crop based on soil and climate parameters
    
    Uses Groq AI API with multilingual support (en, hi, ta, ur, ml)
    """
    
    try:
        # Get prediction from AI service with language and location support
        result = await AIService.predict_crop_ai(
            input_data.model_dump(exclude={'language'}),
            language=input_data.language,
            location=input_data.location,
            latitude=input_data.latitude,
            longitude=input_data.longitude
        )
        
        # Save prediction to database
        prediction = Prediction(
            user_id=current_user.id,
            prediction_type="crop",
            input_data=json.dumps(input_data.model_dump()),
            output_data=json.dumps(result),
            confidence=result.get("confidence", 0.0),
            model_used=result.get("model_used", "Unknown")
        )
        
        db.add(prediction)
        db.commit()
        
        return CropPredictionOutput(
            recommended_crop=result["recommended_crop"],
            confidence=result["confidence"],
            alternative_crops=result.get("alternatives", []),
            reasoning=result.get("reasoning", "Based on soil and climate analysis"),
            model_used=result.get("model_used", "Rule-based"),
            yield_potential=result.get("yield_potential", ""),
            growing_tips=result.get("growing_tips", [])
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/crops")
async def get_all_crops():
    """Get list of all supported crops"""
    
    from app.services.ai_service import CROP_DATABASE
    
    return {
        "crops": list(CROP_DATABASE.keys()),
        "total": len(CROP_DATABASE)
    }

@router.get("/crop/{crop_name}")
async def get_crop_info(crop_name: str):
    """Get detailed information about a specific crop"""
    
    from app.services.ai_service import CROP_DATABASE
    
    crop_name = crop_name.lower()
    
    if crop_name not in CROP_DATABASE:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    info = CROP_DATABASE[crop_name]
    
    return {
        "crop": crop_name,
        "requirements": {
            "nitrogen": {"min": info["N"][0], "max": info["N"][1], "unit": "kg/ha"},
            "phosphorus": {"min": info["P"][0], "max": info["P"][1], "unit": "kg/ha"},
            "potassium": {"min": info["K"][0], "max": info["K"][1], "unit": "kg/ha"},
            "temperature": {"min": info["temp"][0], "max": info["temp"][1], "unit": "°C"},
            "humidity": {"min": info["humidity"][0], "max": info["humidity"][1], "unit": "%"},
            "ph": {"min": info["ph"][0], "max": info["ph"][1]}
        }
    }
