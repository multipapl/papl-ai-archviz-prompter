// --- 1. POPULATE DATA ---
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

// === LOAD DATA ===
populate('vp_biome',   DB.locations);
populate('vp_season',  DB.simpleSeasons);
populate('vp_light',   DB.lightingScenarios);

populate('sc_season',  DB.creativeSeasons);
populate('sc_light',   DB.lightingScenarios);

populate('in_biome',   DB.locations);
populate('in_season',  DB.simpleSeasons);
populate('in_light',   DB.lightingScenarios);


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
    generate(); 
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
    if (e.target.type === 'checkbox' && e.target.id.startsWith('use_')) {
        const parent = e.target.closest('.control-group');
        if (e.target.checked) parent.classList.remove('disabled');
        else parent.classList.add('disabled');
        generate();
    }
    if (e.target.id.endsWith('_dof')) generate();
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
        label.innerText = `Ratio: ${w/divisor}:${h/divisor}`;
    } else {
        label.innerText = "Ratio: Auto";
    }
}


// --- 4. GENERATOR CORE (CLEAN LIST MODE) ---
function generate() {
    let lines = [];
    
    const getVal = (selectId, customInputId, checkboxId) => {
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

    const getLensInfo = (lensId, dofId) => {
        const lensVal = document.getElementById(lensId).value;
        const dof = document.getElementById(dofId).checked;
        let txt = `Shot on ${lensVal}mm lens.`;
        if (!dof) txt += " Deep depth of field, sharp focus throughout, f/8.";
        else txt += " Shallow depth of field, bokeh.";
        return txt;
    };

    const middleDetails = document.getElementById('middle_details').value;


    // ===========================
    // MODE 1: VIEWPORT
    // ===========================
    if (currentTab === 'viewport') {
        lines.push("Turn this viewport screenshot from Blender 3D to photorealistic architecture photography. Keep composition, architecture shape and materials basics. Keep aspect ratio. Strictly adhere to the geometry.");
        
        // Split Context & Season into separate bullet points
        const loc = getVal('vp_biome', 'custom_vp_biome', 'use_vp_biome');
        if (loc) lines.push("- " + loc);

        const seas = getVal('vp_season', 'custom_vp_season', 'use_vp_season');
        if (seas) lines.push("- " + seas);

        const light = getVal('vp_light', 'custom_vp_light', 'use_vp_light');
        if (light) lines.push("- " + light);

        if (middleDetails.trim()) lines.push("- Details: " + middleDetails.trim());

        let lineTech = "- ";
        if(document.getElementById('use_vp_lens').checked) lineTech += getLensInfo('vp_lens', 'vp_dof') + " ";
        lineTech += "High fidelity, 8k resolution, archdaily style.";
        lines.push(lineTech);


    // ===========================
    // MODE 2: SEASON
    // ===========================
    } else if (currentTab === 'season') {
        lines.push("Retouch this architectural image. Change the season and atmosphere entirely. Keep the main building structure. Keep aspect ratio.");
        
        const seas = getVal('sc_season', 'custom_sc_season', 'use_sc_season');
        if(seas) lines.push("- " + seas);

        const light = getVal('sc_light', 'custom_sc_light', 'use_sc_light');
        if(light) lines.push("- " + light);

        if (middleDetails.trim()) lines.push("- Details: " + middleDetails.trim());
        
        lines.push("- Adapt vegetation and materials to the new weather conditions.");

        let lineTech = "- ";
        if(document.getElementById('use_sc_lens').checked) lineTech += getLensInfo('sc_lens', 'sc_dof') + " ";
        lineTech += "Cinematic lighting, photorealistic.";
        lines.push(lineTech);


    // ===========================
    // MODE 3: INTERIOR
    // ===========================
    } else if (currentTab === 'interior') {
        lines.push("Turn this viewport screenshot from Blender 3D to photorealistic interior design photography. Keep composition, room layout, furniture placement. Keep aspect ratio. Strictly adhere to the geometry.");

        // Clean split for Interior params
        const room = document.getElementById('in_room').value;
        if(room) lines.push("- Room type: " + room + ".");

        const loc = getVal('in_biome', 'custom_in_biome', 'use_in_biome');
        if(loc) lines.push("- " + loc);

        const seas = getVal('in_season', 'custom_in_season', 'use_in_season');
        if(seas) lines.push("- " + seas);

        const light = getVal('in_light', 'custom_in_light', 'use_in_light');
        if(light) lines.push("- " + light);

        if (middleDetails.trim()) lines.push("- Details: " + middleDetails.trim());

        let lineTech = "- Detailed textures, realistic indoor lighting, magazine quality. ";
        if(document.getElementById('use_in_lens').checked) lineTech += getLensInfo('in_lens', 'in_dof');
        lines.push(lineTech);
    }

    document.getElementById('result').value = lines.join("\n");
}

document.addEventListener('input', generate);


// --- 5. HISTORY SYSTEM ---
function saveToHistory(text) {
    let history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
    const settings = {};
    
    settings['ar_w'] = document.getElementById('ar_w').value;
    settings['ar_h'] = document.getElementById('ar_h').value;
    settings['middle_details'] = document.getElementById('middle_details').value;

    const activePanel = document.getElementById(currentTab);
    const inputs = activePanel.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if(input.type === 'checkbox') settings[input.id] = input.checked;
        else settings[input.id] = input.value;
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
            if (item.settings) {
                document.getElementById('ar_w').value = item.settings['ar_w'] || '';
                document.getElementById('ar_h').value = item.settings['ar_h'] || '';
                document.getElementById('middle_details').value = item.settings['middle_details'] || '';
                calcRatio();

                for (const [id, value] of Object.entries(item.settings)) {
                    const el = document.getElementById(id);
                    if (el) {
                        if (el.type === 'checkbox') {
                            el.checked = value;
                            const parent = el.closest('.control-group');
                            if(parent) (value) ? parent.classList.remove('disabled') : parent.classList.add('disabled');
                        } else {
                            el.value = value;
                            if(el.tagName === 'SELECT') {
                                const customId = 'custom_' + id;
                                const customInput = document.getElementById(customId);
                                if(customInput) customInput.style.display = (value === 'CUSTOM') ? 'block' : 'none';
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
            <div class="preview" style="white-space: pre-wrap;">${item.text}</div>
            <button class="fav-btn ${item.fav ? 'active' : ''}" onclick="toggleFav(${item.id})">${item.fav ? '★' : '☆'}</button>
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

function downloadBackup() {
    const history = localStorage.getItem('prompt_history') || '[]';
    const blob = new Blob([history], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archviz_backup.json`;
    a.click();
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