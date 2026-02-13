export default {
  ta: {
    translation: {
      // Navigation
      nav: {
        home: "முகப்பு",
        dashboard: "கட்டுப்பாட்டு பலகை",
        predict: "முன்னறிவிப்பு",
        fertilizer: "உரம்",
        disease: "நோய்",
        history: "வரலாறு",
        settings: "அமைப்புகள்",
        logout: "வெளியேறு",
        login: "உள்நுழை",
        register: "பதிவு செய்"
      },
      
      // Home Page
      home: {
        title: "ஸ்மார்ட் விவசாய தளம்",
        subtitle: "AI உடன் காலநிலை-எதிர்ப்பு விவசாயம்",
        welcome: "வரவேற்கிறோம், விவசாயி!",
        features: {
          crop: "பயிர் முன்னறிவிப்பு",
          sensor: "நேரடி உணர்விகள்",
          fertilizer: "உர திட்டம்",
          weather: "வானிலை முன்னறிவிப்பு"
        },
        cta: "தொடங்குக"
      },
      
      // Authentication
      auth: {
        username: "பயனர் பெயர்",
        email: "மின்னஞ்சல்",
        password: "கடவுச்சொல்",
        fullName: "முழு பெயர்",
        phone: "தொலைபேசி எண்",
        location: "இடம்",
        loginTitle: "உங்கள் கணக்கில் உள்நுழைக",
        registerTitle: "புதிய கணக்கை உருவாக்கு",
        loginButton: "உள்நுழை",
        registerButton: "பதிவு செய்",
        haveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
        noAccount: "கணக்கு இல்லையா?",
        loginSuccess: "உள்நுழைவு வெற்றி!",
        registerSuccess: "பதிவு வெற்றி!",
        loginError: "உள்நுழைவு தோல்வி",
        registerError: "பதிவு தோல்வி"
      },
      
      // Dashboard
      dashboard: {
        title: "நேரடி உணர்வி கட்டுப்பாட்டு பலகை",
        soilMoisture: "மண் ஈரப்பதம்",
        soilPH: "மண் pH",
        nitrogen: "நைட்ரஜன் (N)",
        phosphorus: "பாஸ்பரஸ் (P)",
        potassium: "பொட்டாசியம் (K)",
        temperature: "வெப்பநிலை",
        humidity: "ஈரப்பதம்",
        lastUpdate: "கடைசி புதுப்பிப்பு",
        connecting: "உணர்விகளுடன் இணைக்கப்படுகிறது...",
        optimal: "சிறந்த",
        low: "குறைவு",
        high: "அதிகம்",
        status: "நிலை"
      },
      
      // Crop Prediction
      crop: {
        title: "பயிர் பரிந்துரை",
        subtitle: "உங்கள் மண்ணுக்கு சிறந்த பயிரைக் கண்டறியவும்",
        nitrogen: "நைட்ரஜன் (kg/ha)",
        phosphorus: "பாஸ்பரஸ் (kg/ha)",
        potassium: "பொட்டாசியம் (kg/ha)",
        temperature: "வெப்பநிலை (°C)",
        humidity: "ஈரப்பதம் (%)",
        ph: "மண் pH",
        rainfall: "மழை (mm)",
        predict: "பயிரை முன்னறிவிக்க",
        predicting: "ஆராய்கிறது...",
        recommended: "பரிந்துரைக்கப்பட்ட பயிர்",
        confidence: "நம்பிக்கை",
        alternatives: "மாற்று பயிர்கள்",
        reasoning: "பகுப்பாய்வு",
        useSensorData: "நேரடி உணர்வி தரவைப் பயன்படுத்து"
      },
      
      // Disease Diagnosis
      disease: {
        title: "நோய் கண்டறிதல்",
        subtitle: "தாவர நோய்களை அடையாளம் காண்க மற்றும் சிகிச்சை",
        cropType: "பயிர் வகை",
        symptoms: "அறிகுறிகளை விவரி",
        symptomsPlaceholder: "எ.கா., இலைகளில் மஞ்சள் புள்ளிகள், வாடுதல்...",
        diagnose: "கண்டறி",
        diagnosing: "ஆராய்கிறது...",
        diseaseName: "நோய்",
        treatment: "சிகிச்சை",
        prevention: "தடுப்பு",
        severity: "தீவிரம்",
        low: "குறைவு",
        medium: "நடுத்தர",
        high: "அதிகம்"
      },
      
      // Fertilizer
      fertilizer: {
        title: "உர பரிந்துரை",
        subtitle: "தனிப்பயனாக்கப்பட்ட உர திட்டத்தைப் பெறுக",
        cropType: "பயிர் வகை",
        soilType: "மண் வகை",
        nitrogen: "தற்போதைய நைட்ரஜன்",
        phosphorus: "தற்போதைய பாஸ்பரஸ்",
        potassium: "தற்போதைய பொட்டாசியம்",
        soilPH: "மண் pH",
        moisture: "மண் ஈரப்பதம் (%)",
        recommend: "பரிந்துரையைப் பெறு",
        recommending: "கணக்கிடுகிறது...",
        fertilizerName: "உரம்",
        quantity: "அளவு (kg/acre)",
        timing: "பயன்பாட்டு நேரம்",
        method: "பயன்பாட்டு முறை",
        precautions: "முன்னெச்சரிக்கைகள்",
        cost: "மதிப்பிடப்பட்ட செலவு",
        useSensorData: "நேரடி உணர்வி தரவைப் பயன்படுத்து"
      },
      
      // Weather
      weather: {
        title: "வானிலை முன்னறிவிப்பு",
        location: "இடம்",
        currentWeather: "தற்போதைய வானிலை",
        forecast: "5-நாள் முன்னறிவிப்பு",
        temperature: "வெப்பநிலை",
        humidity: "ஈரப்பதம்",
        rainfall: "மழை",
        windSpeed: "காற்று வேகம்",
        visibility: "தெரிவு"
      },
      
      // History
      history: {
        title: "முன்னறிவிப்பு வரலாறு",
        subtitle: "உங்கள் வரலாற்றைக் காண முன்னறிவிப்புகளை செய்யத் தொடங்குங்கள்",
        type: "வகை",
        date: "தேதி",
        confidence: "நம்பிக்கை",
        details: "விவரங்கள்",
        result: "முடிவு",
        noPredictions: "இன்னும் வரலாறு கிடைக்கவில்லை",
        filter: "வகைப்படுத்து",
        all: "அனைத்தும்",
        crop: "பயிர்",
        disease: "நோய்",
        fertilizer: "உரம்"
      },
      
      // Settings
      settings: {
        title: "அமைப்புகள்",
        language: "மொழி",
        selectLanguage: "மொழியைத் தேர்ந்தெடு",
        profile: "சுயவிவரம்",
        notifications: "அறிவிப்புகள்",
        save: "மாற்றங்களைச் சேமி",
        saved: "அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன"
      },
      
      // Common
      common: {
        loading: "ஏற்றுகிறது...",
        error: "பிழை ஏற்பட்டது",
        success: "வெற்றி",
        cancel: "ரத்து",
        submit: "சமர்ப்பி",
        back: "பின்",
        next: "அடுத்து",
        close: "மூடு",
        save: "சேமி",
        delete: "நீக்கு",
        edit: "திருத்து",
        view: "பார்",
        download: "பதிவிறக்கு",
        refresh: "புதுப்பி",
        search: "தேடு"
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
        title: "ஸ்மார்ட் பண்ணை கட்டளை மையம்",
        subtitle: "காலநிலை-எதிர்ப்பு AI விவசாய தளம்",
        aiActive: "AI ஆலோசனை இயந்திரம் செயலில்",
        lastSync: "கடைசி ஒத்திசைவு",
        connectingToAI: "AI பண்ணை அமைப்புடன் இணைக்கப்படுகிறது...",
        liveFarmVitals: "நேரடி பண்ணை அளவீடுகள்",
        soilMoisture: "மண் ஈரப்பதம்",
        temperature: "வெப்பநிலை",
        soilPH: "மண் pH",
        humidity: "ஈரப்பதம்",
        soilNutrientMatrix: "மண் ஊட்டச்சத்து மேட்ரிக்ஸ் (NPK)",
        nitrogen: "நைட்ரஜன் (N)",
        phosphorus: "பாஸ்பரஸ் (P)",
        potassium: "பொட்டாசியம் (K)",
        aiAdvisoryServices: "AI ஆலோசனை சேவைகள்",
        irrigationAdvisory: "பாசன ஆலோசனை",
        irrigationDesc: "மண் & காலநிலை அடிப்படையில் AI உந்துதல் நீர் திட்டமிடல்",
        cropRecommendations: "பயிர் பரிந்துரைகள்",
        cropRecommendationsDesc: "ML வழிமுறைகளைப் பயன்படுத்தி சிறந்த பயிர் தேர்வு",
        climateIntelligence: "காலநிலை நுண்ணறிவு",
        climateIntelligenceDesc: "செயற்கைக்கோள் படங்கள் & காலநிலை ஆபத்து பகுப்பாய்வு",
        pestDiseaseAI: "பூச்சி & நோய் AI",
        pestDiseaseAIDesc: "முன்கூட்டிய கண்டறிதல் & சிகிச்சை பரிந்துரைகள்",
        fertilizerOptimizer: "உர உகப்பாக்கி",
        fertilizerOptimizerDesc: "துல்லியமான ஊட்டச்சத்து மேலாண்மை அமைப்பு",
        advisoryHistory: "ஆலோசனை வரலாறு",
        advisoryHistoryDesc: "AI முடிவுகள் & முடிவுகளை கண்காணிக்கவும்"
      },

      // Dashboard extras
      dashboardExtras: {
        farmCondition: "பண்ணை நிலை",
        healthy: "ஆரோக்கியமான",
        aiMonitoring: "AI உங்கள் பண்ணையை நேரடியாக கண்காணிக்கிறது",
        irrigationAdvisory: "பாசன ஆலோசனை",
        noIrrigationNeeded: "இன்று பாசனம் தேவையில்லை",
        soilMoistureOptimal: "மண் ஈரப்பத நிலைகள் சிறந்தவை",
        nutrientStatus: "ஊட்டச்சத்து நிலை",
        nutrientsBalanced: "மண் ஊட்டச்சத்துக்கள் சமநிலையில்",
        npkHealthy: "NPK ஆரோக்கியமான வரம்பில்",
        npkStatus: "NPK நிலை",
        realTimeTrends: "நேரடி போக்குகள்"
      },

      // Crop Prediction page
      cropPredict: {
        title: "பயிர் முன்னறிவிப்பு",
        subtitle: "சிறந்த விளைச்சலுக்கு AI உந்துதல் பயிர் தேர்வு",
        aiReadiness: "AI தயார்நிலை",
        dataValidated: "தரவு சரிபார்க்கப்பட்டது",
        awaitingInput: "உள்ளீட்டிற்கு காத்திருக்கிறது",
        soilNPK: "மண் NPK",
        climate: "காலநிலை",
        rainfall: "மழை",
        dataFresh: "தரவு புதியது",
        howAIWorks: "AI முன்னறிவிப்பு எப்படி செயல்படுகிறது",
        howAIWorksDesc: "இந்த முன்னறிவிப்பு மண் ஊட்டச்சத்துக்கள் (N, P, K நிலைகள்), காலநிலை நிலைமைகள் (வெப்பநிலை & ஈரப்பதம்), மற்றும் மழை வடிவங்களை அடிப்படையாகக் கொண்டது. உங்கள் வயலில் செழிக்கும் பயிர்களை பரிந்துரைக்க எங்கள் AI இந்த காரணிகளை பகுப்பாய்வு செய்கிறது.",
        enterSoilParams: "மண் அளவுருக்களை உள்ளிடவும்",
        refresh: "புதுப்பி",
        nitrogenN: "நைட்ரஜன் (N)",
        phosphorusP: "பாஸ்பரஸ் (P)",
        potassiumK: "பொட்டாசியம் (K)",
        temperatureC: "வெப்பநிலை (°C)",
        humidityPercent: "ஈரப்பதம் (%)",
        phLevel: "pH நிலை",
        rainfallMm: "மழை (mm)",
        expectedOutcome: "எதிர்பார்க்கப்படும் விளைவு முன்னோட்டம்",
        expectedCropCategory: "எதிர்பார்க்கப்படும் பயிர் வகை",
        finalResultAfterAI: "AI பகுப்பாய்விற்குப் பிறகு இறுதி முடிவு தோன்றும்",
        confidenceScore: "நம்பிக்கை மதிப்பெண்",
        riskLevel: "ஆபத்து நிலை",
        submitForRecommendations: "AI உந்துதல் பயிர் பரிந்துரைகளைப் பெற படிவத்தை சமர்ப்பிக்கவும்",
        predictCrop: "சிறந்த பயிரை முன்னறிவிக்கவும்",
        analyzing: "ஆராய்கிறது...",
        low: "குறைவு",
        optimal: "சிறந்த",
        high: "அதிகம்",
        aiPredictionResult: "AI கணிப்பு முடிவு",
        recommendedCrop: "பரிந்துரைக்கப்பட்ட பயிர்",
        bestSuited: "உங்கள் வயல் நிலைமைகளுக்கு மிகவும் பொருத்தமானது",
        confidenceLabel: "நம்பிக்கை மதிப்பெண்",
        riskIndicator: "ஆபத்து குறிகாட்டி",
        highConfidence: "உயர் நம்பிக்கை",
        moderateConfidence: "மிதமான நம்பிக்கை",
        lowConfidence: "குறைந்த நம்பிக்கை",
        lowRisk: "குறைந்த ஆபத்து",
        mediumRisk: "மிதமான ஆபத்து",
        highRisk: "உயர் ஆபத்து",
        yieldPotential: "எதிர்பார்க்கப்படும் மகசூல் திறன்",
        whyThisCrop: "இந்த பயிர் ஏன்?",
        alternativeCrops: "மாற்று பயிர்கள்",
        growingTips: "வளர்ப்பு குறிப்புகள்",
        nextActions: "அடுத்த நடவடிக்கைகள்",
        viewFertilizer: "உர பரிந்துரையைக் காண்க",
        optimizeNutrients: "மண் ஊட்டச்சத்துக்களை மேம்படுத்துக",
        checkIrrigation: "நீர்ப்பாசன ஆலோசனையைச் சரிபார்க்கவும்",
        smartWatering: "ஸ்மார்ட் நீர்ப்பாசன அட்டவணையைப் பெறுங்கள்",
        predictionSuccess: "கணிப்பு முடிந்தது!",
        predictionError: "கணிப்பு தோல்வி!"
      },

      // Fertilizer page extras
      fertilizerExtras: {
        subtitle: "ஆரோக்கியமான பயிர்களுக்கு துல்லியமான ஊட்டச்சத்து மேலாண்மை",
        soilCropInputData: "மண் & பயிர் உள்ளீட்டு தரவு",
        enterFieldInfo: "உர பரிந்துரைகளைப் பெற உங்கள் வயல் தகவலை உள்ளிடவும்",
        refreshNPK: "NPK புதுப்பி",
        cropType: "பயிர் வகை",
        soilType: "மண் வகை",
        select: "தேர்ந்தெடுக்கவும்",
        generatePrescription: "உர சிகிச்சை உருவாக்கு"
      },

      // Disease Detection page
      diseaseDetection: {
        title: "நோய் கண்டறிதல்",
        subtitle: "AI உந்துதல் தாவர ஆரோக்கிய பகுப்பாய்வு & சிகிச்சை வழிகாட்டல்",
        plantImageAnalysis: "தாவர பட பகுப்பாய்வு",
        uploadOrCapture: "AI நோய் கண்டறிதலுக்கு தாவர இலை படத்தை பதிவேற்றவும் அல்லது படமெடுக்கவும்",
        uploadImage: "படத்தை பதிவேற்று",
        browseGallery: "கேலரியிலிருந்து உலாவவும்",
        capturePhoto: "புகைப்படம் எடு",
        openCamera: "சாதன கேமரா திற",
        tip: "குறிப்பு",
        tipText: "சிறந்த முடிவுகளுக்கு, நல்ல வெளிச்சத்தில் பாதிக்கப்பட்ட இலைகளின் தெளிவான படத்தை எடுக்கவும்",
        remove: "நீக்கு",
        analyzeImage: "படத்தை பகுப்பாய்வு செய்",
        analyzing: "ஆராய்கிறது..."
      }
    }
  }
}
