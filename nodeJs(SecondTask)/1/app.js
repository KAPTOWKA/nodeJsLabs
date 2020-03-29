const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");

const httpPort = 3000;
const httpHost = "127.0.0.1";

const webSocketPort = 4000;
const webSocketHost = "127.0.0.1";


const pageNotFound = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 404;
    response.end("Page not found\n");
};


const httpServer = http.createServer((request, response) => {
    if ( request.method == "GET" && request.url =="/") {
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8"});
        response.end(fs.readFileSync("./1/index/index.html"));
    }
    else {
        pageNotFound(response);
    }
});

httpServer.listen(httpPort, httpHost, ()=> console.log(`Server listening at port ${httpPort}, host ${httpHost}`));



let counter = 0;

const webSocketServer = new WebSocket.Server({
    port: webSocketPort,
    host: webSocketHost,
    path: "/wsserver",
});

webSocketServer.on("connection", (ws) => {
    ws.on("message", message => {
        console.log(`Received msg: ${message}\n`);
    });

    setInterval(()=>{
        ws.send(`server: ${++counter}`);
    }, 3000);
});


webSocketServer.on("error", (error) => {
    console.log("ws server error", error);
});

console.log(`ws server: host: ${webSocketServer.options.host}, port: ${webSocketServer.options.port}, path: ${webSocketServer.options.path}`);