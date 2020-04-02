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

const generateResponseMathOperation = (requestQuery, response, operator) => {
    
    const x = (requestQuery["x"]==null)? 0 : requestQuery["x"];
    const y = (requestQuery["y"]==null)? 0 : requestQuery["y"];

    const responseOperation = {
        "+" : +x + +y,
        "-" : +x - +y,
        "concate": x + y,
        "cancel": "CANCEL",
    };

    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 200;
    
    if(responseOperation[operator]==responseOperation.cancel){
        response.end(responseOperation[operator]);
    }

    response.end(`${x} ${operator} ${y} = ${responseOperation[operator]}`);
};

const server = http.createServer((request,response) => {

    switch (request.method){
        
        case "GET": {

            switch(request.url){

                case "/": {

                    const filePath = "./3/calcForm.html";

                    fs.access(filePath, fs.constants.R_OK, err => {
                        
                        if(err) {
                            console.log(`Error: ${err.message}`);
                            pageNotFound(response);
                        }

                        else {
                            fs.createReadStream(filePath).pipe(response);
                        }
                    });

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
                    let result = '';

                    request.on("data", (data) => {result += data;});
                    request.on("end", () => {
                        
                        let queryParams = qs.parse(result);
                        
                        generateResponseMathOperation(queryParams, response, queryParams["operator"]);
                    });

                    
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