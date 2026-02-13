from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, FertilizerRecommendation
from app.models.schemas import FertilizerInput, FertilizerOutput
from app.services.fertilizer_service import FertilizerService
from app.utils.auth import get_current_active_user

router = APIRouter(prefix="/api/fertilizer", tags=["Fertilizer Recommendation"])

@router.post("/recommend", response_model=FertilizerOutput)
async def recommend_fertilizer(
    input_data: FertilizerInput,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Recommend fertilizer based on soil data and crop type
    
    Uses Groq AI with multilingual support (en, hi, ta, ur, ml)
    """
    
    try:
        # Get recommendation from fertilizer service with AI and language support
        result = await FertilizerService.recommend_fertilizer_ai(
            crop_type=input_data.crop_type,
            soil_type=input_data.soil_type,
            current_npk={
                "N": input_data.nitrogen,
                "P": input_data.phosphorus,
                "K": input_data.potassium
            },
            soil_ph=input_data.soil_ph,
            moisture=input_data.moisture,
            language=input_data.language
        )
        
        # Save to database
        recommendation = FertilizerRecommendation(
            user_id=current_user.id,
            crop_type=input_data.crop_type,
            soil_type=input_data.soil_type,
            nitrogen=input_data.nitrogen,
            phosphorus=input_data.phosphorus,
            potassium=input_data.potassium,
            fertilizer_name=result["fertilizer_name"],
            quantity_kg_per_acre=result["quantity_kg_per_acre"],
            application_method=result["application_method"],
            timing=result["timing"]
        )
        
        db.add(recommendation)
        db.commit()
        
        return FertilizerOutput(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")

@router.get("/fertilizers")
async def get_all_fertilizers():
    """Get list of all available fertilizers"""
    
    from app.services.fertilizer_service import FERTILIZER_DATABASE
    
    return {
        "fertilizers": [
            {
                "name": name,
                "nitrogen": data["N"],
                "phosphorus": data["P"],
                "potassium": data["K"],
                "type": data["type"]
            }
            for name, data in FERTILIZER_DATABASE.items()
        ]
    }

@router.get("/soil-types")
async def get_soil_types():
    """Get supported soil types"""
    
    return {
        "soil_types": [
            {"name": "Sandy", "description": "Loose, dry, gritty texture"},
            {"name": "Clay", "description": "Heavy, sticky when wet"},
            {"name": "Loamy", "description": "Balanced mixture, ideal for farming"},
            {"name": "Silty", "description": "Smooth, retains water well"},
            {"name": "Peaty", "description": "High organic matter"},
            {"name": "Chalky", "description": "Alkaline, stony"}
        ]
    }
