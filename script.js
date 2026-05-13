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
    tableDiv.innerHTML = "<p style='text-align:center; padding:50px; color:#38bdf8; font-weight:bold;'>Pobieranie danych...</p>";
    
    const url = sheetLinks[currentViewMonth];
    let rawData = null;

    try {
        // Metoda 1: Bezpośrednio
        try {
            const res1 = await fetch(url, { cache: "no-store" });
            if (res1.ok) rawData = await res1.text();
        } catch (e) {}

        // Metoda 2: Proxy AllOrigins
        if (!rawData) {
            try {
                const res2 = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}&ts=${Date.now()}`);
                if (res2.ok) { const j = await res2.json(); rawData = j.contents; }
            } catch (e) {}
        }

        // Metoda 3: Corsproxy.io
        if (!rawData) {
            try {
                const res3 = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
                if (res3.ok) rawData = await res3.text();
            } catch (e) {}
        }

        if (!rawData) throw new Error("Błąd sieci");

        const rows = rawData.split(/\r?\n/).filter(line => line.trim() !== "").map(parseCSVLine);
        renderTable(rows);

    } catch (err) {
        tableDiv.innerHTML = `<p style="color:red; text-align:center; padding:50px;">Błąd połączenia. Sprawdź internet lub wyłącz AdBlocka.</p>`;
    }
}

function parseCSVLine(line) {
    const result = [];
    let cur = "", inQuote = false;
    const sep = line.includes(';') ? ';' : ',';
    for (let char of line) {
        if (char === '"') inQuote = !inQuote;
        else if (char === sep && !inQuote) { result.push(cur.trim()); cur = ""; }
        else cur += char;
    }
    result.push(cur.trim());
    return result.map(c => c.replace(/^"(.*)"$/, '$1'));
}

function renderTable(rows) {
    const tableDiv = document.getElementById("table-container");
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let html = `<table><colgroup>
        <col style="width:95px;"><col style="width:65px;">
        <col style="width:300px;"><col style="width:300px;"><col style="width:300px;"><col style="width:300px;">
    </colgroup>`;
    
    let weekCounter = 0;
    rows.forEach((row, i) => {
        if (i > 1 && row[0] && row[0].toLowerCase().includes("poniedziałek")) weekCounter++;
        const isToday = row[1] && row[1].trim() === todayStr;

        if (i < 2) {
            if (i === 0) html += "<thead>";
            html += "<tr>" + row.slice(0, 6).map(c => `<th>${c}</th>`).join('') + "</tr>";
            if (i === 1) html += "</thead><tbody>";
        } else {
            const dayName = row[0] ? row[0].toLowerCase() : "";
            const isWeekend = dayName.includes("sobota") || dayName.includes("niedziela") || dayName === "sob" || dayName === "nd";
            
            if (!isWeekend) {
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
        }
    });
    
    tableDiv.innerHTML = html + "</tbody></table>";
    updateHeader();
    setTimeout(initMarquee, 300);
}

function initMarquee() {
    const spans = document.querySelectorAll('.tech-data span');
    spans.forEach(span => {
        const box = span.parentElement;
        const textW = span.getBoundingClientRect().width;
        const boxW = box.getBoundingClientRect().width;
        if (textW > (boxW - 10)) {
            const dist = textW - boxW + 40;
            span.style.setProperty('--scroll-dist', `-${dist}px`);
            span.classList.add('animate-scroll');
            box.style.justifyContent = "flex-start";
        } else {
            box.style.justifyContent = "center";
        }
    });
}

function shortenDay(d) {
    const days = {"poniedziałek":"PON","wtorek":"WT","środa":"ŚR","czwartek":"CZW","piątek":"PT"};
    return days[d.toLowerCase()] || d;
}

function shortenDate(d) {
    const p = d.split("-");
    return p.length === 3 ? `${p[2]}.${p[1]}` : d;
}

function updateHeader() {
    document.getElementById("current-month-name").innerText = `${monthNames[parseInt(currentViewMonth)-1]} 2026`;
    document.getElementById("update-time").innerText = new Date().toLocaleTimeString("pl-PL");
}

function renderNav() {
    let navHtml = "";
    monthNames.forEach((name, i) => {
        const m = String(i + 1).padStart(2, '0');
        navHtml += `<button id="btn-${m}" class="nav-btn ${m === currentViewMonth ? 'active' : ''}" onclick="changeMonth('${m}')">${name}</button>`;
    });
    document.getElementById("month-nav").innerHTML = navHtml;
    const active = document.getElementById(`btn-${currentViewMonth}`);
    if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center' });
}

function changeMonth(m) { currentViewMonth = m; renderNav(); loadData(); }
function updateClock() { document.getElementById("clock").innerText = new Date().toLocaleTimeString("pl-PL"); }

renderNav();
loadData();
setInterval(updateClock, 1000);
