const http = require("http");
const fs = require("fs");
const url = require("url");
const qs = require("querystring");

const rpcWSS = require("rpc-websockets").Server;

const host = "127.0.0.1";
const port = 3000;

const pageNotFound = (response) => {
    response.setHeader("Content-Type", "text/plain");
    response.statusCode = 404;
    response.end("Page not found\n");
};

const sendStudentList = (response) => {
    response.setHeader("Content-type", "application/json");
    response.statusCode = 200;

    fs.readFile("./data/studentList.json", (error,data) => {
        if (error){
            console.log(`Error: ${error}`);
        }
        else{
            response.end(data);
        }
    });
};

const sendCurrentStudent = (id,response) => {
    response.setHeader("Content-type", "application/json");
    response.statusCode = 200;

    fs.readFile("./data/studentList.json", (error,data) => {
        if (error){
            console.log(`Error: ${error}`);
        }
        else{
            let studentList = JSON.parse(data);
            let currentStudent = null;

            for(let position = 0; position < studentList.length; position++){
                if (studentList[position].id == id){
                    currentStudent = position;
                }
            }

            if(currentStudent!=null){
                response.end(JSON.stringify(studentList[currentStudent])); 
            }
            else{
                let errorMsg = {
                    error: 1,
                    message: `Student with id = ${id} not exist`,
                };
                response.end(JSON.stringify(errorMsg)); 
            }
        }
    });
};

const addNewStudent = (result, response) => {
    response.setHeader("Content-type", "application/json");
    response.statusCode = 200;

    let userObj = JSON.parse(result);
    let studentList;
    let isErrorResponse=false;

    const writeFile = () => {
        fs.writeFile("./data/studentList.json", JSON.stringify(studentList), (error) =>{
            if(error) {
                console.log(`Error: ${error}`);
            }
            else{
                response.end(result);
            }
        })
    };

    fs.readFile("./data/studentList.json", (error,data) => {
        if (error){
            console.log(`Error: ${error}`);
        }
        else{
            studentList=JSON.parse(data);

            for(let position = 0; position < studentList.length; position++){
                if (studentList[position].id == userObj.id){
                    isErrorResponse=true;
                }
            }

            if(isErrorResponse){
                let errorMsg = {
                    error: 2,
                    message: `Student with id = ${userObj.id} already exist`,
                };
                response.end(JSON.stringify(errorMsg));
            }
            else{
                studentList[studentList.length]=userObj;
                writeFile();
            }
        }
    });

};

const changeStudent = (result, response) => {
    response.setHeader("Content-type", "application/json");
    response.statusCode = 200;

    let userObj = JSON.parse(result);
    let studentList;
    let isErrorResponse=true;
    let currentStudent;

    const writeFile = () => {
        fs.writeFile("./data/studentList.json", JSON.stringify(studentList), (error) =>{
            if(error) {
                console.log(`Error: ${error}`);
            }
            else{
                response.end(result);
            }
        })
    };

    fs.readFile("./data/studentList.json", (error,data) => {
        if (error){
            console.log(`Error: ${error}`);
        }
        else{
            studentList=JSON.parse(data);

            for(let position = 0; position < studentList.length; position++){
                if (studentList[position].id == userObj.id){
                    isErrorResponse=false;
                    currentStudent = position;
                }
            }

            if(isErrorResponse){
                let errorMsg = {
                    error: 3,
                    message: `Student with id = ${userObj.id} not found`,
                };
                response.end(JSON.stringify(errorMsg));
            }
            else{
                studentList[currentStudent]=userObj;
                writeFile();
            }
        }
    });

};

const deleteStudent = (id,response) => {
    response.setHeader("Content-type", "application/json");
    response.statusCode = 200;
    let deletedStudent = null;
    let studentList;

    const writeFile = () => {
        fs.writeFile("./data/studentList.json", JSON.stringify(studentList), (error) =>{
            if(error) {
                console.log(`Error: ${error}`);
            }
            else{
                response.end(JSON.stringify(deletedStudent));
            }
        })
    };

    fs.readFile("./data/studentList.json", (error,data) => {
        if (error){
            console.log(`Error: ${error}`);
        }
        else{

            studentList = JSON.parse(data);
            let currentStudent = null;

            for(let position = 0; position < studentList.length; position++){
                if (studentList[position].id == id){
                    currentStudent = position;
                }
            }

            if(currentStudent!=null){
                deletedStudent = studentList.splice(currentStudent,1);
                writeFile();
            }
            else{
                let errorMsg = {
                    error: 1,
                    message: `Student with id = ${id} not exist`,
                };
                response.end(JSON.stringify(errorMsg)); 
            }
        }
    });
};

const createBackup = (response) =>{

    const currentDate = new Date();

    const YYYY = currentDate.getFullYear();
    let MMonth = currentDate.getMonth()+1;

    if (MMonth < 10){
        MMonth = "0" + MMonth;
    }
    const DD = currentDate.getDate();
    const SS = currentDate.getSeconds();
    const HH = currentDate.getHours();
    const MMinutes = currentDate.getMinutes();

    const backupFileName="./data/"+YYYY+MMonth+DD+HH+MMinutes+SS+"_studentList.json";

    fs.copyFile("./data/studentList.json", backupFileName,(error) => {
        if (error){
            console.log(`Error: ${error}`);
        }
        else{
            serverRPC.emit("ChangedBackupFiles", {eventName: `Backup file ${backupFileName} created`});

            response.end(`Backup file ${backupFileName} created`);
        }
    });
};

const showBackupFiles = (response) => {

    let filePlaceHolder= [];
    fs.readdir(`./data/`, (error, items) => {
        if (error) {
            console.log(error);
            let errorMsg = {
                error: error,
                message: error.message
            };
            response.end(JSON.stringify(errorMsg));
        }
        else{
            for (let i=0; i<items.length; i++) {

                if (items[i].toString().includes("_")){
    
                    filePlaceHolder[i]=items[i];
                }
            }
            response.end(JSON.stringify(filePlaceHolder));
        }
    });  

};

const deteleBackupFiles = (date, response) => {
    
    let deleteCounter = 0;
    let nameFileplaceHolder;
    let queryStringPlaceHolder ={
        YYYY: date.slice(0,4),
        MM: date.slice(6,8),
        DD: date.slice(4,6)
    };
    fs.readdir(`./data/`, function(error, items) {
        if (error) {
            console.log(error);
            let errorMsg = {
                error: error,
                message: error.message
            };
            response.end(JSON.stringify(errorMsg));
        }
        else {
            for (let i=0; i<items.length; i++) {
                if (items[i].toString().includes("_")){
                    // we have 2 dates: first[NAMEFILE] in format; YYYYMMDD(items[i]) and second[queryString] in format: YYYYDDMM(date)
                    // compare YYYY[NameFile] and YYYYY[QUERYSTRING]
                    nameFileplaceHolder ={
                        YYYY: items[i].toString().slice(0,4),
                        MM: items[i].toString().slice(4,6),
                        DD: items[i].toString().slice(6,8)
                    };
    
                    if (nameFileplaceHolder.YYYY > queryStringPlaceHolder.YYYY){
                        deleteFile(items[i]);
                        deleteCounter++;
                    }
                    // if YYYY[NameFile] == YYYYY[QUERYSTRING]
                    else if (nameFileplaceHolder.YYYY == queryStringPlaceHolder.YYYY){
                        // if MM[NameFile] > MM[QUERYSTRING]
                        if (nameFileplaceHolder.MM > queryStringPlaceHolder.MM){
                            deleteFile(items[i]);
                            deleteCounter++;
                        }
                        // if MM[NameFile] == MM[QUERYSTRING]
                        else if (nameFileplaceHolder.MM == queryStringPlaceHolder.MM){
                            // if DD[NameFile] > DD[QUERYSTRING]
                            if (nameFileplaceHolder.DD > queryStringPlaceHolder.DD){
                                deleteFile(items[i]);
                                deleteCounter++;
                            }
                        }
                    }
                }
            }
            if (deleteCounter>0){
                serverRPC.emit("ChangedBackupFiles", {eventName: `${deleteCounter} Backup files was deleted`});
            }
            response.end(`number of deleted files: ${deleteCounter}`)
        }
    });

    const deleteFile = (fileName) =>{
        fs.unlink(`./data/${fileName}`, (error) => {
            if(error){
                console.log(error);
            }
        });
    }
};

const server = http.createServer((request,response) => {

    switch (request.method){
    
        case "GET": {

            switch(request.url){

                case "/backup": {
                    showBackupFiles(response);
                    break;
                }

                default: {
                    let id = request.url.slice(1);

                    if (id == ""){
                        sendStudentList(response);
                        break;
                    }
                    else if (!isNaN(id)){
                        sendCurrentStudent(id, response);
                        break;
                    }
                    else{
                        pageNotFound(response);
                        break;
                    }

                }
            }

            break;
        }

        case "POST": {

            switch(request.url){

                case "/": {
                    let result = "";
                    request.on("data", (data) => {
                        result+=data;
                    });

                    request.on("end", () =>{
                        addNewStudent(result, response);
                    })

                    break;
                }

                case "/backup": {

                    createBackup(response);
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

                case "/": {
                    let result = "";
                    request.on("data", (data) => {
                        result+=data;
                    });

                    request.on("end", () =>{
                        changeStudent(result, response);
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

            if (request.url.startsWith("/backup/")){
                let date = request.url.slice(8);

                if (date == "" || date.length!=8){
                    pageNotFound(response);
                    break;
                }

                else if(!isNaN(date)){
                    deteleBackupFiles(date, response);
                    break;
                }
                else {
                    pageNotFound(response);
                    break;
                }
            }

            let id = request.url.slice(1);

            if (id == ""){
                pageNotFound(response);
                break;
            }
            else if (!isNaN(id)){
                deleteStudent(id, response);
                break;
            }
            else{
                pageNotFound(response);
                break;
            }
        
        }

        default: {
            pageNotFound(response);
            break;
        }
    }
});


let serverRPC = new rpcWSS({
    port: 4000,
    host: "127.0.0.1",
});

serverRPC.event("ChangedBackupFiles");


server.listen(port, host, ()=> console.log(`Server listening at port ${port}, host ${host}`));