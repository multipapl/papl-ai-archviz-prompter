// --- 1. POPULATE DATA & CUSTOM LOGIC ---
function populate(elementId, dataArray) {
    const select = document.getElementById(elementId);
    if(!select) return;
    select.innerHTML = "";
    dataArray.forEach(item => {
        let opt = document.createElement('option');
        opt.value = item.value;
        opt.innerText = item.name;
        select.appendChild(opt);
    });
}

// Load DB
populate('vp_biome',   DB.locations);
populate('vp_weather', DB.renderWeather);
populate('sc_season',  DB.seasons);
// For Season Light we reuse general weather or can make separate DB if needed. Using general for now.
populate('sc_light',   DB.renderWeather); 
// For Interior Light we reuse general weather
populate('in_light',   DB.renderWeather);

// TOGGLE CUSTOM INPUTS
function toggleCustom(selectId, inputId) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(inputId);
    if (select.value === 'CUSTOM') {
        input.style.display = 'block';
        input.focus();
    } else {
        input.style.display = 'none';
    }
    generate(); // Refresh prompt
}


// --- 2. TABS & UI LOGIC ---
let currentTab = 'viewport';

function openTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const tabContent = document.getElementById(tabName);
    if(tabContent) tabContent.classList.add('active');
    
    const btns = document.querySelectorAll('.tab-btn');
    if(tabName === 'viewport') btns[0].classList.add('active');
    if(tabName === 'season') btns[1].classList.add('active');
    if(tabName === 'interior') btns[2].classList.add('active');

    currentTab = tabName;
    generate();
}

document.addEventListener('change', (e) => {
    // Checkbox toggles
    if (e.target.type === 'checkbox' && e.target.id.startsWith('use_')) {
        const parent = e.target.closest('.control-group');
        if (e.target.checked) parent.classList.remove('disabled');
        else parent.classList.add('disabled');
        generate();
    }
    // DOF toggles
    if (e.target.id.endsWith('_dof')) {
        generate();
    }
});


// --- 3. ASPECT RATIO CALCULATOR ---
function gcd(a, b) {
    return b == 0 ? a : gcd(b, a % b);
}

function calcRatio() {
    const w = parseInt(document.getElementById('ar_w').value);
    const h = parseInt(document.getElementById('ar_h').value);
    const label = document.getElementById('ar_result');

    if (w && h) {
        const divisor = gcd(w, h);
        const rW = w / divisor;
        const rH = h / divisor;
        label.innerText = `Ratio: ${rW}:${rH} (Auto-calculated)`;
        generate();
    } else {
        label.innerText = "Ratio: Auto";
    }
}


// --- 4. GENERATOR CORE (THE SAUSAGE) ---
function generate() {
    let parts = [];
    
    // --- HELPER: Get Value (Select vs Custom) ---
    const getVal = (selectId, customInputId, checkboxId) => {
        // If checkbox exists and is unchecked, return null
        if (checkboxId) {
            const cb = document.getElementById(checkboxId);
            if (cb && !cb.checked) return null;
        }

        const select = document.getElementById(selectId);
        if (!select) return null;

        if (select.value === 'CUSTOM') {
            const input = document.getElementById(customInputId);
            return input.value ? input.value : null;
        }
        return select.value;
    };

    // --- HELPER: Get Lens + DOF ---
    const getLensInfo = (lensId, dofId) => {
        const lensVal = document.getElementById(lensId).value;
        const dof = document.getElementById(dofId).checked;
        
        let txt = `Shot on ${lensVal}mm lens.`;
        
        if (!dof) {
            // Anti-DOF (Sharpness) fix
            txt += " Deep depth of field, sharp focus throughout, f/8.";
        } else {
            // Natural Bokeh
            txt += " Shallow depth of field, bokeh.";
        }
        return txt;
    };

    // --- MIDDLE DETAILS (Global) ---
    const middleDetails = document.getElementById('middle_details').value;


    // ===========================
    // MODE 1: VIEWPORT (Exterior)
    // ===========================
    if (currentTab === 'viewport') {
        // 1. PREFIX
        parts.push("Turn this viewport screenshot from Blender 3D to photorealistic architecture photography.");
        parts.push("Keep composition, architecture shape and materials basics from the provided image. Strictly adhere to the geometry.");
        
        // 2. LOCATION
        const loc = getVal('vp_biome', 'custom_vp_biome', 'use_vp_biome');
        if(loc) parts.push(loc);

        // 3. WEATHER
        const weather = getVal('vp_weather', 'custom_vp_weather', 'use_vp_weather');
        if(weather) parts.push(weather);

        // 4. SPECIFIC ELEMENTS (Middle)
        if(middleDetails.trim()) parts.push(middleDetails.trim() + ".");

        // 5. CAMERA & STYLE
        const lens = getLensInfo('vp_lens', 'vp_dof');
        if(document.getElementById('use_vp_lens').checked) parts.push(lens);
        
        parts.push("High fidelity, 8k resolution, archdaily style.");


    // ===========================
    // MODE 2: SEASON (Creative)
    // ===========================
    } else if (currentTab === 'season') {
        // 1. PREFIX
        parts.push("Retouch this architectural image. Change the season and atmosphere entirely.");
        parts.push("Keep the main building structure, composition and perspective.");
        
        // 2. SEASON
        const seas = getVal('sc_season', 'custom_sc_season', 'use_sc_season');
        if(seas) parts.push(seas);

        // 3. LIGHTING
        const light = getVal('sc_light', 'custom_sc_light', 'use_sc_light');
        if(light) parts.push(light);

        // 4. SPECIFIC ELEMENTS (Middle)
        if(middleDetails.trim()) parts.push(middleDetails.trim() + ".");

        parts.push("Adapt vegetation and materials to the new weather conditions.");

        // 5. CAMERA
        const lens = getLensInfo('sc_lens', 'sc_dof');
        if(document.getElementById('use_sc_lens').checked) parts.push(lens);
        
        parts.push("Cinematic lighting, photorealistic.");


    // ===========================
    // MODE 3: INTERIOR (Strict)
    // ===========================
    } else if (currentTab === 'interior') {
        // 1. PREFIX (Strict)
        parts.push("Turn this viewport screenshot from Blender 3D to photorealistic interior design photography.");
        parts.push("Keep composition, room layout, furniture placement and materials basics. Strictly adhere to the geometry.");

        // 2. ROOM TYPE
        const room = document.getElementById('in_room').value;
        if(room) parts.push("Room type: " + room + ".");

        // 3. LIGHTING
        const light = getVal('in_light', 'custom_in_light', 'use_in_light');
        if(light) parts.push(light);

        // 4. SPECIFIC ELEMENTS (Middle)
        if(middleDetails.trim()) parts.push(middleDetails.trim() + ".");

        // 5. CAMERA & QUALITY
        parts.push("Detailed textures, realistic indoor lighting, magazine quality.");
        
        const lens = getLensInfo('in_lens', 'in_dof');
        if(document.getElementById('use_in_lens').checked) parts.push(lens);
    }

    // --- FINAL: ASPECT RATIO ---
    const w = parseInt(document.getElementById('ar_w').value);
    const h = parseInt(document.getElementById('ar_h').value);
    if(w && h) {
        const divisor = gcd(w, h);
        parts.push(`Aspect ratio ${w/divisor}:${h/divisor}`);
    }

    document.getElementById('result').value = parts.filter(p => p && p.trim() !== "").join(" ");
}

document.addEventListener('input', generate);


// --- 5. HISTORY SYSTEM (Updated for Custom Fields) ---

function saveToHistory(text) {
    let history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
    
    // SNAPSHOT LOGIC
    const settings = {};
    
    // Grab global AR & Middle
    settings['ar_w'] = document.getElementById('ar_w').value;
    settings['ar_h'] = document.getElementById('ar_h').value;
    settings['middle_details'] = document.getElementById('middle_details').value;

    // Grab Tab specific
    const activePanel = document.getElementById(currentTab);
    const inputs = activePanel.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if(input.type === 'checkbox') {
            settings[input.id] = input.checked;
        } else {
            settings[input.id] = input.value;
        }
    });

    const newItem = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleTimeString(),
        tab: currentTab,
        fav: false,
        settings: settings
    };

    history.unshift(newItem);
    if(history.length > 50) history.pop();
    localStorage.setItem('prompt_history', JSON.stringify(history));
    renderHistory();
}

function toggleFav(id) {
    let history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
    const index = history.findIndex(i => i.id === id);
    if(index !== -1) {
        history[index].fav = !history[index].fav;
        localStorage.setItem('prompt_history', JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    const list = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
    
    list.innerHTML = "";

    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        div.onclick = (e) => {
            if(e.target.classList.contains('fav-btn')) return;

            openTab(item.tab);

            // Restore Settings
            if (item.settings) {
                // First: Global Restore
                document.getElementById('ar_w').value = item.settings['ar_w'] || '';
                document.getElementById('ar_h').value = item.settings['ar_h'] || '';
                document.getElementById('middle_details').value = item.settings['middle_details'] || '';
                calcRatio(); // update label

                // Second: Tab Specific Restore
                for (const [id, value] of Object.entries(item.settings)) {
                    const el = document.getElementById(id);
                    if (el) {
                        if (el.type === 'checkbox') {
                            el.checked = value;
                            const parent = el.closest('.control-group');
                            if(parent) {
                                if(value) parent.classList.remove('disabled');
                                else parent.classList.add('disabled');
                            }
                        } else {
                            el.value = value;
                            // Trigger Custom visibility check
                            if(el.tagName === 'SELECT') {
                                // Find associated custom input ID (hacky but works based on naming)
                                const customId = 'custom_' + id;
                                const customInput = document.getElementById(customId);
                                if(customInput) {
                                    if(value === 'CUSTOM') customInput.style.display = 'block';
                                    else customInput.style.display = 'none';
                                }
                            }
                        }
                    }
                }
            }
            generate();
            
            div.style.borderColor = '#4a9eff';
            setTimeout(() => div.style.borderColor = '#333', 500);
        };

        div.innerHTML = `
            <div class="timestamp">${item.date} • ${item.tab.toUpperCase()}</div>
            <div class="preview">${item.text}</div>
            <button class="fav-btn ${item.fav ? 'active' : ''}" onclick="toggleFav(${item.id})">
                ${item.fav ? '★' : '☆'}
            </button>
        `;
        list.appendChild(div);
    });
}

function clearHistory() {
    if(confirm("Clear all history?")) {
        localStorage.removeItem('prompt_history');
        renderHistory();
    }
}

// --- 6. EXPORT / IMPORT ---

function downloadBackup() {
    const history = localStorage.getItem('prompt_history') || '[]';
    const blob = new Blob([history], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archviz_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function downloadHistory() {
    const history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
    let content = "AI ARCHVIZ PROMPTER HISTORY\n=================\n\n";
    history.forEach(h => {
        content += `[${h.date}] ${h.tab.toUpperCase()}\n${h.text}\n-----------------\n`;
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts.txt`;
    a.click();
}

function importBackup(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            let currentHistory = JSON.parse(localStorage.getItem('prompt_history') || '[]');
            const existingIds = new Set(currentHistory.map(item => item.id));
            
            importedData.forEach(item => {
                if (!existingIds.has(item.id)) {
                    currentHistory.push(item);
                    existingIds.add(item.id);
                }
            });
            
            currentHistory.sort((a, b) => b.id - a.id);
            localStorage.setItem('prompt_history', JSON.stringify(currentHistory));
            renderHistory();
            alert("Import successful!");
        } catch (err) { alert("Error parsing file"); }
    };
    reader.readAsText(file);
}


function copyToClipboard() {
    const copyText = document.getElementById("result");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    saveToHistory(copyText.value);
    
    const btn = document.getElementById("copyBtn");
    btn.innerText = "SAVED!";
    btn.style.background = "#4caf50";
    setTimeout(() => { btn.innerText = "COPY & SAVE"; btn.style.background = "#4a9eff"; }, 1000);
}

// Init
openTab('viewport');
renderHistory();
calcRatio();