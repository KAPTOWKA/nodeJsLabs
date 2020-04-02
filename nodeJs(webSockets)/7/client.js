const rpcWSC = WebSocket = require("rpc-websockets").Client;

let clientLogin = process.argv[2];
let clientPassword = process.argv[3];


let ws = new rpcWSC("ws://localhost:4000");

ws.on("open", ()=>{
    ws.call("sum", [5,3]).then((result) => {
        console.log(`Sum: ${result}`);
    });

    ws.call("mul", [5,5,5]).then((result) => {
        console.log(`mul: ${result}`);
    });

    ws.login({
        login: clientLogin,
        password: clientPassword,
    }).then((login) =>{
        if(login){
            ws.call("conc", ["pasha ","made ","this "]).then((result) => {
                console.log(`conc: ${result}`);
            });
        }
        else {
            console.log("Login error");
        }
    })
});

ws.on("error" , (err) => {
    console.log(`err: ${err}`);
});

