from typing import Dict, Any, List
import json
from app.config import settings

try:
    from groq import Groq
    GROQ_AVAILABLE = bool(settings.GROQ_API_KEY)
    if GROQ_AVAILABLE:
        groq_client = Groq(api_key=settings.GROQ_API_KEY)
except ImportError:
    GROQ_AVAILABLE = False
    groq_client = None

# Language mappings
LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi (हिंदी)",
    "ta": "Tamil (தமிழ்)",
    "ur": "Urdu (اردو)",
    "ml": "Malayalam (മലയാളം)"
}

# Fertilizer database
FERTILIZER_DATABASE = {
    "Urea": {"N": 46, "P": 0, "K": 0, "type": "Nitrogen"},
    "DAP": {"N": 18, "P": 46, "K": 0, "type": "Phosphorus"},
    "MOP": {"N": 0, "P": 0, "K": 60, "type": "Potassium"},
    "NPK 10-26-26": {"N": 10, "P": 26, "K": 26, "type": "Complex"},
    "NPK 12-32-16": {"N": 12, "P": 32, "K": 16, "type": "Complex"},
    "NPK 17-17-17": {"N": 17, "P": 17, "K": 17, "type": "Balanced"},
    "Ammonium Sulphate": {"N": 21, "P": 0, "K": 0, "type": "Nitrogen"},
    "SSP": {"N": 0, "P": 16, "K": 0, "type": "Phosphorus"},
}

# Crop nutrient requirements (kg/acre)
CROP_REQUIREMENTS = {
    "rice": {"N": 60, "P": 30, "K": 30},
    "wheat": {"N": 50, "P": 25, "K": 25},
    "maize": {"N": 70, "P": 35, "K": 35},
    "cotton": {"N": 80, "P": 40, "K": 40},
    "sugarcane": {"N": 100, "P": 50, "K": 60},
    "potato": {"N": 60, "P": 40, "K": 50},
    "tomato": {"N": 70, "P": 45, "K": 50},
}

class FertilizerService:
    """Intelligent Fertilizer Recommendation Engine with AI Support"""
    
    @staticmethod
    async def recommend_fertilizer_ai(
        crop_type: str,
        soil_type: str,
        current_npk: Dict[str, float],
        soil_ph: float,
        moisture: float,
        language: str = "en"
    ) -> Dict[str, Any]:
        """AI-powered fertilizer recommendation with multilingual support"""
        
        if GROQ_AVAILABLE:
            lang_name = LANGUAGE_NAMES.get(language, "English")
            
            # Calculate deficiencies for context
            crop_req = CROP_REQUIREMENTS.get(crop_type.lower(), {"N": 60, "P": 30, "K": 30})
            n_deficit = max(0, crop_req.get("N", 60) - current_npk['N'])
            p_deficit = max(0, crop_req.get("P", 30) - current_npk['P'])
            k_deficit = max(0, crop_req.get("K", 30) - current_npk['K'])
            
            prompt = f"""You are an expert agricultural scientist. Analyze this SPECIFIC farm data and provide a CUSTOMIZED fertilizer recommendation.

IMPORTANT: Base your recommendation ONLY on these EXACT values:

Farm Details:
- Crop: {crop_type}
- Soil Type: {soil_type}
- Current Nitrogen: {current_npk['N']} kg/ha (Required: {crop_req.get('N', 60)} kg/ha, Deficit: {n_deficit} kg/ha)
- Current Phosphorus: {current_npk['P']} kg/ha (Required: {crop_req.get('P', 30)} kg/ha, Deficit: {p_deficit} kg/ha)
- Current Potassium: {current_npk['K']} kg/ha (Required: {crop_req.get('K', 30)} kg/ha, Deficit: {k_deficit} kg/ha)
- Soil pH: {soil_ph}
- Soil Moisture: {moisture}%

Nutrient Analysis:
- Nitrogen Status: {"DEFICIENT" if n_deficit > 10 else "ADEQUATE" if n_deficit > 0 else "OPTIMAL"}
- Phosphorus Status: {"DEFICIENT" if p_deficit > 10 else "ADEQUATE" if p_deficit > 0 else "OPTIMAL"}
- Potassium Status: {"DEFICIENT" if k_deficit > 10 else "ADEQUATE" if k_deficit > 0 else "OPTIMAL"}

Provide recommendation in {lang_name}. Your response MUST be based on the ACTUAL deficiency values above.

Respond ONLY with valid JSON:
{{
  "fertilizer_name": "SPECIFIC fertilizer name (e.g., Urea, DAP, NPK 10-26-26)",
  "fertilizer_type": "Nitrogen/Phosphorus/Potassium/Complex/Balanced",
  "quantity_kg_per_acre": <exact number based on deficiency>,
  "application_method": "detailed method in {lang_name}",
  "timing": "specific timing for {crop_type} in {lang_name}",
  "frequency": "frequency in {lang_name}",
  "precautions": ["precaution 1", "precaution 2", "precaution 3", "precaution 4"],
  "cost_estimate": <number>,
  "reasoning": "Explain WHY this fertilizer based on N={current_npk['N']}, P={current_npk['P']}, K={current_npk['K']} values and deficits in {lang_name}",
  "soil_health_tips": "soil advice in {lang_name}",
  "expected_benefits": "benefits for {crop_type} in {lang_name}"
}}"""
            
            try:
                chat_completion = groq_client.chat.completions.create(
                    messages=[
                        {
                            "role": "system",
                            "content": f"You are an expert agricultural scientist. Analyze the SPECIFIC nutrient values provided and give CUSTOMIZED recommendations. Never give generic advice. Always base your response on the actual N, P, K values and deficiencies. Respond in {lang_name} with valid JSON only."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    model="llama-3.3-70b-versatile",
                    temperature=0.3,
                    max_tokens=2000,
                    response_format={"type": "json_object"}
                )
                
                result = json.loads(chat_completion.choices[0].message.content)
                result["model_used"] = "Groq Llama-3.3-70B"
                result["language"] = language
                return result
                
            except Exception as e:
                print(f"Groq fertilizer recommendation error: {e}")
                # Fallback to rule-based
                return FertilizerService.recommend_fertilizer(
                    crop_type, soil_type, current_npk, soil_ph, moisture
                )
        else:
            # Fallback to rule-based
            return FertilizerService.recommend_fertilizer(
                crop_type, soil_type, current_npk, soil_ph, moisture
            )
    
    @staticmethod
    def calculate_deficiency(
        current: Dict[str, float],
        required: Dict[str, float]
    ) -> Dict[str, float]:
        """Calculate nutrient deficiency"""
        
        return {
            "N": max(0, required["N"] - current["N"]),
            "P": max(0, required["P"] - current["P"]),
            "K": max(0, required["K"] - current["K"])
        }
    
    @staticmethod
    def recommend_fertilizer(
        crop_type: str,
        soil_type: str,
        current_npk: Dict[str, float],
        soil_ph: float,
        moisture: float
    ) -> Dict[str, Any]:
        """Generate intelligent fertilizer recommendation"""
        
        # Get crop requirements
        crop_req = CROP_REQUIREMENTS.get(crop_type.lower(), {"N": 60, "P": 30, "K": 30})
        
        # Calculate deficiency
        deficiency = FertilizerService.calculate_deficiency(current_npk, crop_req)
        
        # Determine primary need
        max_def = max(deficiency.values())
        
        if max_def == 0:
            return {
                "fertilizer_name": "No Fertilizer Needed",
                "fertilizer_type": "None",
                "quantity_kg_per_acre": 0,
                "application_method": "Soil is already balanced",
                "timing": "N/A",
                "frequency": "N/A",
                "precautions": ["Maintain current nutrient levels"],
                "cost_estimate": 0
            }
        
        # Select best fertilizer
        recommendations = []
        
        # Rule-based selection
        if deficiency["N"] > 30:
            recommendations.append({
                "fertilizer": "Urea",
                "quantity": round(deficiency["N"] / FERTILIZER_DATABASE["Urea"]["N"] * 100, 2),
                "priority": 1
            })
        
        if deficiency["P"] > 20:
            recommendations.append({
                "fertilizer": "DAP",
                "quantity": round(deficiency["P"] / FERTILIZER_DATABASE["DAP"]["P"] * 100, 2),
                "priority": 2
            })
        
        if deficiency["K"] > 20:
            recommendations.append({
                "fertilizer": "MOP",
                "quantity": round(deficiency["K"] / FERTILIZER_DATABASE["MOP"]["K"] * 100, 2),
                "priority": 3
            })
        
        # If balanced deficiency, use NPK complex
        if all(d > 10 for d in deficiency.values()):
            avg_def = sum(deficiency.values()) / 3
            recommendations = [{
                "fertilizer": "NPK 17-17-17",
                "quantity": round(avg_def * 1.5, 2),
                "priority": 1
            }]
        
        # Select top recommendation
        if not recommendations:
            recommendations = [{
                "fertilizer": "NPK 17-17-17",
                "quantity": 50,
                "priority": 1
            }]
        
        top_rec = recommendations[0]
        
        # Adjust for soil pH
        ph_adjustment = ""
        if soil_ph < 5.5:
            ph_adjustment = "Apply lime to increase pH before fertilizer application"
        elif soil_ph > 7.5:
            ph_adjustment = "Apply sulfur to decrease pH for better nutrient absorption"
        
        # Timing based on crop
        timing_map = {
            "rice": "Basal: 50%, Tillering: 25%, Panicle: 25%",
            "wheat": "Basal: 60%, Crown root: 40%",
            "maize": "Basal: 40%, Knee-high: 30%, Tasseling: 30%",
            "cotton": "Basal: 30%, Square formation: 35%, Flowering: 35%",
            "sugarcane": "Basal: 50%, 30 days: 25%, 60 days: 25%",
            "potato": "Basal: 60%, Earthing up: 40%",
            "tomato": "Basal: 50%, Flowering: 25%, Fruiting: 25%"
        }
        
        timing = timing_map.get(crop_type.lower(), "Basal: 60%, Top dressing: 40%")
        
        # Application method
        if moisture < 40:
            method = "Apply with irrigation water (fertigation) due to low moisture"
        elif soil_type.lower() == "sandy":
            method = "Split application recommended for sandy soil"
        else:
            method = "Broadcast and incorporate into soil, followed by irrigation"
        
        # Precautions
        precautions = [
            "Apply in cool hours (early morning or evening)",
            "Ensure adequate soil moisture before application",
            "Avoid direct contact with plant stems",
            "Store in dry, cool place"
        ]
        
        if ph_adjustment:
            precautions.insert(0, ph_adjustment)
        
        # Cost estimate (approximate USD per acre)
        cost_per_kg = {"Urea": 0.35, "DAP": 0.45, "MOP": 0.40, "NPK 17-17-17": 0.50}
        cost = round(
            top_rec["quantity"] * cost_per_kg.get(top_rec["fertilizer"], 0.40),
            2
        )
        
        return {
            "fertilizer_name": top_rec["fertilizer"],
            "fertilizer_type": FERTILIZER_DATABASE[top_rec["fertilizer"]]["type"],
            "quantity_kg_per_acre": top_rec["quantity"],
            "application_method": method,
            "timing": timing,
            "frequency": "Split application as per timing",
            "precautions": precautions,
            "cost_estimate": cost,
            "deficiency_analysis": deficiency,
            "additional_recommendations": [
                {
                    "fertilizer": rec["fertilizer"],
                    "quantity": rec["quantity"]
                }
                for rec in recommendations[1:3]
            ] if len(recommendations) > 1 else []
        }

fertilizer_service = FertilizerService()
