const WebSocket = require("ws");
const uuid = require("uuid");

let clientID = process.argv[2];

if(typeof clientID == "undefined"){
    clientID = uuid.v4();
}

const ws = new WebSocket(`ws://127.0.0.1:4000/wsserver`);


ws.on("open", ()=>{

    ws.send(`clientID:${clientID}`);

    setInterval(()=>{
        ws.send(`${clientID}|| hello its a test msg 1 in 20 sec`);
    }, 20000)

    ws.on("message", message => {
        if(message.startsWith("client")){
            console.log("Received msg:" + message);
        }
    });
});