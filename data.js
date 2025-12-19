const DB = {
    // --- ЗАГАЛЬНІ ЛОКАЦІЇ ---
    locations: [
        { name: "Aspen / Mountains", value: "Location: Aspen, Colorado. Background: majestic mountains." },
        { name: "Urban / City",      value: "Location: Modern City Center. Background: city skyline." },
        { name: "Forest / Nature",   value: "Location: Pine Forest. Background: misty trees." },
        { name: "Desert / Arid",     value: "Location: Arid Desert. Background: sand dunes and rocks." },
        { name: "Suburban / Street", value: "Location: Suburban neighborhood. Background: manicured gardens." },
        { name: "✏️ Write my own...", value: "CUSTOM" } 
    ],

    // --- ПОГОДА / СВІТЛО (Спільна для Viewport і Interior) ---
    renderWeather: [
        { name: "Summer Day (Natural)",   value: "Season: Summer. Lighting: Natural bright daylight, sharp sun shadows." },
        { name: "Winter (Overcast)",      value: "Season: Winter. Lighting: Overcast cold diffused light." },
        { name: "Autumn (Golden Hour)",   value: "Season: Autumn. Lighting: Golden hour, low sun, warm atmosphere." },
        { name: "Blue Hour (Evening)",    value: "Time: Blue Hour. Lighting: Deep blue twilight sky, interior lights on." },
        { name: "Night (Dark)",           value: "Time: Night. Lighting: Dark sky, emphasis on artificial lighting." },
        { name: "Studio / Soft",          value: "Lighting: Soft studio lighting, neutral background, even exposure." },
        { name: "✏️ Write my own...",     value: "CUSTOM" }
    ],

    // --- ЗМІНА СЕЗОНУ (Creative Mode) ---
    // Спрощено за твоїм проханням
    seasons: [
        { name: "❄️ Winter (General)",  value: "Change season to Winter. Atmosphere: Cold, snowy, frost on glass." },
        { name: "🍂 Autumn (General)",  value: "Change season to Autumn. Atmosphere: Orange foliage, wet ground, moody." },
        { name: "☀️ Summer (General)",  value: "Change season to Summer. Atmosphere: Lush green vegetation, bright sun." },
        { name: "🌸 Spring (General)",  value: "Change season to Spring. Atmosphere: Fresh green leaves, blooming nature." },
        { name: "✏️ Write my own...",    value: "CUSTOM" }
    ]
};