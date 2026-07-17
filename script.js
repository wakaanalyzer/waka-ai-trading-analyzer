// ================================
// Waka AI Trading Analyzer
// Part 1 - WebSocket Engine
// ================================

const ws = new WebSocket(CONFIG.WS_URL);

let connected = false;
let selectedMarket = "R_10";
let tickHistory = [];

const connectBtn = document.getElementById("connectBtn");
const marketSelect = document.getElementById("marketSelect");

const currentDigit = document.getElementById("currentDigit");
const currentPrice = document.getElementById("currentPrice");

function connectMarket() {

    if (connected) return;

    ws.onopen = () => {

        console.log("Connected");

        connected = true;

        connectBtn.innerHTML = "Connected";

        subscribeTicks(selectedMarket);

    };

    ws.onmessage = (msg) => {

        const data = JSON.parse(msg.data);

        if (data.error) {

            console.log(data.error);

            return;

        }

        if (data.tick) {

            processTick(data.tick);

        }

    };

    ws.onerror = (err) => {

        console.log(err);

    };

    ws.onclose = () => {

        connected = false;

        connectBtn.innerHTML = "Reconnect";

        setTimeout(() => {

            connectMarket();

        },3000);

    };

}

function subscribeTicks(symbol){

    ws.send(JSON.stringify({

        ticks:symbol,

        subscribe:1

    }));

}

function processTick(tick){

    const price = Number(tick.quote).toFixed(2);

    const digit = price.slice(-1);

    currentDigit.innerHTML = digit;

    currentPrice.innerHTML = price;

    tickHistory.push(Number(digit));

    if(tickHistory.length>100){

        tickHistory.shift();

    }

    updateAnalyzer();

}

marketSelect.addEventListener("change",()=>{

    selectedMarket = marketSelect.value;

});

connectBtn.addEventListener("click",()=>{

    connectMarket();

});

function updateAnalyzer(){

    // Part 2

}
