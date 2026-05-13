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

async function loadData() {
    const url = sheetLinks[currentViewMonth];
    try {
        const res = await fetch(url);
        const rawData = await res.text();
        const rows = rawData.split(/\r?\n/).filter(line => line.trim() !== "").map(parseCSVLine);

        const now = new Date();
        const todayCSV = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        let html = "<table>";
        html += `<colgroup>
            <col style="width: 50px;">
            <col style="width: 60px;">
            <col style="width: 120px;">
            <col style="width: 120px;">
            <col style="width: 120px;">
            <col style="width: 120px;">
        </colgroup>`;
        
        let weekCounter = 0;
        rows.forEach((row, i) => {
            if (i > 1 && row[0] && row[0].toLowerCase().includes("poniedziałek")) weekCounter++;
            const isToday = row[1] && row[1].trim() === todayCSV;
            
            if (i < 2) {
                html += "<thead><tr>";
                row.forEach((cell, j) => {
                    if (j <= 5) html += `<th>${cell}</th>`;
                });
                html += "</tr></thead>";
            } else {
                html += `<tr class="${weekCounter % 2 === 0 ? 'week-even' : 'week-odd'} ${isToday ? 'today-row' : ''}">`;
                row.forEach((cell, j) => {
                    if (j > 5) return;
                    let className = (j === 0) ? "day" : (j === 1) ? "date" : "tech-data";
                    let content = (j === 0) ? shortenDay(cell) : (j === 1) ? shortenDate(cell) : cell;
                    
                    if (j > 1 && content.includes("8-16")) {
                        content = content.replace(/8-16/i, '<span class="neon-blue-text">8-16</span>');
                    }
                    
                    html += `<td class="${className}">
                                <div class="marquee-box"><span>${content}</span></div>
                             </td>`;
                });
                html += "</tr>";
            }
        });
        html += "</table>";
        document.getElementById("table-container").innerHTML = html;
        document.getElementById("update-time").innerText = now.toLocaleTimeString();
        updateClock();
        hideWeekends();
        setTimeout(initSmartMarquee, 500);
    } catch (err) { console.error(err); }
}

function initSmartMarquee() {
    const spans = document.querySelectorAll('.tech-data span');
    spans.forEach(span => {
        const box = span.parentElement;
        span.classList.remove('animate-scroll');
        if (span.offsetWidth > box.offsetWidth) {
            const distance = span.offsetWidth - box.offsetWidth + 20;
            span.style.setProperty('--scroll-dist', `-${distance}px`);
            span.classList.add('animate-scroll');
        }
    });
}

function shortenDay(day) {
    const days = {"poniedziałek":"Pon","wtorek":"Wt","środa":"Śr","czwartek":"Czw","piątek":"Pt","sobota":"Sob","niedziela":"Nd"};
    return days[day.toLowerCase()] || day;
}

function shortenDate(dateStr) {
    const parts = dateStr.split("-");
    return parts.length === 3 ? `${parts[2]}.${parts[1]}` : dateStr;
}

function hideWeekends() {
    const rows = document.querySelectorAll("table tr");
    rows.forEach((row) => {
        const dayCell = row.querySelector(".day");
        if (dayCell && (dayCell.innerText === "Sob" || dayCell.innerText === "Nd")) row.style.display = "none";
    });
}

function renderNav() {
    let navHtml = "";
    for (let i = 1; i <= 12; i++) {
        const m = String(i).padStart(2, '0');
        navHtml += `<button class="nav-btn ${m === currentViewMonth ? 'active' : ''}" onclick="changeMonth('${m}')">${monthNames[i-1]}</button>`;
    }
    document.getElementById("month-nav").innerHTML = navHtml;
}

function changeMonth(m) {
    currentViewMonth = m;
    renderNav();
    loadData();
}

function updateClock() {
    const clock = document.getElementById("clock");
    if (clock) clock.innerText = new Date().toLocaleTimeString("pl-PL");
    const monthHeader = document.getElementById("current-month-name");
    if (monthHeader) monthHeader.innerText = `${monthNames[parseInt(currentViewMonth)-1].toUpperCase()} 2026`;
}

renderNav();
loadData();
setInterval(updateClock, 1000);
