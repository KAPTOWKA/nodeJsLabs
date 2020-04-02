const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const sql = require("mssql");


const host = "127.0.0.1";
const port = 3000;

const config = {
    user: "sa",
    password: "123",
    server: "DESKTOP-GI9K8HF",
    database: "YPO",
    pool: {
        max: 10,
        min: 0
    },
    options: {
        enableArithAbort: true
    }
}

const pool = new sql.ConnectionPool(config, (error) => {
    if (error) {
        console.log(`Error connection with DataBase: ${error.message}, ${error.code}`);
    }
    else {
        console.log(`Successful connected to the database`);
    }
});


const pageNotFound = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 404;
    response.end("Page not found\n");
};

const getStaticHtmlFile = (response) => {
    response.setHeader("Content-Type", "text/html");
    response.statusCode = 200;
    response.end(fs.readFileSync("./index/index.html"));
};

const serverError = (response, errorMsg) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 405 ;
    response.end(JSON.stringify(errorMsg));
};

const sendData = (response, data) => {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    response.end(JSON.stringify(data));
}


const sendSelectQuery = (response, table) => {
    pool.query(`SELECT * FROM ${table}`, (error, result) => {
        if (error){
            let errorMsg = {
                code: error.code,
                message: error.message
            }
            serverError(response, errorMsg);
        }
        else {
            sendData(response, result.recordset);
        }
    });
};


const sendInsertQuery = (response, table, data) => {
    let placeHolder = "(";

    for (let key in data) {
        if (isNaN(+data[key])){
            placeHolder += `'${data[key]}',`;
        }
        else{
            placeHolder+=`${data[key]},`;
        }
    }
    placeHolder = placeHolder.substring(0, placeHolder.length-1) + ")";

    pool.query(`INSERT INTO ${table} VALUES ${placeHolder}`, (error, result) => {
        if (error){
            let errorMsg = {
                code: error.code,
                message: error.message
            }
            serverError(response, errorMsg);
        }
        else {
            sendData(response, data);
        }
    });
};

const sendUpdateQuery = (response, table, data) => {
    let placeHolder = "";
    const firstPropertyKey = Object.keys(data)[0];
    for (let key in data) {
        placeHolder += key;

        if (isNaN(+data[key])){
            placeHolder += `='${data[key]}',`;
        }
        else{
            placeHolder+=`=${data[key]},`;
        }
    }
    
    placeHolder = placeHolder.substring(0, placeHolder.length-1);

    pool.query(`UPDATE ${table} SET ${placeHolder} WHERE ${firstPropertyKey} = '${data[firstPropertyKey]}' `,(error, result) => {
        if (error){
            let errorMsg = {
                code: error.code,
                message: error.message
            }
            serverError(response, errorMsg);
        }
        else {
            sendData(response, data);
        }
    });
};

const sendDeleteQuery = (response, table) => {
    let showVarAsResult;

    pool.query(`SELECT * FROM ${table.name} WHERE ${table.name}='${table.requestParam}'`, (error, result) => {
        if (error){
            let errorMsg = {
                code: error.code,
                message: error.message
            }
            serverError(response, errorMsg);
        }
        else {
            showVarAsResult = result.recordset;
        }
    });
    pool.query(`DELETE FROM ${table.name} WHERE ${table.name}='${table.requestParam}'`, (error, result) => {
        if (error){
            let errorMsg = {
                code: error.code,
                message: error.message
            }
            serverError(response, errorMsg);
        }
        else {
            sendData(response, showVarAsResult);
        }
    });
};

const server = http.createServer((request,response) => {

    switch (request.method){
    
        case "GET": {

            switch(request.url){

                case "/": {
                    getStaticHtmlFile(response);
                    break;
                }
                
                case "/api/faculties":{
                    sendSelectQuery(response,"FACULTY");
                    break;
                }

                case "/api/pulpits":{
                    sendSelectQuery(response,"PULPIT");
                    break;
                }

                case "/api/subjects":{
                    sendSelectQuery(response,"SUBJECT");
                    break;
                }

                case "/api/auditoriumstypes":{
                    sendSelectQuery(response,"AUDITORIUM_TYPE");
                    break;
                }

                case "/api/auditoriums":{
                    sendSelectQuery(response,"AUDITORIUM");
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

                case "/api/faculties": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendInsertQuery(response, "FACULTY", JSON.parse(result));
                    })

                    break;
                }

                case "/api/pulpits": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendInsertQuery(response, "PULPIT", JSON.parse(result));
                    })

                    break;
                }

                case "/api/subjects": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendInsertQuery(response, "SUBJECT", JSON.parse(result));
                    })

                    break;
                }

                case "/api/auditoriumstypes": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendInsertQuery(response, "AUDITORIUM_TYPE", JSON.parse(result));
                    })

                    break;
                }

                case "/api/auditoriums": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendInsertQuery(response, "AUDITORIUM", JSON.parse(result));
                    })

                    break;
                }

                default: {
                
                    pageNotFound(response);
                    break;
                    
                }
            }
            
            break;
        }

        case "PUT": {

            switch(request.url){

                case "/api/faculties": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendUpdateQuery(response, "FACULTY", JSON.parse(result));
                    })

                    break;
                }

                case "/api/pulpits": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendUpdateQuery(response, "PULPIT", JSON.parse(result));
                    })

                    break;
                }

                case "/api/subjects": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendUpdateQuery(response, "SUBJECT", JSON.parse(result));
                    })

                    break;
                }

                case "/api/auditoriumstypes": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendUpdateQuery(response, "AUDITORIUM_TYPE", JSON.parse(result));
                    })

                    break;
                }

                case "/api/auditoriums": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        sendUpdateQuery(response, "AUDITORIUM", JSON.parse(result));
                    })

                    break;
                }

                default: {
                
                    pageNotFound(response);
                    break;
                    
                }
            }
            
            break;
        }

        case "DELETE": {
            if (decodeURI(request.url).startsWith("/api/faculties/")){
                let table ={
                    requestParam: decodeURI(request.url).slice(15),
                    name: "FACULTY"
                }
                sendDeleteQuery(response, table);
                break;
            }
            
            if (decodeURI(request.url).startsWith("/api/pulpits/")){
                let table ={
                    requestParam: decodeURI(request.url).slice(13),
                    name: "PULPIT"
                }
                sendDeleteQuery(response, table);
                break;
            }

            if (decodeURI(request.url).startsWith("/api/subjects/")){
                let table ={
                    requestParam: decodeURI(request.url).slice(14),
                    name: "SUBJECT"
                }
                sendDeleteQuery(response, table);
                break;
            }

            if (decodeURI(request.url).startsWith("/api/auditoriumstypes/")){
                let table ={
                    requestParam: decodeURI(request.url).slice(22),
                    name: "AUDITORIUM_TYPE"
                }
                sendDeleteQuery(response, table);
                break;
            }

            if (decodeURI(request.url).startsWith("/api/auditoriums/")){
                let table ={
                    requestParam: decodeURI(request.url).slice(17),
                    name: "AUDITORIUM"
                }
                sendDeleteQuery(response, table);
                break;
            }

            pageNotFound(response);
            break;
        }

        default: {
            pageNotFound(response);
            break;
        }
    }
});


server.listen(port, host, ()=> console.log(`Server listening at port ${port}, host ${host}`));


process.on('uncaughtException', function (err) {
    console.log(err);
}); 