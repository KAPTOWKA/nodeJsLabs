const rpcWSC = require("rpc-websockets").Client;

let ws = new rpcWSC("ws://localhost:4000");

ws.on("open", ()=>{
    ws.subscribe("ChangedBackupFiles");
    ws.on("ChangedBackupFiles", (p) => {
        console.log(p);
    });
});