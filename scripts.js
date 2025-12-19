// 1. INIT: Наповнюємо випадаючі списки даними з data.js
function populate(elementId, dataArray) {
    const select = document.getElementById(elementId);
    select.innerHTML = ""; // Clean existing
    dataArray.forEach(item => {
        let opt = document.createElement('option');
        opt.value = item.value;
        opt.innerText = item.name;
        select.appendChild(opt);
    });
}

// Викликаємо наповнення при старті
// Беремо DB з файлу data.js
populate('vp_biome',   DB.locations);
populate('vp_weather', DB.renderWeather);
populate('sc_season',  DB.seasons);
populate('sc_light',   DB.lighting);
populate('in_style',   DB.interiors);


// 2. LOGIC: Tab Switching
let currentTab = 'viewport';

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    
    // Simple button highlight logic
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'viewport') btns[0].classList.add('active');
    if(tabName === 'season') btns[1].classList.add('active');
    if(tabName === 'interior') btns[2].classList.add('active');

    currentTab = tabName;
    generate();
}

// 3. LOGIC: Generator
function generate() {
    let parts = [];
    const fixes = document.getElementById('global_fixes').value;

    if (currentTab === 'viewport') {
        parts.push("Turn this viewport screenshot from Blender 3D to photorealistic architecture photography.");
        parts.push("Keep composition, architecture shape and materials basics from the provided image. Strictly adhere to the geometry.");
        
        parts.push(document.getElementById('vp_biome').value);
        parts.push(document.getElementById('vp_weather').value);
        parts.push("Shot on " + document.getElementById('vp_lens').value + "mm tilt-shift lens.");
        parts.push("High fidelity, 8k resolution, archdaily style.");

    } else if (currentTab === 'season') {
        parts.push("Retouch this architectural image. Change the season and atmosphere entirely while keeping the main building structure.");
        
        parts.push(document.getElementById('sc_season').value);
        parts.push(document.getElementById('sc_light').value);
        parts.push("Adapt vegetation and materials to the new weather conditions.");
        parts.push("Shot on " + document.getElementById('sc_lens').value + "mm lens.");
        parts.push("Cinematic lighting, photorealistic.");

    } else if (currentTab === 'interior') {
        parts.push("Photorealistic interior design photography. Strictly adhere to the room layout and furniture placement.");
        
        const roomType = document.getElementById('in_room').value;
        if (roomType) parts.push("Room type: " + roomType + ".");
        
        parts.push(document.getElementById('in_style').value);
        parts.push("Detailed textures, realistic indoor lighting, magazine quality.");
        parts.push("Shot on " + document.getElementById('in_lens').value + "mm wide angle lens.");
    }

    if (fixes.trim() !== "") parts.push("Additional details: " + fixes + ".");

    document.getElementById('result').value = parts.filter(p => p && p.trim() !== "").join(" ");
}

function copyToClipboard() {
    const copyText = document.getElementById("result");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    
    const btn = document.getElementById("copyBtn");
    const original = btn.innerText;
    btn.innerText = "COPIED!";
    btn.style.background = "#4caf50";
    setTimeout(() => { btn.innerText = original; btn.style.background = "#4a9eff"; }, 1000);
}

document.addEventListener('input', generate);
openTab('viewport'); // Start