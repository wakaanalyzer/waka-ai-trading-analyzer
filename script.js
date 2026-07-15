// ===== Waka AI Trading Analyzer =====

const priceEl = document.getElementById("price");
const digitEl = document.getElementById("digit");
const signalEl = document.getElementById("signal");
const confidenceEl = document.getElementById("confidence");
const evenBar = document.getElementById("evenBar");
const oddBar = document.getElementById("oddBar");
const riskEl = document.getElementById("risk");
const directionEl = document.getElementById("direction");
const historyEl = document.getElementById("history");
const notesEl = document.getElementById("notes");

const digits = Array(10).fill(0);
const history = [];

// Chart
const chart = new Chart(document.getElementById("digitChart"), {
    type: "bar",
    data: {
        labels: ["0","1","2","3","4","5","6","7","8","9"],
        datasets: [{
            label: "Digit Frequency",
            data: digits
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

function updateHistory(){
    historyEl.innerHTML = "";

    history.slice(-20).forEach(d=>{
        const span = document.createElement("span");
        span.textContent = d;
        historyEl.appendChild(span);
    });
}

function updateBars(){

    let even=0;
    let odd=0;

    history.forEach(n=>{
        if(n%2===0) even++;
        else odd++;
    });

    const total=Math.max(history.length,1);

    const evenPercent=Math.round((even/total)*100);
    const oddPercent=Math.round((odd/total)*100);

    evenBar.style.width=evenPercent+"%";
    evenBar.innerHTML="Even "+evenPercent+"%";

    oddBar.style.width=oddPercent+"%";
    oddBar.innerHTML="Odd "+oddPercent+"%";
}

function aiDecision(lastDigit){

    let signal="WAIT";
    let confidence=50;
    let risk="LOW";
    let direction="WAIT";

    if(lastDigit<=2){
        signal="BUY";
        confidence=82;
        direction="BUY";
        risk="LOW";
    }

    if(lastDigit>=7){
        signal="SELL";
        confidence=84;
        direction="SELL";
        risk="MEDIUM";
    }

    if(lastDigit===5){
        signal="WAIT";
        confidence=60;
        direction="WAIT";
        risk="LOW";
    }

    signalEl.textContent=signal;
    confidenceEl.textContent="Confidence "+confidence+"%";
    directionEl.textContent=direction;
    riskEl.textContent=risk;

    notesEl.innerHTML=
`
<li>Last Digit: ${lastDigit}</li>
<li>AI Recommendation: ${signal}</li>
<li>Confidence: ${confidence}%</li>
<li>Risk: ${risk}</li>
`;
}

function update(){

    const price=(100000+Math.random()*900000).toFixed(2);

    const digit=parseInt(price.slice(-1));

    priceEl.textContent=price;
    digitEl.textContent=digit;

    digits[digit]++;

    chart.data.datasets[0].data=digits;
    chart.update();

    history.push(digit);

    if(history.length>100)
        history.shift();

    updateHistory();

    updateBars();

    aiDecision(digit);

}

setInterval(update,1000);

update();
