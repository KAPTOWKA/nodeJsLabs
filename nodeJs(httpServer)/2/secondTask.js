const http = require("http");
const url = require("url");

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
    };

    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 200;
    
    response.end(`${x} ${operator} ${y} = ${responseOperation[operator]}`);
};

const server = http.createServer((request,response) => {

    switch (request.method){
        
        case "GET": {

            let queryString = url.parse(request.url, true);
            let queryParameters = url.parse(request.url, true).query;

            if(queryString.pathname == "/SUM"){
                generateResponseMathOperation(queryParameters, response, "+");
            }

            if(queryString.pathname == "/SUB"){
                generateResponseMathOperation(queryParameters, response, "-");
            }

            if(queryString.pathname == "/CONC"){
                generateResponseMathOperation(queryParameters, response, "concate");
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