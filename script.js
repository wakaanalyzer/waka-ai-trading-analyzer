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

pat_1af63eb1c7c8018d73425b95f1c2d5784a43a02f034499670f451096bfb68847
