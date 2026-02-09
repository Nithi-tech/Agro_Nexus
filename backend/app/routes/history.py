from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Prediction
from app.utils.auth import get_current_active_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("/predictions")
async def get_prediction_history(
    limit: int = 50,
    prediction_type: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's prediction history"""
    
    query = db.query(Prediction).filter(Prediction.user_id == current_user.id)
    
    if prediction_type:
        query = query.filter(Prediction.prediction_type == prediction_type)
    
    predictions = query.order_by(Prediction.created_at.desc()).limit(limit).all()
    
    return {
        "predictions": [
            {
                "id": p.id,
                "type": p.prediction_type,
                "created_at": p.created_at.isoformat(),
                "confidence": p.confidence,
                "model_used": p.model_used
            }
            for p in predictions
        ],
        "total": len(predictions)
    }

@router.get("/predictions/{prediction_id}")
async def get_prediction_detail(
    prediction_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get detailed information about a specific prediction"""
    
    prediction = db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == current_user.id
    ).first()
    
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    
    import json
    
    return {
        "id": prediction.id,
        "type": prediction.prediction_type,
        "input_data": json.loads(prediction.input_data),
        "output_data": json.loads(prediction.output_data),
        "confidence": prediction.confidence,
        "model_used": prediction.model_used,
        "created_at": prediction.created_at.isoformat()
    }

@router.get("/summary")
async def get_user_summary(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get summary statistics for the user"""
    
    from sqlalchemy import func
    
    # Count predictions by type
    prediction_counts = db.query(
        Prediction.prediction_type,
        func.count(Prediction.id).label("count")
    ).filter(
        Prediction.user_id == current_user.id
    ).group_by(Prediction.prediction_type).all()
    
    # Recent activity
    recent_predictions = db.query(Prediction).filter(
        Prediction.user_id == current_user.id,
        Prediction.created_at >= datetime.utcnow() - timedelta(days=7)
    ).count()
    
    return {
        "user": {
            "username": current_user.username,
            "member_since": current_user.created_at.isoformat(),
            "location": current_user.location,
            "language": current_user.language
        },
        "statistics": {
            "total_predictions": sum(count for _, count in prediction_counts),
            "predictions_by_type": {
                pred_type: count for pred_type, count in prediction_counts
            },
            "recent_activity_7days": recent_predictions
        }
    }
