const http = require("http");
const query = require("querystring");

const options = {
    host: "127.0.0.1",
    path: "/",
    port: 40001,
    method: "POST",
    headers: {"Content-Type": "text/plain"}
};

const request = http.request(options, (response) => {
    let result = "";
    response.on("data", (chunk) => {
        result += chunk;
    });
    response.on("end", () => {
        console.log(result);
    });
});

request.on("error", (err) => {
    console.log(`Error: ${err.message}`);
});

request.write("V.V. Smelov => P.O. Yaskuts");

request.end();