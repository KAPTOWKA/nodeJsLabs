const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:4000/wsserver");

const duplex = WebSocket.createWebSocketStream(ws);

duplex.pipe(process.stdout);

process.stdin.pipe(duplex);