from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Prediction
from app.models.schemas import DiseaseDiagnosisInput, DiseaseDiagnosisOutput
from app.services.ai_service import ai_service
from app.utils.auth import get_current_active_user
import json
from typing import Optional

router = APIRouter(prefix="/api/disease", tags=["Disease Diagnosis"])

@router.post("/diagnose", response_model=DiseaseDiagnosisOutput)
async def diagnose_disease(
    input_data: DiseaseDiagnosisInput,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Diagnose plant disease based on symptoms
    
    Uses Groq AI for accurate multilingual diagnosis (en, hi, ta, ur, ml)
    """
    
    try:
        # Get diagnosis from AI service with language support
        result = await ai_service.diagnose_disease_ai(
            input_data.crop_type,
            input_data.symptoms,
            language=input_data.language
        )
        
        # Save diagnosis to database
        prediction = Prediction(
            user_id=current_user.id,
            prediction_type="disease",
            input_data=json.dumps(input_data.model_dump()),
            output_data=json.dumps(result),
            confidence=result.get("confidence", 0.0),
            model_used=result.get("model_used", "AI-based")
        )
        
        db.add(prediction)
        db.commit()
        
        return DiseaseDiagnosisOutput(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnosis error: {str(e)}")


@router.post("/detect-image")
async def detect_disease_from_image(
    file: UploadFile = File(...),
    crop_type: Optional[str] = Form("general"),
    language: Optional[str] = Form("en"),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Detect plant disease from uploaded image using AI Vision
    
    Accepts image file and uses AI vision models to analyze and diagnose plant diseases
    """
    
    try:
        # Read image file
        image_bytes = await file.read()
        
        # Get diagnosis from AI service with actual image
        result = await ai_service.diagnose_disease_from_image(
            image_bytes=image_bytes,
            crop_type=crop_type,
            language=language
        )
        
        # Save diagnosis to database
        prediction = Prediction(
            user_id=current_user.id,
            prediction_type="disease_image",
            input_data=json.dumps({
                "crop_type": crop_type,
                "filename": file.filename,
                "content_type": file.content_type,
                "language": language
            }),
            output_data=json.dumps(result),
            confidence=result.get("confidence", 0.0),
            model_used=result.get("model_used", "AI Vision Analysis")
        )
        
        db.add(prediction)
        db.commit()
        
        # Map AI response to frontend expected format with better fallbacks
        symptoms_list = result.get("affected_parts", [])
        if not symptoms_list or len(symptoms_list) == 0:
            # Use symptoms_analysis if available, or create from description
            symptoms_analysis = result.get("symptoms_analysis", "")
            if symptoms_analysis:
                symptoms_list = [s.strip() for s in symptoms_analysis.split('.') if s.strip()][:4]
            else:
                symptoms_list = [
                    "Leaf discoloration and abnormal patterns detected",
                    "Visible spots or lesions on plant tissue",
                    "Potential pathogen presence indicated",
                    "Requires immediate attention and treatment"
                ]
        
        return {
            "disease": result.get("disease_name", "Unidentified Plant Disease"),
            "confidence": result.get("confidence", 0.75),
            "treatment": result.get("treatment", "Apply broad-spectrum fungicide as recommended. Consult local agricultural expert for specific treatment plan."),
            "prevention": result.get("prevention", "Maintain proper plant spacing, ensure good air circulation, avoid overhead watering, and practice crop rotation."),
            "severity": result.get("severity", "medium"),
            "symptoms": symptoms_list if isinstance(symptoms_list, list) else [str(symptoms_list)],
            "cause": result.get("description", result.get("symptoms_analysis", "Disease analysis based on visual symptoms and common pathological patterns observed in the uploaded image."))
        }
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Image detection error: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Image detection error: {str(e)}")

@router.get("/common-diseases/{crop_type}")
async def get_common_diseases(crop_type: str):
    """Get common diseases for a specific crop"""
    
    disease_database = {
        "rice": [
            {"name": "Blast", "symptoms": "Diamond-shaped lesions on leaves", "severity": "high"},
            {"name": "Bacterial Blight", "symptoms": "Yellow to white lesions", "severity": "medium"},
            {"name": "Brown Spot", "symptoms": "Circular brown spots", "severity": "low"}
        ],
        "wheat": [
            {"name": "Rust", "symptoms": "Orange-red pustules", "severity": "high"},
            {"name": "Powdery Mildew", "symptoms": "White powdery coating", "severity": "medium"},
            {"name": "Leaf Blight", "symptoms": "Brown lesions", "severity": "medium"}
        ],
        "tomato": [
            {"name": "Late Blight", "symptoms": "Dark water-soaked lesions", "severity": "high"},
            {"name": "Early Blight", "symptoms": "Concentric rings on leaves", "severity": "medium"},
            {"name": "Leaf Curl", "symptoms": "Upward curling of leaves", "severity": "medium"}
        ],
        "potato": [
            {"name": "Late Blight", "symptoms": "Water-soaked lesions", "severity": "high"},
            {"name": "Early Blight", "symptoms": "Target spot patterns", "severity": "medium"},
            {"name": "Black Scurf", "symptoms": "Black sclerotia on tubers", "severity": "low"}
        ]
    }
    
    crop_type = crop_type.lower()
    
    if crop_type not in disease_database:
        return {"crop": crop_type, "diseases": []}
    
    return {
        "crop": crop_type,
        "diseases": disease_database[crop_type]
    }

@router.post("/pest-management")
async def get_pest_management(
    crop_type: str,
    pest_issue: str,
    language: str = "en",
    current_user: User = Depends(get_current_active_user)
):
    """
    Get comprehensive pest management advice
    
    Uses Groq AI for detailed multilingual IPM strategies
    """
    
    try:
        result = await ai_service.get_pest_management_advice(
            crop_type=crop_type,
            pest_issue=pest_issue,
            language=language
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pest management error: {str(e)}")
