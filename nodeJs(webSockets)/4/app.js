const WebSocket = require("ws");

const wss = new WebSocket.Server({
    port: 4000,
    host: "127.0.0.1",
});

wss.on("connection", (ws) => {

    let clientObj;
    let isCorrectMsg = true;

    ws.on("message", (data) => {
        clientObj = JSON.parse(data);
        if(clientObj.hasOwnProperty("x") && clientObj.hasOwnProperty("y") && !isNaN(+clientObj.x) && !isNaN(+clientObj.y)){
            clientObj.z=clientObj.x+clientObj.y;
            ws.send(JSON.stringify({clientObj}));
        }
        else {
            clientObj=null;
            ws.send("ERROR: U need use obj with 2 properties: X(NUMBER) and Y(NUMBER)");
        }
    })
});