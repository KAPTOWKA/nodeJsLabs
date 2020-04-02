const http = require("http");
const fs = require("fs");


const host = "127.0.0.1";
const port = 40001;

const pageNotFound = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 404;
    response.end("Page not found\n");
};

let pathStatic = (fn) => {
    return `./8/${fn}`;
}

// http://localhost:40001/download/asdasd.txt - пример запроса на скачивание текстового файла
//http://localhost:40001/download/11.png - на картинку

let pipeFile = (req, res, headers) => {
    res.writeHead(200, headers);
    fs.createReadStream(pathStatic(req.url)).pipe(res);
};

let sendFile = (req, res, headers) => {
    fs.access(pathStatic(req.url), fs.constants.R_OK, err =>{
        if (err) {pageNotFound(res);
            console.log(err.message);
        }
        else pipeFile(req, res, headers);
    });
};

let httpHandler = (req, res) => {
    sendFile(req, res, {"Content-Type" : "application/octet-stream"});
};

const server = http.createServer();

server.listen(port, host, ()=> console.log(`Server listening at port ${port}, host ${host}`))
    .on("request", httpHandler);