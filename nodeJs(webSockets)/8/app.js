const rpcWSS = require("rpc-websockets").Server;
const readline = require('readline');



let server = new rpcWSS({
    port: 4000,
    host: "127.0.0.1",
});

server.event("AAA");
server.event("BBB");
server.event("CCC");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  if(input=="AAA"){
    server.emit("AAA", {eventName: input});
  }
  else if(input=="BBB"){
    server.emit("BBB", {eventName: input});
  }
  else if(input=="CCC"){
    server.emit("CCC", {eventName: input});
  }
  else {
    console.log("NO SUCH EVENT");
  }
});
