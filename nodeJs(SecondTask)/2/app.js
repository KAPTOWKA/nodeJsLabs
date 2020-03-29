const http = require("http");
const fs = require("fs");
const WebSocket = require("ws");
const uuid = require("uuid");

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
        response.end(fs.readFileSync("./2/index/index.html"));
    }
    else {
        pageNotFound(response);
    }
});

httpServer.listen(httpPort, httpHost, ()=> console.log(`Server listening at port ${httpPort}, host ${httpHost}`));




const webSocketServer = new WebSocket.Server({
    port: webSocketPort,
    host: webSocketHost,
    path: "/wsserver",
});

webSocketServer.on("connection", (ws) => {
    ws.id = uuid.v4();
    let clientList = "Active clients:\n";

    ws.on("message", message => {
        if(Buffer.isBuffer(message)){
            message=ws.id+ "||"+message.toString("utf-8");
        }

        if(message.startsWith("clientID")){
            ws.id=message.slice(9);
        }
        else{
            webSocketServer.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN){
                    client.send("client: " + message);
                }
            });
        }
    });

    ws.on("pong", (data)=>{
        console.log(`client with key ${data} is enabled (PING/PONG)`);
    });

    setInterval(()=>{
        webSocketServer.clients.forEach((client) =>{
            clientList+=client.id+"\n";

            ws.ping(client.id);
        });
        webSocketServer.clients.forEach((client) =>{
            client.send(clientList);
        });
        clientList="Active clients:\n";
    }, 5000);
});


webSocketServer.on("error", (error) => {
    console.log("ws server error", error);
});

console.log(`ws server: host: ${webSocketServer.options.host}, port: ${webSocketServer.options.port}, path: ${webSocketServer.options.path}`);