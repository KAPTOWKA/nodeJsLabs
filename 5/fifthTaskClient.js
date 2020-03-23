const http = require("http");
const query = require("querystring");

const options = {
    host: "127.0.0.1",
    path: "/",
    port: 40001,
    method: "POST",
    headers: {"Content-Type": "application/json"}
};

const request = http.request(options, (response) =>{
    let result = "";
    response.on("data", (chunk) =>{
        result += chunk;
    });
    response.on("end", () =>{
        let a = JSON.parse(result);
        for (let item in a){
            console.log(a[item]);
        }
    });
});

request.on("error", (err) => {
    console.log(`Error: ${err.message}`);
});

request.write(`{
    "squadName": "Super hero squad",
    "homeTown": "Metro City",
    "formed": 2016,
    "secretBase": "Super tower",
    "active": true,
    "members": [
      {
        "name": "Molecule Man",
        "age": 29,
        "secretIdentity": "Dan Jukes",
        "powers": [
          "Radiation resistance",
          "Turning tiny",
          "Radiation blast"
        ]
      },
      {
        "name": "Madame Uppercut",
        "age": 39,
        "secretIdentity": "Jane Wilson",
        "powers": [
          "Million tonne punch",
          "Damage resistance",
          "Superhuman reflexes"
        ]
      },
      {
        "name": "Eternal Flame",
        "age": 1000000,
        "secretIdentity": "Unknown",
        "powers": [
          "Immortality",
          "Heat Immunity",
          "Inferno",
          "Teleportation",
          "Interdimensional travel"
        ]
      }
    ]
  }`);

request.end();