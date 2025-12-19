const DB = {
    // --- ЗАГАЛЬНІ ЛОКАЦІЇ (Для Вкладки 1) ---
    locations: [
        { name: "Aspen / Mountains", value: "Location: Aspen, Colorado. Background: majestic mountains." },
        { name: "Urban / City",      value: "Location: Modern City Center. Background: city skyline." },
        { name: "Forest / Nature",   value: "Location: Pine Forest. Background: misty trees." },
        { name: "Desert / Arid",     value: "Location: Arid Desert. Background: sand dunes and rocks." },
        { name: "(None)",            value: "" } 
    ],

    // --- ПОГОДА ДЛЯ РЕНДЕРУ (Для Вкладки 1) ---
    renderWeather: [
        { name: "Summer Day",     value: "Season: Summer. Lighting: Natural bright daylight." },
        { name: "Winter Snow",    value: "Season: Winter. Lighting: Overcast cold light." },
        { name: "Autumn Evening", value: "Season: Autumn. Lighting: Golden hour." },
        { name: "Blue Hour",      value: "Time: Blue Hour. Artificial lights on." }
    ],

    // --- ЗМІНА СЕЗОНУ (Для Вкладки 2) ---
    seasons: [
        { name: "❄️ Winter (Heavy Snow)",  value: "Change season to Winter. Heavy snow on ground and roof, frost on windows." },
        { name: "🍂 Autumn (Rainy)",       value: "Change season to Autumn. Orange foliage, wet ground, fallen leaves." },
        { name: "☀️ Summer (Vibrant)",     value: "Change season to Summer. Lush green grass, bright sun." },
        { name: "🌸 Spring (Fresh)",       value: "Change season to Spring. Fresh greenery, blooming flowers." }
    ],

    // --- СВІТЛО ДЛЯ ЗМІНИ СЕЗОНУ (Для Вкладки 2) ---
    lighting: [
        { name: "☁️ Foggy / Overcast", value: "Lighting: Overcast, soft diffused light, fog." },
        { name: "🌅 Golden Hour",      value: "Lighting: Golden hour, low sun, long shadows." },
        { name: "🌑 Night / Artificial",value: "Lighting: Night shot, dark sky, glowing windows." },
        { name: "☀️ Clear Day",        value: "Lighting: Clear blue sky, high contrast sun." }
    ],

    // --- СТИЛІ ІНТЕР'ЄРУ (Для Вкладки 3) ---
    interiors: [
        { name: "Scandi / Cozy",     value: "Style: Minimalist Scandinavian. Mood: Cozy and bright." },
        { name: "Industrial / Dark", value: "Style: Industrial Loft. Mood: Moody and dark." },
        { name: "Luxury / Sleek",    value: "Style: Luxury Modern. Mood: High-end and sleek." },
        { name: "Wabi-Sabi / Raw",   value: "Style: Wabi-Sabi. Mood: Natural and raw." }
    ]
};