const http = require("http");
const fs = require("fs");

const host = "127.0.0.1";
const port = 40001;


let isStatic = (ext, fn) => {
    let reg = new RegExp(`^\/.+\.${ext}$`);
    return reg.test(fn);
};

let pathStatic = (fn) => {
    return `./9/app/${fn}`;
};

let pageNotFound = (res) =>{
    res.statusCode = 404;
    res.statusMessage = "Resourse not found";
    res.end("resourse not found");
};

let pipeFile = (req, res, headers) => {
    res.writeHead(200, headers);
    fs.createReadStream(pathStatic(req.url)).pipe(res);
}

let sendFile = (req, res, headers) => {
    fs.access(pathStatic(req.url), fs.constants.R_OK, err => {
        if(err) pageNotFound(res);
        else pipeFile(req, res,headers);
    })
};

let http_handler = (req, res) => {
    console.log(req.url);

    
    if (isStatic("html", req.url)) sendFile(req, res, {"Content-Type": "text/html; charset=utf-8"});
    else if (isStatic("css", req.url)) sendFile(req, res, {"Content-Type": "text/css; charset=utf-8"});
    else if (isStatic("js", req.url)) sendFile(req, res, {"Content-Type": "text/javascript; charset=utf-8"});
    else pageNotFound(res);
};

let server = http.createServer();

server.listen(port, host, ()=> console.log(`Server listening at port ${port}, host ${host}`))
    .on("request", http_handler);