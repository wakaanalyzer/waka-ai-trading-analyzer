// ===============================
// Deriv WebSocket Connection
// ===============================

const appId = CONFIG.APP_ID;
const ws = new WebSocket(CONFIG.WS_URL);

let currentSymbol = "R_10";

ws.onopen = () => {
    console.log("Connected to Deriv");

    ws.send(JSON.stringify({
        ticks: currentSymbol,
        subscribe: 1
    }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.tick) {
        const price = data.tick.quote;
        const digit = Number(price.toString().slice(-1));

        document.getElementById("price").textContent = price;
        document.getElementById("digit").textContent = digit;

        analyzeDigit(digit);
    }
};

ws.onerror = (err) => {
    console.log(err);
};

ws.onclose = () => {
    console.log("Disconnected");
};
// ===============================
// AI ANALYZER
// ===============================

const digitHistory = [];

function analyzeDigit(digit) {

    digitHistory.push(digit);

    if (digitHistory.length > 100) {
        digitHistory.shift();
    }

    // Count frequency
    const freq = Array(10).fill(0);

    digitHistory.forEach(d => freq[d]++);

    // Even / Odd
    const even = digitHistory.filter(d => d % 2 === 0).length;
    const odd = digitHistory.length - even;

    const evenPercent = Math.round((even / digitHistory.length) * 100);
    const oddPercent = 100 - evenPercent;

    // Find hottest digit
    const hottest = freq.indexOf(Math.max(...freq));

    // Simple AI recommendation
    let signal = "WAIT";
    let confidence = 50;

    if (evenPercent >= 60) {
        signal = "BUY";
        confidence = evenPercent;
    }

    if (oddPercent >= 60) {
        signal = "SELL";
        confidence = oddPercent;
    }

    // Update dashboard
    document.getElementById("signal").innerHTML = signal;
    document.getElementById("confidence").innerHTML =
        `Confidence ${confidence}%`;

    document.getElementById("evenBar").style.width =
        evenPercent + "%";

    document.getElementById("oddBar").style.width =
        oddPercent + "%";

    document.getElementById("evenBar").innerHTML =
        `Even ${evenPercent}%`;

    document.getElementById("oddBar").innerHTML =
        `Odd ${oddPercent}%`;

    console.log("Hot Digit:", hottest);
}
