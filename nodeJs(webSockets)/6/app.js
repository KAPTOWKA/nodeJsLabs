const WebSocket = require("ws");

const fs = require("fs");

const wss = new WebSocket.Server({
    port: 4000,
    host: "127.0.0.1",
});

wss.on("connection", (ws) => {
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: "utf8"});

    let rfile = fs.createReadStream("./6/MyFile.txt");
    rfile.pipe(duplex);
});