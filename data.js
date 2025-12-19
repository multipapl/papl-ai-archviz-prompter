const DB = {
    // --- 1. ЛОКАЦІЇ (Context) ---
    locations: [
        { name: "Aspen / Mountains", value: "Location: Aspen, Colorado. Background: majestic mountains." },
        { name: "Urban / City",      value: "Location: Modern City Center. Background: city skyline." },
        { name: "Forest / Nature",   value: "Location: Pine Forest. Background: misty trees." },
        { name: "Desert / Arid",     value: "Location: Arid Desert. Background: sand dunes and rocks." },
        { name: "Suburban / Street", value: "Location: Suburban neighborhood. Background: manicured gardens." },
        { name: "✏️ Write my own...", value: "CUSTOM" } 
    ],

    // --- 2. ПРОСТІ СЕЗОНИ (Для Viewport та Interior) ---
    simpleSeasons: [
        { name: "Summer", value: "Season: Summer." },
        { name: "Winter", value: "Season: Winter." },
        { name: "Autumn", value: "Season: Autumn." },
        { name: "Spring", value: "Season: Spring." },
        { name: "✏️ Custom...", value: "CUSTOM" }
    ],

    // --- 3. СЦЕНАРІЇ СВІТЛА (Чисті, без сезонів) ---
    lightingScenarios: [
        { name: "☀️ Natural Day (Sunny)",  value: "Lighting: Natural bright daylight, sharp sun shadows." },
        { name: "☁️ Overcast (Soft)",      value: "Lighting: Overcast cold diffused light, no harsh shadows." },
        { name: "🌅 Golden Hour (Warm)",   value: "Lighting: Golden hour, low sun, warm atmosphere, long shadows." },
        { name: "🌃 Blue Hour (Evening)",  value: "Time: Blue Hour. Lighting: Deep blue twilight sky, interior lights on." },
        { name: "🌑 Night (Dark)",         value: "Time: Night. Lighting: Dark sky, emphasis on artificial lighting." },
        { name: "💡 Studio (Neutral)",     value: "Lighting: Soft studio lighting, neutral background, even exposure." },
        { name: "✏️ Write my own...",      value: "CUSTOM" }
    ],

    // --- 4. ЗМІНА СЕЗОНУ (Для вкладки 2 - Creative) ---
    creativeSeasons: [
        { name: "❄️ Winter (General)",  value: "Change season to Winter. Atmosphere: Cold, snowy, frost on glass." },
        { name: "🍂 Autumn (General)",  value: "Change season to Autumn. Atmosphere: Orange foliage, wet ground, moody." },
        { name: "☀️ Summer (General)",  value: "Change season to Summer. Atmosphere: Lush green vegetation, bright sun." },
        { name: "🌸 Spring (General)",  value: "Change season to Spring. Atmosphere: Fresh green leaves, blooming nature." },
        { name: "✏️ Write my own...",    value: "CUSTOM" }
    ],
    
    // --- 5. СТИЛІ ІНТЕР'ЄРУ (Опціонально, якщо колись знадобиться) ---
    // Поки не використовуємо, бо ти просив Strict Mode, але базу лишаю
    interiors: [] 
};