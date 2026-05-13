const sheetLinks = {
    "01": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1901112775&single=true&output=csv",
    "02": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=761522376&single=true&output=csv",
    "03": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=427047031&single=true&output=csv",
    "04": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1456994350&single=true&output=csv",
    "05": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=605689359&single=true&output=csv",
    "06": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1218108803&single=true&output=csv",
    "07": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=975199346&single=true&output=csv",
    "08": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=878375304&single=true&output=csv",
    "09": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1634226018&single=true&output=csv",
    "10": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=954794309&single=true&output=csv",
    "11": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=930192024&single=true&output=csv",
    "12": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-WCr3FsRxVvSIPLpvielgaKj1npAQjPq0ow_cPCmMntNN2FeXbqxn1ZuXrQ3fKOWjKO9y8--6_DHX/pub?gid=1626189679&single=true&output=csv"
};

const monthNames = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];
let currentViewMonth = String(new Date().getMonth() + 1).padStart(2, '0');

async function loadData() {
    const tableDiv = document.getElementById("table-container");
    tableDiv.innerHTML = "<p style='text-align:center; padding:50px; color:#38bdf8; font-weight:bold;'>Pobieranie grafiku...</p>";
    
    const url = sheetLinks[currentViewMonth];
    let rawData = null;

    try {
        // PRÓBA 1: Bezpośrednio (Najszybsza, ale może być zablokowana przez Safari)
        try {
            const res1 = await fetch(url, { cache: "no-store" });
            if (res1.ok) rawData = await res1.text();
        } catch (e) { console.log("Próba 1 (Bezpośrednia) - nieudana."); }

        // PRÓBA 2: Przez proxy AllOrigins (Omija CORS)
        if (!rawData) {
            try {
                const proxyUrl1 = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
                const res2 = await fetch(proxyUrl1, { cache: "no-store" });
                if (res2.ok) {
                    const json = await res2.json();
                    rawData = json.contents;
                }
            } catch (e) { console.log("Próba 2 (AllOrigins) - nieudana."); }
        }

        // PRÓBA 3: Przez proxy Corsproxy (Jeśli AllOrigins jest zablokowane np. przez Adblock)
        if (!rawData) {
            try {
                const proxyUrl2 = "https://corsproxy.io/?" + encodeURIComponent(url);
                const res3 = await fetch(proxyUrl2, { cache: "no-store" });
                if (res3.ok) rawData = await res3.text();
            } catch (e) { console.log("Próba 3 (Corsproxy) - nieudana."); }
        }

        // Jeśli po 3 próbach dalej nie ma danych:
        if (!rawData) throw new Error("Wszystkie metody pobierania zawiodły.");

        // Parsowanie i renderowanie
        const rows = rawData.split(/\r?\n/).filter(line => line.trim() !== "").map(parseCSVLine);
        renderTable(rows);

    } catch (err) {
        console.error(err);
        tableDiv.innerHTML = `
            <div style="padding: 30px; text-align: center;">
                <p style="color: #ef4444; font-weight: bold; font-size: 16px;">Nie udało się połączyć z bazą danych.</p>
                <p style="color: #94a3b8; font-size: 13px;">Upewnij się, że masz włączony internet oraz wyłącz ewentualne blokery reklam (Adblock/VPN).</p>
                <button onclick="loadData()" style="margin-top:20px; padding:15px; background:#0ea5e9; color:white; border:none; border-radius:10px; width:100%; font-weight:bold;">SPRÓBUJ PONOWNIE</button>
            </div>
        `;
    }
}

function parseCSVLine(line) {
    const result = [];
    let cur = "";
    let inQuote = false;
    const sep = line.includes(';') ? ';' : ',';
    for (let i = 0; i < line.length; i++) {
        let char = line[i];
        if (char === '"') inQuote = !inQuote;
        else if (char === sep && !inQuote) { result.push(cur.trim()); cur = ""; }
        else cur += char;
    }
    result.push(cur.trim());
    return result.map(cell => cell.replace(/^"(.*)"$/, '$1'));
}

function renderTable(rows) {
    const tableDiv = document.getElementById("table-container");
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let html = `<table><colgroup><col style="width:55px;"><col style="width:75px;"><col style="width:300px;"><col style="width:300px;"><col style="width:300px;"><col style="width:300px;"></colgroup>`;
    
    let weekCounter = 0;
    
    rows.forEach((row, i) => {
        if (i > 1 && row[0] && row[0].toLowerCase().includes("poniedziałek")) weekCounter++;
        const isToday = row[1] && row[1].trim() === todayStr;

        if (i < 2) {
            if (i === 0) html += "<thead>";
            html += "<tr>";
            row.slice(0, 6).forEach(cell => { html += `<th>${cell}</th>`; });
            html += "</tr>";
            if (i === 1) html += "</thead><tbody>";
        } else {
            html += `<tr class="${weekCounter % 2 === 0 ? 'week-even' : 'week-odd'} ${isToday ? 'today-row' : ''}">`;
            row.slice(0, 6).forEach((cell, j) => {
                let content = (j === 0) ? shortenDay(cell) : (j === 1) ? shortenDate(cell) : cell;
                if (j > 1 && content.includes("8-16")) content = content.replace(/8-16/i, '<span class="neon-blue-text">8-16</span>');
                
                html += `<td class="${(j===0)?'day':(j===1)?'date':'tech-data'}">
                            <div class="marquee-box"><span>${content}</span></div>
                         </td>`;
            });
            html += "</tr>";
        }
    });
    
    html += "</tbody></table>";
    tableDiv.innerHTML = html;
    
    updateHeader();
    setTimeout(hideWeekends, 100);
    setTimeout(initMarquee, 400);
}

function initMarquee() {
    const spans = document.querySelectorAll('.tech-data span');
    spans.forEach(span => {
        const box = span.parentElement;
        span.classList.remove('animate-scroll'); // Reset
        
        const textW = span.getBoundingClientRect().width;
        const boxW = box.getBoundingClientRect().width;

        if (textW > (boxW - 5)) {
            box.style.justifyContent = "flex-start";
            const dist = textW - boxW + 45;
            span.style.setProperty('--scroll-dist', `-${dist}px`);
            span.classList.add('animate-scroll');
        } else {
            box.style.justifyContent = "center";
        }
    });
}

function shortenDay(day) {
    const days = {"poniedziałek":"Pon","wtorek":"Wt","środa":"Śr","czwartek":"Czw","piątek":"Pt","sobota":"Sob","niedziela":"Nd"};
    return days[day.toLowerCase()] || day;
}

function shortenDate(dateStr) {
    const p = dateStr.split("-");
    return p.length === 3 ? `${p[2]}.${p[1]}` : dateStr;
}

function updateHeader() {
    const mHeader = document.getElementById("current-month-name");
    mHeader.innerText = `${monthNames[parseInt(currentViewMonth)-1].toUpperCase()} 2026`;
    document.getElementById("update-time").innerText = new Date().toLocaleTimeString("pl-PL");
}

function renderNav() {
    let navHtml = "";
    monthNames.forEach((name, i) => {
        const m = String(i + 1).padStart(2, '0');
        navHtml += `<button id="btn-${m}" class="nav-btn ${m === currentViewMonth ? 'active' : ''}" onclick="changeMonth('${m}')">${name}</button>`;
    });
    document.getElementById("month-nav").innerHTML = navHtml;

    setTimeout(() => {
        const activeBtn = document.getElementById(`btn-${currentViewMonth}`);
        if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, 300);
}

function changeMonth(m) {
    currentViewMonth = m;
    renderNav();
    loadData();
}

function updateClock() {
    const clk = document.getElementById("clock");
    if(clk) clk.innerText = new Date().toLocaleTimeString("pl-PL");
}

function hideWeekends() {
    const rows = document.querySelectorAll("table tr");
    rows.forEach(row => {
        const d = row.querySelector(".day");
        if (d) {
            const t = d.innerText.toLowerCase();
            if (t === "sob" || t === "nd" || t.includes("sobota") || t.includes("niedziela")) {
                row.classList.add("hidden-weekend");
            }
        }
    });
}

// Inicjalizacja
renderNav();
loadData();
setInterval(updateClock, 1000);
