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

populate('vp_biome',   DB.locations);
populate('vp_weather', DB.renderWeather);
populate('sc_season',  DB.seasons);
populate('sc_light',   DB.lighting);
populate('in_style',   DB.interiors);


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
});


// --- 3. GENERATOR CORE ---
function generate() {
    let parts = [];
    const fixes = document.getElementById('global_fixes').value;
    const addIfChecked = (id, val) => {
        const el = document.getElementById(id);
        if(!el || el.checked) parts.push(val);
    };

    if (currentTab === 'viewport') {
        parts.push("Turn this viewport screenshot from Blender 3D to photorealistic architecture photography.");
        parts.push("Keep composition, architecture shape and materials basics from the provided image. Strictly adhere to the geometry.");
        
        addIfChecked('use_vp_biome', document.getElementById('vp_biome').value);
        addIfChecked('use_vp_weather', document.getElementById('vp_weather').value);
        addIfChecked('use_vp_lens', "Shot on " + document.getElementById('vp_lens').value + "mm tilt-shift lens.");
        parts.push("High fidelity, 8k resolution, archdaily style.");

    } else if (currentTab === 'season') {
        parts.push("Retouch this architectural image. Change the season and atmosphere entirely while keeping the main building structure.");
        
        addIfChecked('use_sc_season', document.getElementById('sc_season').value);
        addIfChecked('use_sc_light', document.getElementById('sc_light').value);
        parts.push("Adapt vegetation and materials to the new weather conditions.");
        addIfChecked('use_sc_lens', "Shot on " + document.getElementById('sc_lens').value + "mm lens.");
        parts.push("Cinematic lighting, photorealistic.");

    } else if (currentTab === 'interior') {
        parts.push("Turn this viewport screenshot from Blender 3D to photorealistic interior photography.");
        parts.push("Keep composition, room layout, furniture placement and materials basics from the provided image. Strictly adhere to the geometry.");
        
        const room = document.getElementById('in_room').value;
        if (room) parts.push("Room type: " + room + ".");
        
        addIfChecked('use_in_style', document.getElementById('in_style').value);
        parts.push("Detailed textures, realistic indoor lighting, magazine quality.");
        addIfChecked('use_in_lens', "Shot on " + document.getElementById('in_lens').value + "mm wide angle lens.");
    }

    if (fixes.trim() !== "") parts.push("Additional details: " + fixes + ".");

    document.getElementById('result').value = parts.filter(p => p && p.trim() !== "").join(" ");
}

document.addEventListener('input', generate);


// --- 4. HISTORY SYSTEM (Advanced) ---

function saveToHistory(text) {
    let history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
    
    // SNAPSHOT LOGIC: Зберігаємо стани всіх інпутів поточної вкладки
    const settings = {};
    const activePanel = document.getElementById(currentTab);
    const inputs = activePanel.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        if(input.type === 'checkbox') {
            settings[input.id] = input.checked;
        } else {
            settings[input.id] = input.value;
        }
    });
    // Також зберігаємо глобальні фікси
    settings['global_fixes'] = document.getElementById('global_fixes').value;

    const newItem = {
        id: Date.now(),
        text: text,
        date: new Date().toLocaleTimeString(),
        tab: currentTab,
        fav: false,
        settings: settings // <--- Ось тут зберігається "душа" промпта
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
        
        // --- RESTORE LOGIC ---
        div.onclick = (e) => {
            if(e.target.classList.contains('fav-btn')) return;

            // 1. Відкриваємо правильну вкладку
            openTab(item.tab);

            // 2. Якщо є збережені налаштування - відновлюємо їх
            if (item.settings) {
                for (const [id, value] of Object.entries(item.settings)) {
                    const el = document.getElementById(id);
                    if (el) {
                        if (el.type === 'checkbox') {
                            el.checked = value;
                            // Оновлюємо візуальний стан (прозорість)
                            const parent = el.closest('.control-group');
                            if(parent) {
                                if(value) parent.classList.remove('disabled');
                                else parent.classList.add('disabled');
                            }
                        } else {
                            el.value = value;
                        }
                    }
                }
            } else {
                // Фоллбек для старих записів (до апдейту)
                console.log("Old history item, no settings saved.");
            }

            // 3. Генеруємо промпт заново на основі відновлених даних
            // (Це краще, ніж просто вставляти текст, бо UI буде відповідати тексту)
            generate();
            
            // Visual feedback
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

function downloadHistory() {
    const history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
    if (history.length === 0) {
        alert("History is empty!");
        return;
    }

    let content = "AI ARCHVIZ PROMPTER - HISTORY LOG\n";
    content += "Generated on: " + new Date().toLocaleString() + "\n";
    content += "====================================\n\n";

    history.forEach(h => {
        content += `[${h.date}] MODE: ${h.tab.toUpperCase()} ${h.fav ? '★' : ''}\n`;
        content += `${h.text}\n`;
        content += "------------------------------------\n";
    });

    // Magic to trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompts_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}


// --- 5. CLIPBOARD & ACTION ---
function copyToClipboard() {
    const copyText = document.getElementById("result");
    const textVal = copyText.value;
    
    copyText.select();
    navigator.clipboard.writeText(textVal);
    saveToHistory(textVal);

    const btn = document.getElementById("copyBtn");
    const original = btn.innerText;
    btn.innerText = "COPIED & SAVED!";
    btn.style.background = "#4caf50";
    setTimeout(() => { btn.innerText = original; btn.style.background = "#4a9eff"; }, 1000);
}

// Init
openTab('viewport');
renderHistory();