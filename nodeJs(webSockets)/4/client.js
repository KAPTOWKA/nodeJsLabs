const WebSocket = require("ws");

const ws = new WebSocket("ws://127.0.0.1:4000");

ws.on("open", ()=>{

    let msgInterval;
    ws.on("message", data => {
        console.log(JSON.parse(data));
    });


    msgInterval = setInterval(() => {
        let firstValue = Math.floor(Math.random() * 1000) + 1;
        let secondValue = Math.floor(Math.random() * 1000) + 1;

        ws.send(JSON.stringify({
            x: firstValue,
            y: secondValue,
        }));
    }, 500);

    setTimeout(()=>{
        clearInterval(msgInterval);
    }, 10000);

    setTimeout(()=>{
        ws.close();
    }, 20000);
});