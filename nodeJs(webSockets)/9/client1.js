const rpcWSC = WebSocket = require("rpc-websockets").Client;
let ws = new rpcWSC("ws://localhost:4000");

let k = 0;

let timerMsg;

ws.on("open", () => {
    timerMsg=setInterval(()=>ws.notify("notify1", {counter:k++}),1000);

    setTimeout(()=>{
        clearInterval(timerMsg);
    }, 10000);
});