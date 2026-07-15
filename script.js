console.log("Script loaded");

const ws = new WebSocket(CONFIG.WS_URL);

ws.onopen = () => {
    console.log("Connected to Deriv");
};

ws.onerror = (error) => {
    console.error("WebSocket Error:", error);
};

ws.onclose = () => {
    console.log("WebSocket Closed");
};
