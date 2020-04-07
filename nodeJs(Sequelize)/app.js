const Sequelize = require("sequelize");
const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const sequelize = new Sequelize("YPO", "sa", "123", {
    host: "localhost",
    dialect: "mssql",
});

const Model = Sequelize.Model;

class Faculty extends Model{};

class Pulpit extends Model {};

class Teacher extends Model {};

class Subject extends Model {};

class Auditorium_type extends Model {};

class Auditorium extends Model {};

function internalORM(sequelize) {

    Faculty.init(
        {
            faculty: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            faculty_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: "Faculty",
            tableName: "Faculty",
            timestamps: false
        }
    );

    Pulpit.init(
        {
            pulpit: {
                type: Sequelize.STRING,
                allowNull: false, 
                primaryKey: true
            },
            pulpit_name:{
                type: Sequelize.STRING,
                allowNull: false
            },
            faculty:{
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: Faculty, key: "faculty"
                }
            },
        },
        {
            sequelize,
            modelName: "Pulpit",
            tableName: "Pulpit",
            timestamps: false
        }
    );

    Teacher.init(
        {
            teacher: {
                type: Sequelize.STRING,
                allowNull: false, 
                primaryKey: true
            },
            teacher_name:{
                type: Sequelize.STRING,
                allowNull: false
            },
            pulpit:{
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: Pulpit, key: "pulpit"
                }
            },
        },
        {
            sequelize,
            modelName: "Teacher",
            tableName: "Teacher",
            timestamps: false
        }
    );

    Subject.init(
        {
            subject: {
                type: Sequelize.STRING,
                allowNull: false, 
                primaryKey: true
            },
            subject_name:{
                type: Sequelize.STRING,
                allowNull: false
            },
            pulpit:{
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: Pulpit, key: "pulpit"
                }
            },
        },
        {
            sequelize,
            modelName: "Subject",
            tableName: "Subject",
            timestamps: false
        }
    );

    Auditorium_type.init(
        {
            auditorium_type: {
                type: Sequelize.STRING,
                allowNull: false, 
                primaryKey: true
            },
            auditorium_typename:{
                type: Sequelize.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: "Auditorium_type",
            tableName: "Auditorium_type",
            timestamps: false
        }
    );

    Auditorium.init(
        {
            auditorium: {
                type: Sequelize.STRING,
                allowNull: false, 
                primaryKey: true
            },
            auditorium_name:{
                type: Sequelize.STRING,
                allowNull: false
            },
            auditorium_capacity:{
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            auditorium_type:{
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: Auditorium, key: "auditorium"
                }
            }
        },
        {
            sequelize,
            modelName: "Auditorium",
            tableName: "Auditorium",
            timestamps: false
        }
    );
}
exports.ORM = (s) => {
    internalORM(s);
    return {
        Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium
    };
}

exports.ORM(sequelize);

sequelize.authenticate()
.then(() => {
    console.log("Success connection with DB");
})
.catch(err => {
    console.log(err);
})


const host = "127.0.0.1";
const port = 3000;


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
    response.statusCode = 500;
    response.end(JSON.stringify(errorMsg));
};

const sendData = (response, data) => {
    response.setHeader("Content-Type", "application/json");
    response.statusCode = 200;
    response.end(JSON.stringify(data));
}

const sendSelectQuery = (response, modelName) => {
    modelName.findAll({raw:true})
    .then(result => {
        sendData(response, result);
    })
    .catch( error => {
        console.log(error);
        serverError(response, {error: error.message})
    })
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
                    sendSelectQuery(response, Faculty);
                    break;
                }

                case "/api/pulpits":{
                    sendSelectQuery(response, Pulpit);
                    break;
                }

                case "/api/subjects":{
                    sendSelectQuery(response, Subject);
                    break;
                }

                case "/api/auditoriumstypes":{
                    sendSelectQuery(response, Auditorium_type);
                    break;
                }

                case "/api/auditoriums":{
                    sendSelectQuery(response, Auditorium);
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
                        try{
                            result = JSON.parse(result);
                            Faculty.create({
                                faculty: result["faculty"],
                                faculty_name: result["faculty_name"]
                            })
                            .then(res => {
                                sendData(response, result);
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/pulpits": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Pulpit.create({
                                pulpit: result["pulpit"],
                                pulpit_name: result["pulpit_name"],
                                faculty: result["faculty"]
                            })
                            .then(res => {
                                sendData(response, result);
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/subjects": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Subject.create({
                                subject: result["subject"],
                                subject_name: result["subject_name"],
                                pulpit: result["pulpit"]
                            })
                            .then(res => {
                                sendData(response, result);
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/auditoriumstypes": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Auditorium_type.create({
                                auditorium_type: result["auditorium_type"],
                                auditorium_typename: result["auditorium_typename"],
                            })
                            .then(res => {
                                sendData(response, result);
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/auditoriums": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Auditorium.create({
                                auditorium: result["auditorium"],
                                auditorium_name: result["auditorium_name"],
                                auditorium_capacity: result["auditorium_capacity"],
                                auditorium_type: result["auditorium_type"],
                            })
                            .then(res => {
                                sendData(response, result);
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
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
                        try{
                            result = JSON.parse(result);
                            Faculty.update({
                                faculty_name: result["faculty_name"]
                            }, 
                            {
                                where: {
                                    faculty: result["faculty"]
                                }
                            })
                            .then(res => {
                                if (res.toString() == "0")
                                {
                                    serverError(response, {error: "No avaliable Data"});
                                }
                                else{
                                    sendData(response, result);
                                }
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/pulpits": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Pulpit.update({
                                pulpit_name: result["pulpit_name"],
                                faculty: result["faculty"]
                            }, 
                            {
                                where: {
                                    pulpit: result["pulpit"],
                                }
                            })
                            .then(res => {
                                if (res.toString() == "0")
                                {
                                    serverError(response, {error: "No avaliable Data"});
                                }
                                else{
                                    sendData(response, result);
                                }
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/subjects": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Subject.update({
                                subject_name: result["subject_name"],
                                pulpit: result["pulpit"]
                            }, 
                            {
                                where: {
                                    subject: result["subject"],
                                }
                            })
                            .then(res => {
                                if (res.toString() == "0")
                                {
                                    serverError(response, {error: "No avaliable Data"});
                                }
                                else{
                                    sendData(response, result);
                                }
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/auditoriumstypes": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Auditorium_type.update({
                                auditorium_typename: result["auditorium_typename"],
                            }, 
                            {
                                where: {
                                    auditorium_type: result["auditorium_type"],
                                }
                            })
                            .then(res => {
                                if (res.toString() == "0")
                                {
                                    serverError(response, {error: "No avaliable Data"});
                                }
                                else{
                                    sendData(response, result);
                                }
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
                    })

                    break;
                }

                case "/api/auditoriums": {

                    let result = "";

                    request.on("data", (data) => {
                        result += data;
                    });

                    request.on("end", () => {
                        try{
                            result = JSON.parse(result);
                            Auditorium.update({
                                auditorium_name: result["auditorium_name"],
                                auditorium_capacity: result["auditorium_capacity"],
                                auditorium_type: result["auditorium_type"],
                            }, 
                            {
                                where: {
                                    auditorium: result["auditorium"],
                                }
                            })
                            .then(res => {
                                if (res.toString() == "0")
                                {
                                    serverError(response, {error: "No avaliable Data"});
                                }
                                else{
                                    sendData(response, result);
                                }
                            })
                            .catch(error => {
                                serverError(response, {error: error.message});
                            })
                        }
                        catch(error){
                            serverError(response, {error: error.message});
                        }
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
                let requestParam = decodeURI(request.url).slice(15);
                let deletedData;
                let isInvalidQuery = false;
                
                Faculty.findOne({where: {faculty: requestParam}}).then( data => {
                    if(!data) {
                        isInvalidQuery=true;
                        throw new Error("No such data");
                    }
                    else{
                        deletedData = data;
                    };
                }).then( () => {
                    if (!isInvalidQuery){
                        Faculty.destroy({
                            where:{
                                faculty: requestParam
                            }
                        })
                        .then(() => {
                            sendData(response, deletedData);
                        })
                        .catch( error => {
                            console.log(error);
                            serverError(response, {error: error.message})
                        })
                    }
                })
                .catch( error => {
                    serverError(response, {error: error.message})
                });
                break;
            }
            
            if (decodeURI(request.url).startsWith("/api/pulpits/")){
                let requestParam = decodeURI(request.url).slice(13);

                let deletedData;
                let isInvalidQuery = false;
                
                Pulpit.findOne({where: {pulpit: requestParam}}).then( data => {
                    if(!data) {
                        isInvalidQuery=true;
                        throw new Error("No such data");
                    }
                    else{
                        deletedData = data;
                    };
                }).then( () => {
                    if (!isInvalidQuery){
                        Pulpit.destroy({
                            where:{
                                pulpit: requestParam
                            }
                        })
                        .then(() => {
                            sendData(response, deletedData);
                        })
                        .catch( error => {
                            console.log(error);
                            serverError(response, {error: error.message})
                        })
                    }
                })
                .catch( error => {
                    serverError(response, {error: error.message})
                });

                break;
            }

            if (decodeURI(request.url).startsWith("/api/subjects/")){
                let requestParam = decodeURI(request.url).slice(14);
                
                let deletedData;
                let isInvalidQuery = false;
                
                Subject.findOne({where: {subject: requestParam}}).then( data => {
                    if(!data) {
                        isInvalidQuery=true;
                        throw new Error("No such data");
                    }
                    else{
                        deletedData = data;
                    };
                }).then( () => {
                    if (!isInvalidQuery){
                        Subject.destroy({
                            where:{
                                subject: requestParam
                            }
                        })
                        .then(() => {
                            sendData(response, deletedData);
                        })
                        .catch( error => {
                            console.log(error);
                            serverError(response, {error: error.message})
                        })
                    }
                })
                .catch( error => {
                    serverError(response, {error: error.message})
                });

                break;
            }

            if (decodeURI(request.url).startsWith("/api/auditoriumstypes/")){
                let requestParam = decodeURI(request.url).slice(22);

                let deletedData;
                let isInvalidQuery = false;
                
                Auditorium_type.findOne({where: {auditorium_type: requestParam}}).then( data => {
                    if(!data) {
                        isInvalidQuery=true;
                        throw new Error("No such data");
                    }
                    else{
                        deletedData = data;
                    };
                }).then( () => {
                    if (!isInvalidQuery){
                        Auditorium_type.destroy({
                            where:{
                                auditorium_type: requestParam
                            }
                        })
                        .then(() => {
                            sendData(response, deletedData);
                        })
                        .catch( error => {
                            console.log(error);
                            serverError(response, {error: error.message})
                        })
                    }
                })
                .catch( error => {
                    serverError(response, {error: error.message})
                });

                break;
            }

            if (decodeURI(request.url).startsWith("/api/auditoriums/")){
                let requestParam = decodeURI(request.url).slice(17);

                let deletedData;
                let isInvalidQuery = false;

                Auditorium.findOne({where: {auditorium: requestParam}}).then( data => {
                    if(!data) {
                        isInvalidQuery=true;
                        throw new Error("No such data");
                    }
                    else{
                        deletedData = data;
                    };
                }).then( () => {
                    if (!isInvalidQuery){
                        Auditorium.destroy({
                            where:{
                                auditorium: requestParam
                            }
                        })
                        .then(() => {
                            sendData(response, deletedData);
                        })
                        .catch( error => {
                            console.log(error);
                            serverError(response, {error: error.message})
                        })
                    }
                })
                .catch( error => {
                    serverError(response, {error: error.message})
                });

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