const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const mp = require("multiparty");

const host = "127.0.0.1";
const port = 40001;

const pageNotFound = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 404;
    response.end("Page not found\n");
};


const server = http.createServer((request,response) => {

    switch (request.method){
        
        case "GET": {

            switch(request.url){

                case "/": {

                    const filePath = "./7/uploadForm.html";

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
                    let result = "";

                    let form = new mp.Form({uploadDir: "./7/data"});

                    form.on("field", (name,value) => {
                        if(value=="CANCEL"){
                            response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                            response.write("CANCEL");
                            response.end();
                            return;
                        }
                    });

                    form.on("error", (error) => {
                        console.log(error.message);
                    });

                    form.parse(request, error => {
                        response.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
                        response.write("Файл получен");
                        response.end();
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