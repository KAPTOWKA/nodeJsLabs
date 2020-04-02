const rpcWSS = require("rpc-websockets").Server;

const server = new rpcWSS({
    port: 4000,
    host: "localhost",
});

server.setAuth((account) => {
    return (account.login == "admin" && account.password == "123");
});

server.register("sum", (params) => {
    return params[0]+params[1];
}).public();

server.register("mul", (params) => {
    return params.reduce((mul, current) =>mul*current, 1);
}).public();

server.register("conc", (params) => {
    return params[0].toString()+params[1].toString()+params[2].toString();
}).protected();