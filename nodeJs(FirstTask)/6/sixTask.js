const http = require("http");

let parseString = require("xml2js").parseString;
let xmlbuilder = require("xmlbuilder");


const host = "127.0.0.1";
const port = 40001;

const pageNotFound = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 404;
    response.end("Page not found\n");
};

const pageNotAllowed = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 405;
    response.end("Method Not Allowed\n");
};

const server = http.createServer((request,response) => {

    switch (request.method){
    
        case "POST": {

            switch(request.url){

                case "/": {
                    let xmltxt = "";
                    if(request.headers["content-type"] == "application/xml") {
                        request.on("data" , (data) => {
                            xmltxt += data;
                        });

                        request.on("end", () => {
                            parseString(xmltxt, (error, result) => {
                                if (error) {
                                    console.log(`Error: ${error}`);
                                    pageNotAllowed(response);
                                }
                                else {
                                    response.setHeader("Content-Type", "application/xml");
                                    response.statusCode = 200;
                                    response.end(`<SERVER> ${xmltxt} </SERVER`);
                                }
                            });
                        });
                    }
                    else{
                        pageNotFound(response);
                    }
                    
                    break;
                }

                default: {
                    pageNotFound(response);
                    break;
                }
            }
            
            break;
        }

        default: {
            pageNotFound(response);
            break;
        }
    }
});


server.listen(port, host, ()=> console.log(`Server listening at port ${port}, host ${host}`));