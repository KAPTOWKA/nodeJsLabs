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

const generateSuccessResponse = (requestMethod, requestURL, response) => {
    response.setHeader("Content-type", "text/plain");
    response.statusCode = 200;
    response.end(`${requestMethod} : ${requestURL}`);
};

const server = http.createServer((request,response) => {

    switch (request.method){
    
        case "GET": {

            switch(request.url){

                case "/": {
                    generateSuccessResponse(request.method, request.url, response);
                    break;
                }

                case "/A":{
                    generateSuccessResponse(request.method, request.url, response);
                    break;
                }

                case "/A/B":{
                    generateSuccessResponse(request.method, request.url, response);
                    break;
                }

                default: {
                    pageNotFound(response);
                    break;
                }
            }

            break;
        }

        case "POST": {

            switch(request.url){

                case "/": {
                    generateSuccessResponse(request.method, request.url, response);
                    break;
                }

                case "/C":{
                    generateSuccessResponse(request.method, request.url, response);
                    break;
                }

                case "/C/D":{
                    generateSuccessResponse(request.method, request.url, response);
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