const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const host = "127.0.0.1";
const port = 40001;

const pageNotFound = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 404;
    response.end("Page not found\n");
};

const server = http.createServer((request,response) => {

    switch (request.method){
    
        case "POST": {

            switch(request.url){

                case "/": {
                    let result = '';
                    
                    if(request.headers["content-type"] == "text/plain"){
                        request.on("data", (data) => {result += data;});
                        request.on("end", () => {
                                                    
                            response.setHeader("Content-Type", "text/plain");
                            response.statusCode = 200;
                            response.end(`Server: ${result}`);
                        });
                    }
                    else {
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