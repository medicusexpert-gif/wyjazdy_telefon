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

// ... (początek script.js bez zmian aż do funkcji loadData) ...

async function loadData() {
    const url = sheetLinks[currentViewMonth];
    try {
        const res = await fetch(url);
        const rawData = await res.text();
        const rows = rawData.split(/\r?\n/).filter(line => line.trim() !== "").map(parseCSVLine);

        const now = new Date();
        const todayCSV = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        
        let html = "<table>";
        // Szerokie kolumny (300px)
        html += `<colgroup>
            <col style="width: 50px;">
            <col style="width: 70px;">
            <col style="width: 300px;">
            <col style="width: 300px;">
            <col style="width: 300px;">
            <col style="width: 300px;">
        </colgroup>`;
        
        let weekCounter = 0;
        rows.forEach((row, i) => {
            if (i > 1 && row[0] && row[0].toLowerCase().includes("poniedziałek")) weekCounter++;
            const isToday = row[1] && row[1].trim() === todayCSV;

            if (i < 2) {
                html += "<thead><tr>";
                row.forEach((cell, j) => { if(j <= 5) html += `<th>${cell}</th>`; });
                html += "</tr></thead>";
            } else {
                html += `<tr class="${weekCounter % 2 === 0 ? 'week-even' : 'week-odd'} ${isToday ? 'today-row' : ''}">`;
                row.forEach((cell, j) => {
                    if (j > 5) return;
                    let content = (j === 0) ? shortenDay(cell) : (j === 1) ? shortenDate(cell) : cell;
                    if (j > 1 && content.includes("8-16")) content = content.replace(/8-16/i, '<span class="neon-blue-text">8-16</span>');
                    
                    // Ustawiamy flex-start dla techników, żeby tekst nie był ucięty na starcie
                    let alignment = (j < 2) ? "center" : "flex-start";
                    
                    html += `<td class="${(j===0)?'day':(j===1)?'date':'tech-data'}">
                                <div class="marquee-box" style="justify-content: ${alignment}"><span>${content}</span></div>
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
        // Resetujemy animację przed obliczeniem
        span.classList.remove('animate-scroll');
        
        if (span.offsetWidth > (box.offsetWidth - 10)) {
            // Tekst jest za długi - ustawiamy go do lewej i odpalamy scroll
            box.style.justifyContent = "flex-start";
            const distance = span.offsetWidth - box.offsetWidth + 40;
            span.style.setProperty('--scroll-dist', `-${distance}px`);
            span.classList.add('animate-scroll');
        } else {
            // Tekst jest krótki - centrujemy go ładnie
            box.style.justifyContent = "center";
        }
    });
}

// ... (reszta funkcji shortenDay, renderNav, updateClock - bez zmian) ...

function hideWeekends() {
    const rows = document.querySelectorAll("table tr");
    rows.forEach((row) => {
        const dayCell = row.querySelector(".day");
        if (dayCell) {
            const text = dayCell.innerText.trim().toLowerCase();
            // Obsługa różnych formatów (Android/iPhone)
            if (text === "sob" || text === "nd" || text === "sobota" || text === "niedziela") {
                row.classList.add("hidden-weekend");
            }
        }
    });
}

renderNav();
loadData();
setInterval(updateClock, 1000);
