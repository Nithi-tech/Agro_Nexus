export default {
  hi: {
    translation: {
      // Navigation
      nav: {
        home: "होम",
        dashboard: "डैशबोर्ड",
        predict: "भविष्यवाणी",
        fertilizer: "उर्वरक",
        disease: "रोग",
        history: "इतिहास",
        settings: "सेटिंग्स",
        logout: "लॉगआउट",
        login: "लॉगिन",
        register: "रजिस्टर"
      },
      
      // Home Page
      home: {
        title: "स्मार्ट कृषि मंच",
        subtitle: "AI के साथ जलवायु-प्रतिरोधी खेती",
        welcome: "स्वागत है, किसान!",
        features: {
          crop: "फसल भविष्यवाणी",
          sensor: "लाइव सेंसर",
          fertilizer: "उर्वरक योजना",
          weather: "मौसम पूर्वानुमान"
        },
        cta: "शुरू करें"
      },
      
      // Authentication
      auth: {
        username: "उपयोगकर्ता नाम",
        email: "ईमेल",
        password: "पासवर्ड",
        fullName: "पूरा नाम",
        phone: "फोन नंबर",
        location: "स्थान",
        loginTitle: "अपने खाते में लॉगिन करें",
        registerTitle: "नया खाता बनाएं",
        loginButton: "लॉगिन करें",
        registerButton: "रजिस्टर करें",
        haveAccount: "पहले से खाता है?",
        noAccount: "खाता नहीं है?",
        loginSuccess: "लॉगिन सफल!",
        registerSuccess: "रजिस्ट्रेशन सफल!",
        loginError: "लॉगिन विफल",
        registerError: "रजिस्ट्रेशन विफल"
      },
      
      // Dashboard
      dashboard: {
        title: "लाइव सेंसर डैशबोर्ड",
        soilMoisture: "मिट्टी की नमी",
        soilPH: "मिट्टी का pH",
        nitrogen: "नाइट्रोजन (N)",
        phosphorus: "फॉस्फोरस (P)",
        potassium: "पोटैशियम (K)",
        temperature: "तापमान",
        humidity: "आर्द्रता",
        lastUpdate: "अंतिम अपडेट",
        connecting: "सेंसर से कनेक्ट हो रहा है...",
        optimal: "इष्टतम",
        low: "कम",
        high: "उच्च",
        status: "स्थिति"
      },
      
      // Crop Prediction
      crop: {
        title: "फसल सिफारिश",
        subtitle: "अपनी मिट्टी के लिए सर्वोत्तम फसल खोजें",
        nitrogen: "नाइट्रोजन (kg/ha)",
        phosphorus: "फॉस्फोरस (kg/ha)",
        potassium: "पोटैशियम (kg/ha)",
        temperature: "तापमान (°C)",
        humidity: "आर्द्रता (%)",
        ph: "मिट्टी pH",
        rainfall: "वर्षा (mm)",
        predict: "फसल की भविष्यवाणी करें",
        predicting: "विश्लेषण कर रहे हैं...",
        recommended: "अनुशंसित फसल",
        confidence: "विश्वास",
        alternatives: "वैकल्पिक फसलें",
        reasoning: "विश्लेषण",
        useSensorData: "लाइव सेंसर डेटा उपयोग करें"
      },
      
      // Disease Diagnosis
      disease: {
        title: "रोग निदान",
        subtitle: "पौधों के रोगों की पहचान और उपचार",
        cropType: "फसल का प्रकार",
        symptoms: "लक्षण बताएं",
        symptomsPlaceholder: "उदा., पत्तियों पर पीले धब्बे, मुरझाना...",
        diagnose: "निदान करें",
        diagnosing: "विश्लेषण कर रहे हैं...",
        diseaseName: "रोग",
        treatment: "उपचार",
        prevention: "रोकथाम",
        severity: "गंभीरता",
        low: "कम",
        medium: "मध्यम",
        high: "उच्च"
      },
      
      // Fertilizer
      fertilizer: {
        title: "उर्वरक सिफारिश",
        subtitle: "व्यक्तिगत उर्वरक योजना प्राप्त करें",
        cropType: "फसल का प्रकार",
        soilType: "मिट्टी का प्रकार",
        nitrogen: "वर्तमान नाइट्रोजन",
        phosphorus: "वर्तमान फॉस्फोरस",
        potassium: "वर्तमान पोटैशियम",
        soilPH: "मिट्टी pH",
        moisture: "मिट्टी की नमी (%)",
        recommend: "सिफारिश प्राप्त करें",
        recommending: "गणना कर रहे हैं...",
        fertilizerName: "उर्वरक",
        quantity: "मात्रा (kg/acre)",
        timing: "प्रयोग समय",
        method: "प्रयोग विधि",
        precautions: "सावधानियां",
        cost: "अनुमानित लागत",
        useSensorData: "लाइव सेंसर डेटा उपयोग करें"
      },
      
      // Weather
      weather: {
        title: "मौसम पूर्वानुमान",
        location: "स्थान",
        currentWeather: "वर्तमान मौसम",
        forecast: "5-दिन पूर्वानुमान",
        temperature: "तापमान",
        humidity: "आर्द्रता",
        rainfall: "वर्षा",
        windSpeed: "हवा की गति",
        visibility: "दृश्यता"
      },
      
      // History
      history: {
        title: "भविष्यवाणी इतिहास",
        subtitle: "अपना इतिहास देखने के लिए भविष्यवाणी करना शुरू करें",
        type: "प्रकार",
        date: "तारीख",
        confidence: "विश्वास",
        details: "विवरण",
        result: "परिणाम",
        noPredictions: "अभी तक कोई इतिहास उपलब्ध नहीं है",
        filter: "प्रकार से फ़िल्टर करें",
        all: "सभी",
        crop: "फसल",
        disease: "रोग",
        fertilizer: "उर्वरक"
      },
      
      // Settings
      settings: {
        title: "सेटिंग्स",
        language: "भाषा",
        selectLanguage: "भाषा चुनें",
        profile: "प्रोफ़ाइल",
        notifications: "सूचनाएं",
        save: "परिवर्तन सहेजें",
        saved: "सेटिंग्स सफलतापूर्वक सहेजी गईं"
      },
      
      // Common
      common: {
        loading: "लोड हो रहा है...",
        error: "एक त्रुटि हुई",
        success: "सफलता",
        cancel: "रद्द करें",
        submit: "सबमिट करें",
        back: "पीछे",
        next: "अगला",
        close: "बंद करें",
        save: "सहेजें",
        delete: "हटाएं",
        edit: "संपादित करें",
        view: "देखें",
        download: "डाउनलोड करें",
        refresh: "रीफ्रेश करें",
        search: "खोजें"
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
        title: "स्मार्ट फार्म कमांड सेंटर",
        subtitle: "जलवायु-प्रतिरोधी AI कृषि मंच",
        aiActive: "AI सलाहकार इंजन सक्रिय",
        lastSync: "अंतिम सिंक",
        connectingToAI: "AI फार्म सिस्टम से कनेक्ट हो रहा है...",
        liveFarmVitals: "लाइव फार्म संकेतक",
        soilMoisture: "मिट्टी की नमी",
        temperature: "तापमान",
        soilPH: "मिट्टी का pH",
        humidity: "आर्द्रता",
        soilNutrientMatrix: "मिट्टी पोषक मैट्रिक्स (NPK)",
        nitrogen: "नाइट्रोजन (N)",
        phosphorus: "फॉस्फोरस (P)",
        potassium: "पोटैशियम (K)",
        aiAdvisoryServices: "AI सलाहकार सेवाएं",
        irrigationAdvisory: "सिंचाई सलाह",
        irrigationDesc: "मिट्टी और जलवायु पर आधारित AI जल शेड्यूलिंग",
        cropRecommendations: "फसल सिफारिशें",
        cropRecommendationsDesc: "ML एल्गोरिदम का उपयोग करके इष्टतम फसल चयन",
        climateIntelligence: "जलवायु इंटेलिजेंस",
        climateIntelligenceDesc: "सैटेलाइट इमेजरी और जलवायु जोखिम विश्लेषण",
        pestDiseaseAI: "कीट और रोग AI",
        pestDiseaseAIDesc: "प्रारंभिक पहचान और उपचार सिफारिशें",
        fertilizerOptimizer: "उर्वरक ऑप्टिमाइज़र",
        fertilizerOptimizerDesc: "सटीक पोषक प्रबंधन प्रणाली",
        advisoryHistory: "सलाहकार इतिहास",
        advisoryHistoryDesc: "AI निर्णय और परिणाम ट्रैक करें"
      },

      // Dashboard extras
      dashboardExtras: {
        farmCondition: "फार्म स्थिति",
        healthy: "स्वस्थ",
        aiMonitoring: "AI आपके फार्म की रियल-टाइम निगरानी कर रहा है",
        irrigationAdvisory: "सिंचाई सलाह",
        noIrrigationNeeded: "आज सिंचाई की जरूरत नहीं",
        soilMoistureOptimal: "मिट्टी की नमी स्तर इष्टतम",
        nutrientStatus: "पोषक स्थिति",
        nutrientsBalanced: "मिट्टी के पोषक तत्व संतुलित",
        npkHealthy: "NPK स्वस्थ सीमा में",
        npkStatus: "NPK स्थिति",
        realTimeTrends: "रियल-टाइम रुझान"
      },

      // Crop Prediction page
      cropPredict: {
        title: "फसल भविष्यवाणी",
        subtitle: "इष्टतम उपज के लिए AI-आधारित फसल चयन",
        aiReadiness: "AI तैयारी",
        dataValidated: "डेटा मान्य",
        awaitingInput: "इनपुट की प्रतीक्षा",
        soilNPK: "मिट्टी NPK",
        climate: "जलवायु",
        rainfall: "वर्षा",
        dataFresh: "डेटा ताज़ा",
        howAIWorks: "AI भविष्यवाणी कैसे काम करती है",
        howAIWorksDesc: "यह भविष्यवाणी मिट्टी पोषक तत्वों (N, P, K स्तर), जलवायु स्थितियों (तापमान और आर्द्रता), और वर्षा पैटर्न पर आधारित है। हमारा AI इन कारकों का विश्लेषण करके आपके खेत में फलने-फूलने वाली फसलों की सिफारिश करता है।",
        enterSoilParams: "मिट्टी पैरामीटर दर्ज करें",
        refresh: "रीफ्रेश",
        nitrogenN: "नाइट्रोजन (N)",
        phosphorusP: "फॉस्फोरस (P)",
        potassiumK: "पोटैशियम (K)",
        temperatureC: "तापमान (°C)",
        humidityPercent: "आर्द्रता (%)",
        phLevel: "pH स्तर",
        rainfallMm: "वर्षा (mm)",
        expectedOutcome: "अपेक्षित परिणाम पूर्वावलोकन",
        expectedCropCategory: "अपेक्षित फसल श्रेणी",
        finalResultAfterAI: "AI विश्लेषण के बाद अंतिम परिणाम दिखाई देगा",
        confidenceScore: "विश्वास स्कोर",
        riskLevel: "जोखिम स्तर",
        submitForRecommendations: "AI-आधारित फसल सिफारिशें प्राप्त करने के लिए फॉर्म सबमिट करें",
        predictCrop: "सर्वोत्तम फसल की भविष्यवाणी करें",
        analyzing: "विश्लेषण कर रहे हैं...",
        low: "कम",
        optimal: "इष्टतम",
        high: "उच्च"
      },

      // Fertilizer page extras
      fertilizerExtras: {
        subtitle: "स्वस्थ फसलों के लिए सटीक पोषक प्रबंधन",
        soilCropInputData: "मिट्टी और फसल इनपुट डेटा",
        enterFieldInfo: "उर्वरक सिफारिशें प्राप्त करने के लिए अपने खेत की जानकारी दर्ज करें",
        refreshNPK: "NPK रीफ्रेश करें",
        cropType: "फसल का प्रकार",
        soilType: "मिट्टी का प्रकार",
        select: "चुनें",
        generatePrescription: "उर्वरक प्रेस्क्रिप्शन जेनरेट करें",
        fertilizerPrescription: "उर्वरक प्रेस्क्रिप्शन रिपोर्ट",
        generatedByAI: "मिट्टी और फसल डेटा विश्लेषण के आधार पर AI द्वारा उत्पन्न",
        soilAnalyzed: "मिट्टी विश्लेषित",
        cropSpecific: "फसल-विशिष्ट",
        aiVerified: "AI-सत्यापित"
      },

      // Disease Detection page
      diseaseDetection: {
        title: "रोग पहचान",
        subtitle: "AI-आधारित पौधे स्वास्थ्य विश्लेषण और उपचार मार्गदर्शन",
        plantImageAnalysis: "पौधे चित्र विश्लेषण",
        uploadOrCapture: "AI निदान के लिए पौधे की पत्ती का चित्र अपलोड या कैप्चर करें",
        uploadImage: "चित्र अपलोड करें",
        browseGallery: "गैलरी से ब्राउज़ करें",
        capturePhoto: "फोटो लें",
        openCamera: "डिवाइस कैमरा खोलें",
        tip: "सुझाव",
        tipText: "सर्वोत्तम परिणामों के लिए, अच्छी रोशनी में प्रभावित पत्तियों की स्पष्ट छवि कैप्चर करें",
        remove: "हटाएं",
        analyzeImage: "चित्र विश्लेषण करें",
        analyzing: "विश्लेषण कर रहे हैं..."
      }
    }
  }
}
