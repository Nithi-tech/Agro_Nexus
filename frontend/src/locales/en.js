export default {
  en: {
    translation: {
      // Navigation
      nav: {
        home: "Home",
        dashboard: "Dashboard",
        predict: "Predict",
        fertilizer: "Fertilizer",
        disease: "Disease",
        history: "History",
        settings: "Settings",
        logout: "Logout",
        login: "Login",
        register: "Register"
      },
      
      // Home Page
      home: {
        title: "Smart Agriculture Platform",
        subtitle: "Climate-Resilient Farming with AI",
        welcome: "Welcome, Farmer!",
        features: {
          crop: "Crop Prediction",
          sensor: "Live Sensors",
          fertilizer: "Fertilizer Plan",
          weather: "Weather Forecast"
        },
        cta: "Get Started"
      },
      
      // Authentication
      auth: {
        username: "Username",
        email: "Email",
        password: "Password",
        fullName: "Full Name",
        phone: "Phone Number",
        location: "Location",
        loginTitle: "Login to Your Account",
        registerTitle: "Create New Account",
        loginButton: "Login",
        registerButton: "Register",
        haveAccount: "Already have an account?",
        noAccount: "Don't have an account?",
        loginSuccess: "Login successful!",
        registerSuccess: "Registration successful!",
        loginError: "Login failed",
        registerError: "Registration failed"
      },
      
      // Dashboard
      dashboard: {
        title: "Live Sensor Dashboard",
        soilMoisture: "Soil Moisture",
        soilPH: "Soil pH",
        nitrogen: "Nitrogen (N)",
        phosphorus: "Phosphorus (P)",
        potassium: "Potassium (K)",
        temperature: "Temperature",
        humidity: "Humidity",
        lastUpdate: "Last Updated",
        connecting: "Connecting to sensors...",
        optimal: "Optimal",
        low: "Low",
        high: "High",
        status: "Status"
      },
      
      // Crop Prediction
      crop: {
        title: "Crop Recommendation",
        subtitle: "Find the best crop for your soil",
        nitrogen: "Nitrogen (kg/ha)",
        phosphorus: "Phosphorus (kg/ha)",
        potassium: "Potassium (kg/ha)",
        temperature: "Temperature (°C)",
        humidity: "Humidity (%)",
        ph: "Soil pH",
        rainfall: "Rainfall (mm)",
        predict: "Predict Crop",
        predicting: "Analyzing...",
        recommended: "Recommended Crop",
        confidence: "Confidence",
        alternatives: "Alternative Crops",
        reasoning: "Analysis",
        useSensorData: "Use Live Sensor Data"
      },
      
      // Disease Diagnosis
      disease: {
        title: "Disease Diagnosis",
        subtitle: "Identify and treat plant diseases",
        cropType: "Crop Type",
        symptoms: "Describe Symptoms",
        symptomsPlaceholder: "e.g., Yellow spots on leaves, wilting...",
        diagnose: "Diagnose",
        diagnosing: "Analyzing...",
        diseaseName: "Disease",
        treatment: "Treatment",
        prevention: "Prevention",
        severity: "Severity",
        low: "Low",
        medium: "Medium",
        high: "High"
      },
      
      // Fertilizer
      fertilizer: {
        title: "Fertilizer Recommendation",
        subtitle: "Get personalized fertilizer plan",
        cropType: "Crop Type",
        soilType: "Soil Type",
        nitrogen: "Current Nitrogen",
        phosphorus: "Current Phosphorus",
        potassium: "Current Potassium",
        soilPH: "Soil pH",
        moisture: "Soil Moisture (%)",
        recommend: "Get Recommendation",
        recommending: "Calculating...",
        fertilizerName: "Fertilizer",
        quantity: "Quantity (kg/acre)",
        timing: "Application Timing",
        method: "Application Method",
        precautions: "Precautions",
        cost: "Estimated Cost",
        useSensorData: "Use Live Sensor Data"
      },
      
      // Weather
      weather: {
        title: "Weather Forecast",
        location: "Location",
        currentWeather: "Current Weather",
        forecast: "5-Day Forecast",
        temperature: "Temperature",
        humidity: "Humidity",
        rainfall: "Rainfall",
        windSpeed: "Wind Speed",
        visibility: "Visibility"
      },
      
      // History
      history: {
        title: "Prediction History",
        subtitle: "Start making predictions to see your history here",
        type: "Type",
        date: "Date",
        confidence: "Confidence",
        details: "Details",
        result: "Result",
        noPredictions: "No history available yet",
        filter: "Filter by Type",
        all: "All",
        crop: "Crop",
        disease: "Disease",
        fertilizer: "Fertilizer"
      },
      
      // Settings
      settings: {
        title: "Settings",
        language: "Language",
        selectLanguage: "Select Language",
        profile: "Profile",
        notifications: "Notifications",
        save: "Save Changes",
        saved: "Settings saved successfully"
      },
      
      // Common
      common: {
        loading: "Loading...",
        error: "An error occurred",
        success: "Success",
        cancel: "Cancel",
        submit: "Submit",
        back: "Back",
        next: "Next",
        close: "Close",
        save: "Save",
        delete: "Delete",
        edit: "Edit",
        view: "View",
        download: "Download",
        refresh: "Refresh",
        search: "Search"
      },
      
      // Units
      units: {
        celsius: "°C",
        fahrenheit: "°F",
        percent: "%",
        kgPerHa: "kg/ha",
        kgPerAcre: "kg/acre",
        mm: "mm",
        kmh: "km/h",
        ms: "m/s"
      },

      // Smart Dashboard
      smartDashboard: {
        title: "Smart Farm Command Center",
        subtitle: "Climate-Resilient AI Agriculture Platform",
        aiActive: "AI Advisory Engine Active",
        lastSync: "Last sync",
        connectingToAI: "Connecting to AI Farm System...",
        liveFarmVitals: "Live Farm Vitals",
        soilMoisture: "Soil Moisture",
        temperature: "Temperature",
        soilPH: "Soil pH",
        humidity: "Humidity",
        soilNutrientMatrix: "Soil Nutrient Matrix (NPK)",
        nitrogen: "Nitrogen (N)",
        phosphorus: "Phosphorus (P)",
        potassium: "Potassium (K)",
        aiAdvisoryServices: "AI Advisory Services",
        irrigationAdvisory: "Irrigation Advisory",
        irrigationDesc: "AI-powered water scheduling based on soil & climate",
        cropRecommendations: "Crop Recommendations",
        cropRecommendationsDesc: "Optimal crop selection using ML algorithms",
        climateIntelligence: "Climate Intelligence",
        climateIntelligenceDesc: "Satellite imagery & climate risk analysis",
        pestDiseaseAI: "Pest & Disease AI",
        pestDiseaseAIDesc: "Early detection & treatment recommendations",
        fertilizerOptimizer: "Fertilizer Optimizer",
        fertilizerOptimizerDesc: "Precision nutrient management system",
        advisoryHistory: "Advisory History",
        advisoryHistoryDesc: "Track AI decisions & outcomes"
      },

      // Dashboard extras
      dashboardExtras: {
        farmCondition: "Farm Condition",
        healthy: "Healthy",
        aiMonitoring: "AI is monitoring your farm in real-time",
        irrigationAdvisory: "Irrigation Advisory",
        noIrrigationNeeded: "No irrigation needed today",
        soilMoistureOptimal: "Soil moisture levels optimal",
        nutrientStatus: "Nutrient Status",
        nutrientsBalanced: "Soil nutrients mostly balanced",
        npkHealthy: "NPK within healthy range",
        npkStatus: "NPK Status",
        realTimeTrends: "Real-Time Trends"
      },

      // Crop Prediction page
      cropPredict: {
        title: "Crop Prediction",
        subtitle: "AI-powered crop selection for optimal yield",
        aiReadiness: "AI Readiness",
        dataValidated: "Data Validated",
        awaitingInput: "Awaiting Input",
        soilNPK: "Soil NPK",
        climate: "Climate",
        rainfall: "Rainfall",
        dataFresh: "Data Fresh",
        howAIWorks: "How AI Prediction Works",
        howAIWorksDesc: "This prediction is based on soil nutrients (N, P, K levels), climate conditions (temperature & humidity), and rainfall patterns. Our AI analyzes these factors to recommend crops that will thrive in your field.",
        enterSoilParams: "Enter Soil Parameters",
        refresh: "Refresh",
        nitrogenN: "Nitrogen (N)",
        phosphorusP: "Phosphorus (P)",
        potassiumK: "Potassium (K)",
        temperatureC: "Temperature (°C)",
        humidityPercent: "Humidity (%)",
        phLevel: "pH Level",
        rainfallMm: "Rainfall (mm)",
        expectedOutcome: "Expected Outcome Preview",
        expectedCropCategory: "Expected Crop Category",
        finalResultAfterAI: "Final result will appear after AI analysis",
        confidenceScore: "Confidence Score",
        riskLevel: "Risk Level",
        submitForRecommendations: "Submit the form to get AI-powered crop recommendations",
        predictCrop: "Predict Best Crop",
        analyzing: "Analyzing...",
        low: "Low",
        optimal: "Optimal",
        high: "High",
        aiPredictionResult: "AI Prediction Result",
        recommendedCrop: "Recommended Crop",
        bestSuited: "Best suited for your field conditions",
        confidenceLabel: "Confidence Score",
        riskIndicator: "Risk Indicator",
        highConfidence: "High Confidence",
        moderateConfidence: "Moderate Confidence",
        lowConfidence: "Low Confidence",
        lowRisk: "Low Risk",
        mediumRisk: "Medium Risk",
        highRisk: "High Risk",
        yieldPotential: "Expected Yield Potential",
        whyThisCrop: "Why this crop?",
        alternativeCrops: "Alternative Crops",
        growingTips: "Growing Tips",
        nextActions: "Next Actions",
        viewFertilizer: "View Fertilizer Recommendation",
        optimizeNutrients: "Optimize soil nutrients for",
        checkIrrigation: "Check Irrigation Advisory",
        smartWatering: "Get smart watering schedule",
        predictionSuccess: "Prediction completed!",
        predictionError: "Prediction failed!"
      },

      // Fertilizer page extras
      fertilizerExtras: {
        subtitle: "Precision nutrient management for healthy crops",
        soilCropInputData: "Soil & Crop Input Data",
        enterFieldInfo: "Enter your field information to get fertilizer recommendations",
        refreshNPK: "Refresh NPK",
        cropType: "Crop Type",
        soilType: "Soil Type",
        select: "select",
        generatePrescription: "Generate Fertilizer Prescription",
        fertilizerPrescription: "Fertilizer Prescription Report",
        generatedByAI: "Generated by AI based on soil & crop data analysis",
        soilAnalyzed: "Soil Analyzed",
        cropSpecific: "Crop-Specific",
        aiVerified: "AI-Verified"
      },

      // Disease Detection page
      diseaseDetection: {
        title: "Disease Detection",
        subtitle: "AI-powered plant health analysis & treatment guidance",
        plantImageAnalysis: "Plant Image Analysis",
        uploadOrCapture: "Upload or capture a plant leaf image for AI diagnosis",
        uploadImage: "Upload Image",
        browseGallery: "Browse from gallery",
        capturePhoto: "Capture Photo",
        openCamera: "Open device camera",
        tip: "Tip",
        tipText: "For best results, capture a clear image of affected leaves in good lighting",
        remove: "Remove",
        analyzeImage: "Analyze Image",
        analyzing: "Analyzing..."
      }
    }
  }
}
